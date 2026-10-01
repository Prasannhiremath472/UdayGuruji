/**
 * Classical Parasara Ashtakavarga benefic-point (Bindu) tables.
 *
 * For each of the 7 classical planets (Sun through Saturn - Rahu/Ketu are
 * excluded from Ashtakavarga in the classical system), this table lists,
 * for each "contributor" (the planet itself, the other 6 planets, and the
 * Lagna), which of the 12 houses *counted from that contributor's own
 * position* receive a benefic point (bindu) in the target planet's
 * Bhinnashtakavarga (individual ashtakavarga).
 *
 * This is the standard table published in Brihat Parasara Hora Shastra and
 * reproduced in most Vedic astrology references (e.g. B.V. Raman's "Three
 * Hundred Important Combinations", or any standard Ashtakavarga textbook).
 * It has NOT been cross-checked against a second live calculator in this
 * environment - verify a generated chart's Sarvashtakavarga totals against
 * a known-correct reference kundali before treating this as authoritative.
 *
 * Houses are 1-indexed positions counted from the contributor's sign,
 * inclusive of the contributor's own house as house 1.
 */

const SUN_TABLE = {
  Sun: [1, 2, 4, 7, 8, 9, 10, 11],
  Moon: [3, 6, 10, 11],
  Mars: [1, 2, 4, 7, 8, 9, 10, 11],
  Mercury: [3, 5, 6, 9, 10, 11, 12],
  Jupiter: [5, 6, 9, 11],
  Venus: [6, 7, 12],
  Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
  Lagna: [3, 4, 6, 10, 11, 12],
};

const MOON_TABLE = {
  Sun: [3, 6, 7, 8, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [2, 3, 5, 6, 9, 10, 11],
  Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
  Jupiter: [1, 4, 7, 8, 10, 11, 12],
  Venus: [3, 4, 5, 7, 9, 10, 11],
  Saturn: [3, 5, 6, 11],
  Lagna: [3, 6, 10, 11],
};

const MARS_TABLE = {
  Sun: [3, 5, 6, 10, 11],
  Moon: [3, 6, 11],
  Mars: [1, 2, 4, 7, 8, 10, 11],
  Mercury: [3, 5, 6, 11],
  Jupiter: [6, 10, 11, 12],
  Venus: [6, 8, 11, 12],
  Saturn: [1, 4, 7, 8, 9, 10, 11],
  Lagna: [1, 3, 6, 10, 11],
};

const MERCURY_TABLE = {
  Sun: [5, 6, 9, 11, 12],
  Moon: [2, 4, 6, 8, 10, 11],
  Mars: [1, 2, 4, 7, 8, 9, 10, 11],
  Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
  Jupiter: [6, 8, 11, 12],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11],
  Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
  Lagna: [1, 2, 4, 6, 8, 10, 11],
};

const JUPITER_TABLE = {
  Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
  Moon: [2, 5, 7, 9, 11],
  Mars: [1, 2, 4, 7, 8, 10, 11],
  Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
  Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
  Venus: [2, 5, 6, 9, 10, 11],
  Saturn: [3, 5, 6, 12],
  Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
};

const VENUS_TABLE = {
  Sun: [8, 11, 12],
  Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Mars: [3, 5, 6, 9, 11, 12],
  Mercury: [3, 5, 6, 9, 11],
  Jupiter: [5, 8, 9, 10, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
  Saturn: [3, 4, 5, 8, 9, 10, 11],
  Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
};

const SATURN_TABLE = {
  Sun: [1, 2, 4, 7, 8, 10, 11],
  Moon: [3, 6, 11],
  Mars: [3, 5, 6, 10, 11, 12],
  Mercury: [6, 8, 9, 10, 11, 12],
  Jupiter: [5, 6, 11, 12],
  Venus: [6, 11, 12],
  Saturn: [3, 5, 6, 11],
  Lagna: [1, 3, 4, 6, 10, 11],
};

const ASHTAKAVARGA_TABLES = {
  Sun: SUN_TABLE,
  Moon: MOON_TABLE,
  Mars: MARS_TABLE,
  Mercury: MERCURY_TABLE,
  Jupiter: JUPITER_TABLE,
  Venus: VENUS_TABLE,
  Saturn: SATURN_TABLE,
};

module.exports = { ASHTAKAVARGA_TABLES };
