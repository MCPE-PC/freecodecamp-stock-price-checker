'use strict';

const crypto = require('node:crypto');

const likesMap = new Map();

function apiRoutes(app) {
	app.route('/api/stock-prices').get(async (request, response) => {
		const symbol = request.query.stock?.toLowerCase().trim();

		if (typeof symbol !== 'string' || symbol === '') {
			response.status(400).json({error: 'No symbol'});
			return;
		}

		let set = likesMap.get(symbol);

		if (set === undefined) {
			set = new Set();
			likesMap.set(symbol, set);
		}

		if (request.query.like) {
			set.add(crypto.hash('sha1', request.ip));
		}

		const apiResponse = await fetch(
			`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`,
		);

		const json = await apiResponse.json();

		if (typeof json === 'string') {
			response.status(404).json({error: json});

			return;
		}

		response.json({
			stockData: {
				stock: json.symbol,
				price: json.latestPrice,
				likes: set.size,
			},
		});
	});
}

module.exports = apiRoutes;
