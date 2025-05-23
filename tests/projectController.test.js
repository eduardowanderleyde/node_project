// tests/projectController.test.js

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

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
  };

  describe('index', () => {
    it('deve retornar lista de projetos', async () => {
      await Project.create({ title: 'Test', description: 'desc', technologies: [], imageUrl: '', projectUrl: '' });
      const res = mockRes();
      await projectController.index({}, res);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ title: 'Test' })]));
    });

    it('deve retornar 500 em erro interno', async () => {
      const res = mockRes();
      jest.spyOn(Project, 'find').mockRejectedValue(new Error('fail'));
      await projectController.index({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('create', () => {
    it('deve criar projeto com dados válidos', async () => {
      const req = { body: { title: 'New', description: 'desc', technologies: [], imageUrl: '', projectUrl: '' } };
      const res = mockRes();
      await projectController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar 400 com dados inválidos', async () => {
      const req = { body: {} };
      const res = mockRes();
      await projectController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('show', () => {
    it('deve retornar projeto existente', async () => {
      const project = await Project.create({ title: 'Show', description: 'desc', technologies: [], imageUrl: '', projectUrl: '' });
      const req = { params: { id: project._id } };
      const res = mockRes();
      await projectController.show(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Show' }));
    });

    it('deve retornar 404 se não encontrado', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = mockRes();
      await projectController.show(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 400 se ID inválido', async () => {
      const req = { params: { id: 'invalid' } };
      const res = mockRes();
      await projectController.show(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update', () => {
    it('deve atualizar com sucesso', async () => {
      const project = await Project.create({ title: 'Old', description: 'desc', technologies: [], imageUrl: '', projectUrl: '' });
      const req = { params: { id: project._id }, body: { title: 'Updated' } };
      const res = mockRes();
      await projectController.update(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated' }));
    });

    it('deve retornar 400 com tipos inválidos', async () => {
      const project = await Project.create({ title: 'Old', description: 'desc', technologies: [], imageUrl: '', projectUrl: '' });
      const req = { params: { id: project._id }, body: { title: 123 } };
      const res = mockRes();
      await projectController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar 404 se não encontrado', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: { title: 'Updated' } };
      const res = mockRes();
      await projectController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 400 se ID inválido', async () => {
      const req = { params: { id: 'invalid' }, body: { title: 'Updated' } };
      const res = mockRes();
      await projectController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar 400 se description, technologies ou imageUrl forem do tipo errado', async () => {
      const project = await Project.create({
        title: 'Teste',
        description: 'desc',
        technologies: [],
        imageUrl: '',
        projectUrl: ''
      });
    
      const req = {
        params: { id: project._id },
        body: {
          description: 123, // deveria ser string
          technologies: 'não é array', // deveria ser array
          imageUrl: 456 // deveria ser string
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
    
  });

  describe('destroy', () => {
    it('deve deletar projeto existente', async () => {
      const project = await Project.create({ title: 'Del', description: 'desc', technologies: [], imageUrl: '', projectUrl: '' });
      const req = { params: { id: project._id } };
      const res = mockRes();
      await projectController.destroy(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deve retornar 404 se não encontrado', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = mockRes();
      await projectController.destroy(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 400 se ID inválido', async () => {
      const req = { params: { id: 'invalid' } };
      const res = mockRes();
      await projectController.destroy(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
