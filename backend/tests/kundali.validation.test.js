jest.mock('../src/database/pool', () => ({
  pool: { query: jest.fn(), getConnection: jest.fn() },
  withTransaction: jest.fn(),
}));
jest.mock('../src/services/kundaliService');

const request = require('supertest');
const app = require('../src/app');
const kundaliService = require('../src/services/kundaliService');

describe('POST /api/v1/kundalis validation', () => {
  const validPayload = {
    fullName: 'Test User',
    dateOfBirth: '1990-05-15',
    timeOfBirth: '14:30',
    placeOfBirth: 'Pune, Maharashtra, India',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects missing fullName', async () => {
    const res = await request(app)
      .post('/api/v1/kundalis')
      .send({ ...validPayload, fullName: '' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    expect(res.body.details.some((d) => d.field === 'fullName')).toBe(true);
  });

  it('rejects invalid dateOfBirth format', async () => {
    const res = await request(app)
      .post('/api/v1/kundalis')
      .send({ ...validPayload, dateOfBirth: '15-05-1990' });

    expect(res.status).toBe(422);
    expect(res.body.details.some((d) => d.field === 'dateOfBirth')).toBe(true);
  });

  it('rejects a future date of birth', async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10);
    const res = await request(app)
      .post('/api/v1/kundalis')
      .send({ ...validPayload, dateOfBirth: futureDate });

    expect(res.status).toBe(422);
  });

  it('rejects invalid timeOfBirth format', async () => {
    const res = await request(app)
      .post('/api/v1/kundalis')
      .send({ ...validPayload, timeOfBirth: '25:99' });

    expect(res.status).toBe(422);
    expect(res.body.details.some((d) => d.field === 'timeOfBirth')).toBe(true);
  });

  it('rejects missing placeOfBirth', async () => {
    const res = await request(app)
      .post('/api/v1/kundalis')
      .send({ ...validPayload, placeOfBirth: '' });

    expect(res.status).toBe(422);
  });

  it('rejects unsupported language preference', async () => {
    const res = await request(app)
      .post('/api/v1/kundalis')
      .send({ ...validPayload, languagePreference: 'fr' });

    expect(res.status).toBe(422);
  });

  it('accepts a valid payload and calls the service', async () => {
    kundaliService.generateAndSaveKundali.mockResolvedValue({ id: 1, fullName: 'Test User', accessToken: 'token-123' });

    const res = await request(app).post('/api/v1/kundalis').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(kundaliService.generateAndSaveKundali).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: 'Test User' }),
      null
    );
  });
});
