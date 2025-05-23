const mongoose = require('mongoose');
const Skill = require('../src/models/Skill');
const skillController = require('../src/controllers/skillController');

jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('Skill Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Skill.deleteMany({});
  });

  describe('create', () => {
    it('should create skill with valid data', async () => {
      const req = { body: { name: 'Node', level: 'Advanced', category: 'Backend' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await skillController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Node' }));
    });

    it('should return 400 with invalid data', async () => {
      const req = { body: { level: 'Advanced' } }; // missing name
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await skillController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('should return 500 on internal error', async () => {
      jest.spyOn(Skill.prototype, 'save').mockImplementationOnce(() => { throw new Error('DB error'); });

      const req = { body: { name: 'Fail', level: 'X', category: 'Y' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await skillController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
  });

  describe('index', () => {
    it('should list all skills', async () => {
      await Skill.create({ name: 'Node', level: 'Advanced', category: 'Backend' });
      const req = {};
      const res = { json: jest.fn() };

      await skillController.index(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'Node' })
      ]));
    });
  });

  describe('show', () => {
    it('should return 404 for non-existent skill', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await skillController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });

    it('should return 400 for invalid ID format', async () => {
      const req = { params: { id: 'abc' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await skillController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('should return skill by ID', async () => {
      const skill = await Skill.create({ name: 'JS', level: 'Intermediate', category: 'Frontend' });
      const req = { params: { id: skill._id } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.show(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'JS' }));
    });
  });

  describe('update', () => {
    it('should update skill with valid data', async () => {
      const skill = await Skill.create({ name: 'Old', level: 'Beginner', category: 'Test' });
      const req = { params: { id: skill._id }, body: { name: 'New' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.update(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'New' }));
    });

    it('should return 400 for invalid data', async () => {
      const skill = await Skill.create({ name: 'Invalid', level: 'Basic', category: 'Test' });
      const req = { params: { id: skill._id }, body: { level: 123 } }; // invalid type
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid ID', async () => {
      const req = { params: { id: 'invalid-id' }, body: {} };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if skill not found', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: { name: 'Test' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 on internal error', async () => {
      jest.spyOn(Skill, 'findByIdAndUpdate').mockImplementationOnce(() => { throw new Error('DB error'); });
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: { name: 'Any' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('destroy', () => {
    it('should delete skill by ID', async () => {
      const skill = await Skill.create({ name: 'Delete', level: 'Any', category: 'Any' });
      const req = { params: { id: skill._id } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Skill deleted successfully' });
    });

    it('should return 404 if skill not found', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 for invalid ID format', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 500 on internal error', async () => {
      jest.spyOn(Skill, 'findByIdAndDelete').mockImplementationOnce(() => { throw new Error('Fail'); });
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await skillController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
