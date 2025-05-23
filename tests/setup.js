require('dotenv').config({ path: '.env.test' });

jest.setTimeout(30000);

afterEach(() => {
  jest.clearAllMocks();
});

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_test';

const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
