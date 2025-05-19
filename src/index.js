const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes.js');
const logger = require('./middlewares/logger');

// Middleware
app.use(express.json());
app.use(logger); // Logs all requests

// Routes
app.use('/api/projects', projectRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(3000, () => console.log('Server is running on port 3000'));
