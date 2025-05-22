const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');

describe('Database Connection', () => {
  beforeEach(async () => {
    // Fecha a conexão se estiver aberta
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  afterEach(async () => {
    // Fecha a conexão após cada teste
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
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    
    await expect(connectDB()).resolves.not.toThrow();
    expect(mongoose.connection.readyState).toBe(1);
  });
}); 