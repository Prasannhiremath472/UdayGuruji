/**
 * Short templated interpretations for a planet's current transit house,
 * counted from the natal Lagna. Generic, widely-published themes per
 * planet+house combination - not a substitute for a full professional
 * reading, and presented with a disclaimer in the UI.
 */
const HOUSE_THEMES = {
  1: 'self, health, and personal outlook',
  2: 'finances, family, and speech',
  3: 'courage, siblings, and short journeys',
  4: 'home, comfort, and emotional foundation',
  5: 'creativity, children, and intellect',
  6: 'work, health challenges, and daily routine',
  7: 'partnerships, marriage, and business dealings',
  8: 'transformation, longevity, and shared resources',
  9: 'fortune, higher learning, and long journeys',
  10: 'career, reputation, and public standing',
  11: 'gains, income, and social circles',
  12: 'expenses, rest, and letting go',
};

const PLANET_TRANSIT_TONE = {
  Sun: 'brings focus and visibility to',
  Moon: 'stirs emotional attention toward',
  Mars: 'energizes and can create friction around',
  Mercury: 'sharpens communication and decisions related to',
  Jupiter: 'brings growth and good fortune to',
  Venus: 'brings harmony and enjoyment to',
  Saturn: 'brings discipline, delay, or long-term restructuring to',
  Rahu: 'brings ambition and unconventional shifts to',
  Ketu: 'brings detachment or unexpected closure to',
};

function getTransitInterpretation(planet, houseFromLagna) {
  const tone = PLANET_TRANSIT_TONE[planet] || 'is currently transiting';
  const theme = HOUSE_THEMES[houseFromLagna] || 'this area of life';
  return `${planet} ${tone} ${theme} (house ${houseFromLagna} from your Lagna).`;
}

module.exports = { getTransitInterpretation };
