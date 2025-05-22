// Configuração global para os testes
require('dotenv').config({ path: '.env.test' });

// Aumentar o timeout para operações assíncronas
jest.setTimeout(30000);

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_test';

// Limpar o banco de dados antes de cada teste
beforeEach(async () => {
  const mongoose = require('mongoose');
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
});

// Fechar conexão após todos os testes
afterAll(async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
}); 