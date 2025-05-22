const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('App Configuration', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Rotas Básicas', () => {
    it('deve retornar mensagem de boas-vindas na rota raiz', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('API Portfolio is running');
    });

    it('deve retornar status ok no health check', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Middleware de Logger', () => {
    it('deve registrar requisições HTTP', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      await request(app).get('/health');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
}); 