const chaiModule = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

const chai = chaiModule.use(chaiHttp);

const assert = chai.assert; // Required by freeCodeCamp

const stock = 'goog';
const stock2 = 'msft';

suite('Functional Tests', () => {
	const requester = chai.request(app).keepOpen();

	after(() => {
		requester.close();
	});

	it('Viewing one stock', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock})
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});

	it('Viewing one stock and liking it', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock, like: 'true'})
			.send()
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});

	it('Viewing the same stock and liking it again', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock, like: 'true'})
			.send()
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});

	it('Viewing two stocks', (done) => {
		let dones = 0;

		const doneOne = () => {
			dones += 1;

			if (dones > 1) {
				done();
			}
		};

		requester
			.get('/api/stock-prices')
			.query({stock})
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				doneOne();
			});

		requester
			.get('/api/stock-prices')
			.query({stock: stock2})
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				doneOne();
			});
	});

	it('Viewing two stocks and liking them', (done) => {
		let dones = 0;

		const doneOne = () => {
			dones += 1;

			if (dones > 1) {
				done();
			}
		};

		requester
			.get('/api/stock-prices')
			.query({stock, like: 'true'})
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				doneOne();
			});

		requester
			.get('/api/stock-prices')
			.query({stock: stock2, like: 'true'})
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				doneOne();
			});
	});
});
