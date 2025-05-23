// Mocking Redis module
jest.mock('../src/config/redis', () => {
  const actual = jest.requireActual('../src/config/redis');
  return {
    ...actual,
    redisClient: {
      get: jest.fn().mockResolvedValue(null),
      setEx: jest.fn().mockResolvedValue(),
      flushAll: jest.fn().mockResolvedValue(),
      isOpen: true
    },
    isConnected: true
  };
});

const cacheMiddleware = require('../src/middlewares/cache');
const { redisClient } = require('../src/config/redis');
const request = require('supertest');
const app = require('../src/app');

describe('Cache Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(async () => {
    req = {
      method: 'GET',
      originalUrl: '/test'
    };
    res = {
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();

    if (redisClient.flushAll) {
      await redisClient.flushAll();
    }
  });

  it('should store response in cache', async () => {
    const middleware = cacheMiddleware(60);
    const responseData = { data: 'test' };

    res.json = function (data) {
      this.data = data;
      return this;
    };

    await middleware(req, res, next);
    res.json(responseData);

    expect(redisClient.setEx).toHaveBeenCalledWith(
      'cache:/test',
      60,
      JSON.stringify(responseData)
    );
  });

  it('should retrieve response from cache', async () => {
    const cachedData = { data: 'cached' };
    redisClient.get.mockResolvedValueOnce(JSON.stringify(cachedData));

    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith(cachedData);
    expect(next).not.toHaveBeenCalled();
  });

  it('should skip cache for non-GET methods', async () => {
    req.method = 'POST';
    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);

    expect(redisClient.get).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should continue without cache when Redis is disconnected', async () => {
    redisClient.isOpen = false;

    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);

    expect(redisClient.get).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();

    redisClient.isOpen = true;
  });

  it('should handle error when reading from cache', async () => {
    redisClient.get.mockRejectedValueOnce(new Error('Redis error'));

    const middleware = cacheMiddleware(60);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

});
