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

	test('Viewing one stock', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock})
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});

	test('Viewing one stock and liking it', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock, like: 'true'})
			.send()
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});

	test('Viewing the same stock and liking it again', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock, like: 'true'})
			.send()
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});

	test('Viewing two stocks', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock: [stock, stock2]})
			.send()
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});

	test('Viewing two stocks and liking them', (done) => {
		requester
			.get('/api/stock-prices')
			.query({stock: [stock, stock2], like: 'true'})
			.send()
			.end((error, response) => {
				assert.strictEqual(response.status, 200);

				done();
			});
	});
});
