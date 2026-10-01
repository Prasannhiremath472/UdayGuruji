jest.mock('../src/repositories/userRepository');

const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../src/app');
const userRepository = require('../src/repositories/userRepository');

describe('POST /api/v1/auth/login', () => {
  const plainPassword = 'CorrectPassword123!';
  let passwordHash;

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(plainPassword, 4);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects invalid email format', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'not-an-email', password: 'x' });
    expect(res.status).toBe(422);
  });

  it('rejects missing password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@example.com' });
    expect(res.status).toBe(422);
  });

  it('rejects a login for a non-existent user without leaking which field was wrong', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever123' });

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('INVALID_CREDENTIALS');
  });

  it('rejects an incorrect password', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin', password_hash: passwordHash,
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('INVALID_CREDENTIALS');
  });

  it('logs in successfully with correct credentials and never returns the password hash', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin', password_hash: passwordHash,
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: plainPassword });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user).toEqual({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' });
    expect(JSON.stringify(res.body)).not.toContain(passwordHash);
  });
});

describe('GET /api/v1/auth/me', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('AUTH_REQUIRED');
  });

  it('rejects requests with a malformed token', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe('INVALID_TOKEN');
  });
});
