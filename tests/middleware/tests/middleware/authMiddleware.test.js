const auth = require('../../../src/middlewares/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware (unit)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('deve retornar 401 se não houver header Authorization', () => {
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se header Authorization estiver malformado', () => {
    req.headers.authorization = 'TokenInvalido';

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se o token for inválido', () => {
    req.headers.authorization = 'Bearer tokeninvalido';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next e atribuir req.user se o token for válido', () => {
    const decoded = { id: '123', email: 'user@example.com' };
    req.headers.authorization = 'Bearer tokenvalido';
    jwt.verify.mockReturnValue(decoded);

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('tokenvalido', process.env.JWT_SECRET);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });
});
