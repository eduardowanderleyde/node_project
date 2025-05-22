const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Rotas da API', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Criar usuário admin
    const admin = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    // Criar usuário comum
    const user = await User.create({
      email: 'user@test.com',
      password: 'password123',
      role: 'user'
    });

    // Gerar tokens
    adminToken = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    userToken = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Rotas de Admin', () => {
    it('deve permitir acesso a /admin/projects para admin', async () => {
      const response = await request(app)
        .get('/api/admin/projects')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
    });

    it('deve permitir acesso a /admin/skills para admin', async () => {
      const response = await request(app)
        .get('/api/admin/skills')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
    });

    it('deve negar acesso a /admin/projects para usuário comum', async () => {
      const response = await request(app)
        .get('/api/admin/projects')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(403);
    });

    it('deve negar acesso a /admin/skills para usuário comum', async () => {
      const response = await request(app)
        .get('/api/admin/skills')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(403);
    });

    it('deve retornar erro 500 ao ocorrer erro interno no servidor', async () => {
      // Mock do Project.find para lançar erro
      jest.spyOn(mongoose.Model, 'find').mockImplementationOnce(() => {
        throw new Error('Erro interno');
      });

      const response = await request(app)
        .get('/api/admin/projects')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rotas Protegidas', () => {
    it('deve negar acesso a /projects sem token', async () => {
      const response = await request(app).get('/api/projects');
      expect(response.status).toBe(401);
    });

    it('deve negar acesso a /skills sem token', async () => {
      const response = await request(app).get('/api/skills');
      expect(response.status).toBe(401);
    });

    it('deve permitir acesso a /projects com token válido', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
    });

    it('deve permitir acesso a /skills com token válido', async () => {
      const response = await request(app)
        .get('/api/skills')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
    });
  });
}); 