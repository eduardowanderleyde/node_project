require('dotenv').config();
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const app = require('./app');

// Connect to the database and Redis
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    // Start the server
    app.listen(process.env.PORT || 3000, () => 
      console.log(`Server is running on port ${process.env.PORT || 3000}`)
    );
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
