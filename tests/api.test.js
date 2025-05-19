const request = require('supertest');
const app = require('../index');

describe('API de Portfólio', () => {
    // Teste da rota principal
    test('GET /api - deve retornar informações da API', async () => {
        const response = await request(app).get('/api');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome');
        expect(response.body).toHaveProperty('versao');
        expect(response.body).toHaveProperty('descricao');
    });

    // Teste da rota de projetos
    test('GET /api/projetos - deve retornar lista de projetos', async () => {
        const response = await request(app).get('/api/projetos');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('projetos');
        expect(Array.isArray(response.body.projetos)).toBe(true);
        expect(response.body.projetos.length).toBeGreaterThan(0);
    });

    // Teste da rota de habilidades
    test('GET /api/habilidades - deve retornar lista de habilidades', async () => {
        const response = await request(app).get('/api/habilidades');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('habilidades');
        expect(Array.isArray(response.body.habilidades)).toBe(true);
        expect(response.body.habilidades.length).toBeGreaterThan(0);
    });

    // Teste da rota de health check
    test('GET /health - deve retornar status da API', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('timestamp');
    });
}); 