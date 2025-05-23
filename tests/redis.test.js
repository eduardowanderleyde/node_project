const { redisClient, connectRedis } = require('../src/config/redis');

describe('Redis Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  it('deve conectar ao Redis com sucesso', async () => {
    await expect(connectRedis()).resolves.not.toThrow();
    expect(redisClient.isOpen).toBe(true); // Usando isOpen em vez de isConnected
  });

  it('deve lidar com erro de conexão', async () => {
    const originalUrl = process.env.REDIS_URL;
    process.env.REDIS_URL = 'redis://invalid-url';
    
    await expect(connectRedis()).rejects.toThrow();
    expect(redisClient.isOpen).toBe(false); // Verificação do estado da conexão
    
    process.env.REDIS_URL = originalUrl;
  });

  it('deve lidar com eventos de erro', async () => {
    redisClient.emit('error', new Error('Test error'));
  
    await new Promise((res) => setTimeout(res, 50));
  
    expect(redisClient.isOpen).toBe(false);
  });
  
  

  it('deve lidar com eventos de conexão', () => {
    const connectHandler = jest.fn();
    redisClient.on('connect', connectHandler);
    
    redisClient.emit('connect');
    expect(connectHandler).toHaveBeenCalled();
    expect(redisClient.isOpen).toBe(true); // Verificando se a conexão foi estabelecida
  });

  it('deve implementar retry strategy corretamente', () => {
    const retryStrategy = redisClient.options.retry_strategy;
    
    // Teste de erro de conexão recusada
    expect(retryStrategy({ error: { code: 'ECONNREFUSED' } }))
      .toBeInstanceOf(Error);
    
    // Teste de tempo limite excedido
    expect(retryStrategy({ total_retry_time: 1000 * 60 * 60 + 1 }))
      .toBeInstanceOf(Error);
    
    // Teste de tentativas excedidas
    expect(retryStrategy({ attempt: 11 })).toBeUndefined();
    
    // Teste de retry normal
    expect(retryStrategy({ attempt: 1 })).toBe(100);
  });
});
