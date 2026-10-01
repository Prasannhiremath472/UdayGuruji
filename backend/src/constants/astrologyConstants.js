const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const PLANETS = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
];

const DIVISIONAL_CHART_TYPES = {
  D1: 'Rashi (Birth Chart)',
  D2: 'Hora (Wealth)',
  D3: 'Drekkana (Siblings)',
  D9: 'Navamsa (Marriage/Dharma)',
  D10: 'Dasamsa (Career)',
  D12: 'Dwadasamsa (Parents)',
};

module.exports = { ZODIAC_SIGNS, NAKSHATRAS, PLANETS, DIVISIONAL_CHART_TYPES };
