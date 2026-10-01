const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const { ApiError } = require('../../utils/apiResponse');
const TimezoneProviderInterface = require('./timezoneProvider.interface');

const client = axios.create({
  baseURL: env.timezone.baseUrl,
  timeout: 8000,
});

class TimezoneDbProvider extends TimezoneProviderInterface {
  async resolve({ latitude, longitude, timestamp }) {
    if (!env.timezone.apiKey) {
      throw new ApiError(500, 'Timezone provider is not configured', 'TIMEZONE_PROVIDER_NOT_CONFIGURED');
    }

    try {
      const response = await client.get('/get-time-zone', {
        params: {
          key: env.timezone.apiKey,
          format: 'json',
          by: 'position',
          lat: latitude,
          lng: longitude,
          time: timestamp,
        },
      });

      const data = response.data;
      if (data.status !== 'OK') {
        throw new ApiError(502, 'Unable to resolve timezone for this location', 'TIMEZONE_PROVIDER_ERROR');
      }

      return {
        timezone: data.zoneName,
        utcOffsetMinutes: Math.round(data.gmtOffset / 60),
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      logger.error(`TimeZoneDB lookup failed: ${err.message}`);
      throw new ApiError(502, 'Unable to resolve timezone for this location', 'TIMEZONE_PROVIDER_ERROR');
    }
  }
}

module.exports = new TimezoneDbProvider();
