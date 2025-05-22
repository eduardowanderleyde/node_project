// src/app.js
require('dotenv').config();
const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes.js');
const authRoutes = require('./routes/authRoutes');
const logger = require('./middlewares/logger');
const apiRoutes = require('./routes'); // Import main API routes
const { connectDB } = require('./config/db');

// Verificar se MONGODB_URI está definido
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI não está definido nas variáveis de ambiente');
  process.exit(1);
}

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Falha ao conectar ao MongoDB:', err);
  // Não encerrar o processo em ambiente de teste
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
});

// Middleware to parse JSON
app.use(express.json());
// Custom logger middleware
app.use(logger);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes); // Add main API routes (for /api/skills and /api/projects)
app.use('/api/projects', projectRoutes); // Project RESTful routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Default route
app.get('/', (req, res) => {
  res.send('API Portfolio is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app; 