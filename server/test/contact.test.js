const request = require('supertest');
const app = require('../index');

describe('POST /api/contact', () => {
  test('returns 400 when required fields missing', async () => {
    const res = await request(app).post('/api/contact').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when honeypot is filled', async () => {
    const res = await request(app).post('/api/contact').send({ email: 'a@b.com', message: 'hi', hp: 'spam' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Spam detected');
  });

  test('rate limits after many requests', async () => {
    // make many quick requests to trigger rate limiter (windowMs=15min, max=12)
    const promises = [];
    for (let i = 0; i < 14; i++) {
      promises.push(request(app).post('/api/contact').send({ email: 'test@example.com', message: 'hello ' + i }));
    }

    const results = await Promise.all(promises);
    // at least one should be 429
    const has429 = results.some(r => r.statusCode === 429);
    expect(has429).toBe(true);
  }, 20000);
});
