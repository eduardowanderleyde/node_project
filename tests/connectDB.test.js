const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Database Connection', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  it('deve lançar erro quando MONGODB_URI não está definido', async () => {
    delete process.env.MONGODB_URI;
    await expect(connectDB()).rejects.toThrow('MONGODB_URI não está definido');
  });

  it('deve lançar erro quando a conexão falha', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/invalid-db';
    await expect(connectDB()).rejects.toThrow();
  });

  it('deve conectar com sucesso quando MONGODB_URI é válido', async () => {
    process.env.MONGODB_URI = mongoServer.getUri();
    await expect(connectDB()).resolves.not.toThrow();
    expect(mongoose.connection.readyState).toBe(1);
  });
});
