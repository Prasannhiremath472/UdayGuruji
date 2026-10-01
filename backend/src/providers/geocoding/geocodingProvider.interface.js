/**
 * Contract every geocoding provider must implement.
 * @typedef {{ latitude: number, longitude: number, resolvedPlaceName: string }} GeocodeResult
 */
class GeocodingProviderInterface {
  /**
   * @param {string} placeQuery
   * @returns {Promise<GeocodeResult>}
   */
  async resolve(placeQuery) {
    throw new Error('resolve() not implemented');
  }
}

module.exports = GeocodingProviderInterface;
