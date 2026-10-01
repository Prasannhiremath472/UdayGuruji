/**
 * Contract every Vedic astrology calculation provider must implement.
 * Implementations translate provider-specific request/response shapes into
 * this normalized shape so services/controllers never depend on a vendor.
 *
 * @typedef {Object} BirthInput
 * @property {number} year
 * @property {number} month
 * @property {number} date
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} utcOffsetHours
 *
 * @typedef {Object} PlanetPosition
 * @property {string} planet
 * @property {string} sign
 * @property {number} degree
 * @property {number} house
 * @property {string} [nakshatra]
 * @property {number} [nakshatraPada]
 * @property {boolean} retrograde
 *
 * @typedef {Object} DashaPeriod
 * @property {number} level 1=Mahadasha 2=Antardasha 3=Pratyantardasha
 * @property {string} planet
 * @property {string} startDate ISO date
 * @property {string} endDate ISO date
 * @property {DashaPeriod[]} [children]
 *
 * @typedef {Object} KundaliResult
 * @property {string} lagna
 * @property {string} rashi
 * @property {string} nakshatra
 * @property {number} nakshatraPada
 * @property {PlanetPosition[]} planets
 * @property {Record<string, {house:number, planets:string[]}[]>} divisionalCharts keyed by chart type e.g. D1, D9
 * @property {DashaPeriod[]} vimshottariDasha
 * @property {{name:string, description:string}[]} yogas
 * @property {{name:string, present:boolean, description:string}[]} doshas
 * @property {{planet:string, house:number, points:number}[]} ashtakavarga
 * @property {Object} raw original provider response, stored for audit/replay
 */
class AstrologyProviderInterface {
  /**
   * @param {BirthInput} birthInput
   * @returns {Promise<KundaliResult>}
   */
  async generateKundali(birthInput) {
    throw new Error('generateKundali() not implemented');
  }
}

module.exports = AstrologyProviderInterface;
