const request = require('supertest');
const app = require('../src/app');

describe('GET /books', () => {
  it('should return list of books', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
