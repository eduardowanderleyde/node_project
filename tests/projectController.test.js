const mongoose = require('mongoose');
const Project = require('../src/models/Project');
const projectController = require('../src/controllers/projectController');

describe('Project Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Project.deleteMany({});
  });

  describe('create', () => {
    it('deve retornar erro 400 ao criar projeto com dados inválidos', async () => {
      const req = {
        body: {
          // Dados inválidos: faltando campos obrigatórios
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await projectController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });

  describe('update', () => {
    it('deve retornar erro 400 ao atualizar com tipos de dados inválidos', async () => {
      const project = await Project.create({
        title: 'Test Project',
        description: 'Test Description',
        technologies: ['Node.js'],
        imageUrl: 'http://example.com/image.jpg',
        projectUrl: 'http://example.com'
      });

      const req = {
        params: { id: project._id },
        body: {
          title: 123,
          description: 456,
          technologies: 'não é um array',
          imageUrl: 789,
          projectUrl: 101112
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await projectController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });

    it('deve retornar erro 404 ao atualizar projeto inexistente', async () => {
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        body: {
          title: 'Updated Title'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await projectController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('show', () => {
    it('deve retornar erro 404 ao buscar projeto inexistente', async () => {
      const req = {
        params: { id: new mongoose.Types.ObjectId() }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await projectController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('destroy', () => {
    it('deve retornar erro 404 ao deletar projeto inexistente', async () => {
      const req = {
        params: { id: new mongoose.Types.ObjectId() }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await projectController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
}); 