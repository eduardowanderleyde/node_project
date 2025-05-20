require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes.js');
const authRoutes = require('./routes/authRoutes');
const logger = require('./middlewares/logger');

app.use(express.json());
app.use(logger);


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API Portfolio is running');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(3000, () => console.log('Server is running on port 3000'));
