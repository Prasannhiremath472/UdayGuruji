/**
 * Contract every timezone-resolution provider must implement.
 * @typedef {{ timezone: string, utcOffsetMinutes: number }} TimezoneResult
 */
class TimezoneProviderInterface {
  /**
   * @param {{ latitude: number, longitude: number, timestamp: number }} params timestamp = unix seconds of the birth moment (local, treated as UTC epoch reference)
   * @returns {Promise<TimezoneResult>}
   */
  async resolve(params) {
    throw new Error('resolve() not implemented');
  }
}

module.exports = TimezoneProviderInterface;
