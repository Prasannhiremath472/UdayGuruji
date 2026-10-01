const env = require('../../config/env');
const freeAstrologyApiProvider = require('./freeAstrologyApiProvider');

const providers = {
  free_astrology_api: freeAstrologyApiProvider,
};

function getAstrologyProvider() {
  const provider = providers[env.astrology.provider];
  if (!provider) {
    throw new Error(`Unknown astrology provider configured: ${env.astrology.provider}`);
  }
  return provider;
}

module.exports = { getAstrologyProvider };
