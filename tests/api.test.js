const request = require('supertest');
const app = require('../src/app');

// Portfolio API test suite
describe('API de Portfólio', () => {
    // Test main route
    it('deve retornar mensagem de boas-vindas', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('API Portfolio is running');
    });

    // Test health route
    it('deve retornar status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    // Test projects route
    it('deve retornar lista de projetos', async () => {
        const res = await request(app).get('/api/projects');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }, 20000);

    // Test skills route
    it('deve retornar lista de habilidades', async () => {
        const res = await request(app).get('/api/skills');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }, 20000);
}); 

afterAll(async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
}); 