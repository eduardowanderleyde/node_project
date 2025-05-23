const { redisClient, isConnected } = require('../config/redis');

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Skip cache for non-GET methods
    if (req.method !== 'GET') {
      return next();
    }

    // If Redis is not connected or not open, skip cache
    if (!isConnected || !redisClient.isOpen) {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redisClient.get(key);
    
      if (cachedResponse) {
        try {
          return res.json(JSON.parse(cachedResponse));
        } catch (parseError) {
          console.error('Erro ao fazer parse do cache:', parseError);
        }
      }
    
      // Intercepta a resposta original
      const originalJson = res.json;
      res.json = function (body) {
        try {
          redisClient.setEx(key, duration, JSON.stringify(body));
        } catch (error) {
          console.error('Erro ao armazenar no cache:', error);
        }
    
        return originalJson.call(this, body);
      };
    
      next();
    } catch (error) {
      console.error('Erro no cache:', error);
      next();
    }
    
  };
};

module.exports = cacheMiddleware;
