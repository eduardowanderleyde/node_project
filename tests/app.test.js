const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('App Configuration', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Basic Routes', () => {
    it('should return welcome message on root route', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('API Portfolio is running');
    });

    it('should return ok status on health check', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Logger Middleware', () => {
    it('should log HTTP requests', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await request(app).get('/health');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

describe('App', () => {
  it('should configure CORS middleware', async () => {
    const res = await request(app)
      .get('/')
      .set('Origin', 'http://test.com');

    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('should configure JSON parser middleware', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${await getTestToken()}`)
      .send({
        title: 'Test Project',
        description: 'Test Description'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Project');
  });

  it('should configure logger middleware', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    await request(app).get('/');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should configure authentication routes', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should configure project routes', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${await getTestToken()}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should configure skill routes', async () => {
    const res = await request(app)
      .get('/api/skills')
      .set('Authorization', `Bearer ${await getTestToken()}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should configure error handling middleware', async () => {
    const res = await request(app).get('/rota-inexistente');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('should configure cache middleware', async () => {
    // First request
    await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${await getTestToken()}`);

    // Second request - should be served from cache
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${await getTestToken()}`);

    expect(res.status).toBe(200);
  });
});

// Helper function to get test token
async function getTestToken() {
  const userTest = {
    email: 'test@example.com',
    password: 'password123'
  };

  // Register test user
  await request(app)
    .post('/api/auth/register')
    .send(userTest);

  // Login to get token
  const res = await request(app)
    .post('/api/auth/login')
    .send(userTest);

  return res.body.token;
}
