const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const { ApiError } = require('../../utils/apiResponse');
const GeocodingProviderInterface = require('./geocodingProvider.interface');

const client = axios.create({
  baseURL: env.geocoding.nominatimBaseUrl,
  timeout: 8000,
  headers: {
    'User-Agent': env.geocoding.nominatimUserAgent,
  },
});

class NominatimProvider extends GeocodingProviderInterface {
  async resolve(placeQuery) {
    try {
      const response = await client.get('/search', {
        params: {
          q: placeQuery,
          format: 'json',
          limit: 1,
          addressdetails: 0,
        },
      });

      const results = response.data;
      if (!Array.isArray(results) || results.length === 0) {
        throw new ApiError(422, `Could not resolve place of birth: "${placeQuery}"`, 'PLACE_NOT_FOUND');
      }

      const best = results[0];
      return {
        latitude: parseFloat(best.lat),
        longitude: parseFloat(best.lon),
        resolvedPlaceName: best.display_name,
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      logger.error(`Nominatim geocoding failed for "${placeQuery}": ${err.message}`);
      throw new ApiError(502, 'Unable to resolve place of birth at this time', 'GEOCODING_PROVIDER_ERROR');
    }
  }
}

module.exports = new NominatimProvider();
