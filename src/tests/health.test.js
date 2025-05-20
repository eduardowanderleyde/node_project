// Import supertest to make HTTP requests to the app
const request = require('supertest');
// Import the Express app instance
const app = require('../app');

// Group related tests for the /health endpoint
describe('Health Check Endpoint', () => {
  // Test if the /health endpoint returns the expected response
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200); // Should return HTTP 200
    expect(res.body).toHaveProperty('status', 'ok'); // Should return { status: 'ok' }
  });
}); 