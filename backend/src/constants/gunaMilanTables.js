/**
 * Classical Ashtakoot (8-koota) Guna Milan tables for Vedic kundali
 * matching, as published in standard references (e.g. Muhurta Chintamani,
 * and widely reproduced in modern Vedic astrology texts). Total possible
 * score across all 8 kootas is 36.
 *
 * As with ashtakavargaTables.js, this has not been cross-checked against
 * a second live calculator in this environment - spot-check results
 * against a known-correct reference match before treating as
 * authoritative.
 */

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

// 1 = Deva, 2 = Manushya, 3 = Rakshasa - by nakshatra index (0-based).
const NAKSHATRA_GANA = [
  1, 3, 3, 2, 2, 3, 1, 1, 3, 3, 3, 2,
  2, 3, 2, 3, 1, 3, 3, 2, 2, 1, 1, 3,
  3, 2, 1,
];

// Nakshatra lord cycle used for Vimshottari Dasha, reused here for Graha Maitri.
const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

// Varna by sign index (0-based): 1=Brahmin, 2=Kshatriya, 3=Vaishya, 4=Shudra.
const SIGN_VARNA = [2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1];

// Vashya group by sign index: chatushpada(quadruped)/manav(human)/jalachar(water)/vanachar(wild)/keet(insect).
const SIGN_VASHYA = [
  'chatushpada', 'chatushpada', 'manav', 'jalachar', 'vanachar', 'manav',
  'manav', 'keet', 'chatushpada-half', 'chatushpada-half', 'manav', 'jalachar',
];

// Yoni (animal symbol) by nakshatra index, used for the Yoni koota compatibility table.
const NAKSHATRA_YONI = [
  'Horse', 'Elephant', 'Sheep', 'Serpent', 'Serpent', 'Dog', 'Cat', 'Sheep',
  'Cat', 'Rat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Buffalo', 'Tiger', 'Deer',
  'Deer', 'Dog', 'Monkey', 'Mongoose', 'Monkey', 'Lion', 'Horse', 'Lion',
  'Cow', 'Elephant',
];

// Friendship grid between planets: 'friend' | 'neutral' | 'enemy'.
const PLANET_FRIENDSHIP = {
  Sun: { Sun: 'friend', Moon: 'friend', Mars: 'friend', Mercury: 'neutral', Jupiter: 'friend', Venus: 'enemy', Saturn: 'enemy' },
  Moon: { Sun: 'friend', Moon: 'friend', Mars: 'neutral', Mercury: 'friend', Jupiter: 'neutral', Venus: 'neutral', Saturn: 'neutral' },
  Mars: { Sun: 'friend', Moon: 'friend', Mars: 'friend', Mercury: 'enemy', Jupiter: 'friend', Venus: 'neutral', Saturn: 'neutral' },
  Mercury: { Sun: 'friend', Moon: 'enemy', Mars: 'neutral', Mercury: 'friend', Jupiter: 'neutral', Venus: 'friend', Saturn: 'neutral' },
  Jupiter: { Sun: 'friend', Moon: 'friend', Mars: 'friend', Mercury: 'enemy', Jupiter: 'friend', Venus: 'enemy', Saturn: 'neutral' },
  Venus: { Sun: 'enemy', Moon: 'neutral', Mars: 'neutral', Mercury: 'friend', Jupiter: 'neutral', Venus: 'friend', Saturn: 'friend' },
  Saturn: { Sun: 'enemy', Moon: 'enemy', Mars: 'neutral', Mercury: 'friend', Jupiter: 'neutral', Venus: 'friend', Saturn: 'friend' },
};

const YONI_COMPATIBILITY = {
  same: 4,
  friendGroup: 3,
  neutralGroup: 2,
  enemyGroup: 0,
};

const YONI_ENEMIES = [
  ['Cat', 'Rat'], ['Dog', 'Deer'], ['Horse', 'Buffalo'], ['Lion', 'Elephant'],
  ['Serpent', 'Mongoose'], ['Cow', 'Tiger'], ['Sheep', 'Monkey'],
];
const YONI_FRIENDS = [
  ['Horse', 'Elephant'], ['Sheep', 'Monkey'], ['Serpent', 'Rat'], ['Dog', 'Cat'],
  ['Cow', 'Buffalo'], ['Deer', 'Mongoose'], ['Tiger', 'Lion'],
];

module.exports = {
  ZODIAC_SIGNS, NAKSHATRAS, NAKSHATRA_GANA, NAKSHATRA_LORDS, SIGN_VARNA,
  SIGN_VASHYA, NAKSHATRA_YONI, PLANET_FRIENDSHIP, YONI_COMPATIBILITY,
  YONI_ENEMIES, YONI_FRIENDS,
};
