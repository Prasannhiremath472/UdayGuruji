const { NUMBER_MEANINGS, LIFE_PATH_LABEL, DESTINY_LABEL, SOUL_URGE_LABEL } = require('../constants/numerologyMeanings');

const MASTER_NUMBERS = new Set([11, 22, 33]);

const LETTER_VALUES = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function reduceToSingleDigit(num) {
  let value = num;
  while (value > 9 && !MASTER_NUMBERS.has(value)) {
    value = String(value)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return value;
}

function calculateLifePathNumber(dateOfBirth) {
  const digitSum = dateOfBirth
    .replace(/-/g, '')
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
  return reduceToSingleDigit(digitSum);
}

function nameToDigitSum(name, filter) {
  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('');
  const relevant = filter ? letters.filter(filter) : letters;
  const sum = relevant.reduce((total, letter) => total + (LETTER_VALUES[letter] || 0), 0);
  return sum;
}

function calculateDestinyNumber(fullName) {
  return reduceToSingleDigit(nameToDigitSum(fullName));
}

function calculateSoulUrgeNumber(fullName) {
  return reduceToSingleDigit(nameToDigitSum(fullName, (letter) => VOWELS.has(letter)));
}

function buildResult(number, label) {
  return {
    number,
    label,
    isMasterNumber: MASTER_NUMBERS.has(number),
    meaning: NUMBER_MEANINGS[number] || '',
  };
}

/**
 * Standard Pythagorean numerology, computed purely from name + date of
 * birth - no external API dependency, deterministic and independent of
 * the Vedic astrology engine.
 */
function calculateNumerology({ fullName, dateOfBirth }) {
  const lifePath = calculateLifePathNumber(dateOfBirth);
  const destiny = calculateDestinyNumber(fullName);
  const soulUrge = calculateSoulUrgeNumber(fullName);

  return {
    lifePath: buildResult(lifePath, LIFE_PATH_LABEL),
    destiny: buildResult(destiny, DESTINY_LABEL),
    soulUrge: buildResult(soulUrge, SOUL_URGE_LABEL),
  };
}

module.exports = { calculateNumerology };
