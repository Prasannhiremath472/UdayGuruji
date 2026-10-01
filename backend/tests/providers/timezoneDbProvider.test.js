const mockGet = jest.fn();
jest.mock('axios', () => ({
  create: jest.fn(() => ({ get: mockGet })),
}));

const timezoneDbProvider = require('../../src/providers/timezone/timezoneDbProvider');

describe('timezoneDbProvider.resolve', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('returns normalized timezone and UTC offset in minutes', async () => {
    mockGet.mockResolvedValue({
      data: { status: 'OK', zoneName: 'Asia/Kolkata', gmtOffset: 19800 },
    });

    const result = await timezoneDbProvider.resolve({ latitude: 18.52, longitude: 73.85, timestamp: 1000000 });

    expect(result.timezone).toBe('Asia/Kolkata');
    expect(result.utcOffsetMinutes).toBe(330);
  });

  it('throws a 502 ApiError when the provider status is not OK', async () => {
    mockGet.mockResolvedValue({ data: { status: 'FAILED', message: 'invalid location' } });

    await expect(
      timezoneDbProvider.resolve({ latitude: 0, longitude: 0, timestamp: 1000000 })
    ).rejects.toMatchObject({ statusCode: 502, errorCode: 'TIMEZONE_PROVIDER_ERROR' });
  });

  it('throws a 502 ApiError on network failure', async () => {
    mockGet.mockRejectedValue(new Error('timeout'));

    await expect(
      timezoneDbProvider.resolve({ latitude: 0, longitude: 0, timestamp: 1000000 })
    ).rejects.toMatchObject({ statusCode: 502, errorCode: 'TIMEZONE_PROVIDER_ERROR' });
  });
});
