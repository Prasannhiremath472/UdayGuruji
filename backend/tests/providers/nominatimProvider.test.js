const mockGet = jest.fn();
jest.mock('axios', () => ({
  create: jest.fn(() => ({ get: mockGet })),
}));

const nominatimProvider = require('../../src/providers/geocoding/nominatimProvider');

describe('nominatimProvider.resolve', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('returns normalized lat/lng for a resolvable place', async () => {
    mockGet.mockResolvedValue({
      data: [{ lat: '18.5204303', lon: '73.8567437', display_name: 'Pune, Maharashtra, India' }],
    });

    const result = await nominatimProvider.resolve('Pune, India');

    expect(result.latitude).toBeCloseTo(18.5204303);
    expect(result.longitude).toBeCloseTo(73.8567437);
    expect(result.resolvedPlaceName).toBe('Pune, Maharashtra, India');
  });

  it('throws a 422 ApiError when no results are found', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await expect(nominatimProvider.resolve('Nowhereville')).rejects.toMatchObject({
      statusCode: 422,
      errorCode: 'PLACE_NOT_FOUND',
    });
  });

  it('throws a 502 ApiError when the provider request fails', async () => {
    mockGet.mockRejectedValue(new Error('network down'));

    await expect(nominatimProvider.resolve('Pune, India')).rejects.toMatchObject({
      statusCode: 502,
      errorCode: 'GEOCODING_PROVIDER_ERROR',
    });
  });
});
