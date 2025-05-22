const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Autenticação', () => {
  const userTest = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('Registro', () => {
    it('deve registrar um novo usuário', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(userTest);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('deve retornar erro ao registrar email duplicado', async () => {
      await User.create({
        email: userTest.email,
        password: 'hashedpassword'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send(userTest);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already registered');
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send(userTest);
    });

    it('deve fazer login com credenciais válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(userTest);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: userTest.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('Middleware de Autenticação', () => {
    let token;

    beforeEach(async () => {
      const user = await User.create({
        email: userTest.email,
        password: 'hashedpassword',
        role: 'user'
      });

      token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    });

    it('deve permitir acesso com token válido', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).not.toBe(401);
    });

    it('deve negar acesso sem token', async () => {
      const res = await request(app)
        .get('/api/projects');

      expect(res.status).toBe(401);
    });

    it('deve negar acesso com token inválido', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });

  describe('Middleware de Admin', () => {
    let adminToken;
    let userToken;

    beforeEach(async () => {
      const admin = await User.create({
        email: 'admin@example.com',
        password: 'hashedpassword',
        role: 'admin'
      });

      const user = await User.create({
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'user'
      });

      adminToken = jwt.sign(
        { userId: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      userToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    });

    it('deve permitir acesso a admin', async () => {
      const res = await request(app)
        .get('/api/admin/projects')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).not.toBe(403);
    });

    it('deve negar acesso a usuário comum', async () => {
      const res = await request(app)
        .get('/api/admin/projects')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
}); 