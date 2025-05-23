const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',  // Alterar de '127.0.0.1' para 'redis'
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('O servidor Redis recusou a conexão');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Tempo limite de retry excedido');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});


let isConnected = false;

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  isConnected = false;
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
  isConnected = true;
});

const connectRedis = async () => {
  try {
    if (!isConnected) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error('Error connecting to Redis:', error.message);
    throw error;
  }
};

module.exports = { redisClient, connectRedis, isConnected }; 