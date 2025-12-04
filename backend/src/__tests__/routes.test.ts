import request from 'supertest';
import app from '../server';

describe('routes', () => {
  it('health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body?.data?.status).toBe('ok');
  });
});


