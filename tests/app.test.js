const request = require('supertest');
const app = require('../src/app');

describe('📚 Books API', () => {
  it('GET /books - should return a list of books', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('🩺 Health Check API', () => {
  it('GET /health - should return UP status and timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('📊 Metrics API', () => {
  it('GET /metrics - should return dummy metric string', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('dummy_metric');
  });
});
