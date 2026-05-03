const request = require('supertest');
const app = require('../index');

describe('GET /api/health', () => {
  test('returns 200 and json body', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('time');
  });
});
