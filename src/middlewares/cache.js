const { redisClient } = require('../config/redis');

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    // Don't use cache for methods that modify data
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      // Intercept original response
      const originalJson = res.json;
      res.json = function (body) {
        // Store in cache
        redisClient.setEx(key, duration, JSON.stringify(body));
        // Restore original method
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

module.exports = cacheMiddleware; 