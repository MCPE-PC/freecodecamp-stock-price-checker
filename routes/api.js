'use strict';

const crypto = require('node:crypto');
const ipaddr = require('ipaddr.js');

const likesMap = new Map();

function apiRoutes(app) {
	app.route('/api/stock-prices').get(async (request, response) => {
		const symbols = Array.isArray(request.query.stock)
			? request.query.stock
			: [request.query.stock];

		const promises = [];
		const sets = [];

		if (symbols.length > 2) {
			response.status(400).json({error: 'One or two stock(s) only'});
			return;
		}

		for (let symbol of symbols) {
			if (typeof symbol !== 'string' || symbol === '') {
				response.status(400).json({error: 'No symbol'});
				return;
			}

			symbol = symbol.toLowerCase().trim();

			let set = likesMap.get(symbol);

			if (set === undefined) {
				set = new Set();
				likesMap.set(symbol, set);
			}

			if (request.query.like) {
				set.add(
					crypto.hash('sha1', ipaddr.process(request.ip).toNormalizedString()),
				);
			}

			promises.push(
				fetch(
					`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`,
				),
			);

			sets.push(set);
		}

		const responses = await Promise.all(promises);
		const jsons = await Promise.all(
			responses.map((apiResponse) => apiResponse.json()),
		);

		for (const json of jsons) {
			if (typeof json === 'string') {
				response.status(404).json({error: json});

				return;
			}
		}

		const stockData = jsons.map((json, index) => ({
			stock: json.symbol,
			price: json.latestPrice,
			likes: sets[index].size,
		}));

		response.json({
			stockData:
				stockData.length === 1
					? stockData[0]
					: stockData.map((data, index) => ({
							stock: data.stock,
							price: data.price,
							// eslint-disable-next-line camelcase
							rel_likes: data.likes - stockData[1 - index].likes,
						})),
		});
	});
}

module.exports = apiRoutes;
