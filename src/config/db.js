const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI não está definido nas variáveis de ambiente');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado com sucesso');
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;
