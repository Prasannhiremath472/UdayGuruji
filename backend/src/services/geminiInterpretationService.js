const geminiProvider = require('../providers/ai/geminiProvider');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Every prompt in this file is built from real, already-calculated chart
 * facts (planet positions from the astrology provider, or Dasha/Yoga/
 * Dosha/transit facts from vedicCalculationService). Gemini is asked to
 * write natural-language interpretation text FROM those facts - it is
 * never asked to determine or invent the facts themselves. If Gemini is
 * unavailable or disabled, callers get `null` back and must render the
 * report without that section rather than fail the whole request.
 */

async function safeGenerate(prompt, options) {
  if (!env.gemini.enabled || !env.gemini.apiKey) return null;
  try {
    return await geminiProvider.generateText(prompt, options);
  } catch (err) {
    logger.error(`Gemini interpretation skipped: ${err.message}`);
    return null;
  }
}

function formatPlanetList(planets) {
  return planets
    .map((p) => `${p.planet} in ${p.sign} (house ${p.house}${p.retrograde ? ', retrograde' : ''}, nakshatra ${p.nakshatra || 'n/a'})`)
    .join('; ');
}

/**
 * A personality/life-theme summary paragraph from the natal chart facts.
 */
async function generatePersonalitySummary({ fullName, lagna, rashi, nakshatra, planets }) {
  const prompt = `You are a professional Vedic astrologer writing a birth chart summary for a client report.
Use ONLY the facts given below. Do not invent additional planetary positions, dates, or facts not listed.
Write 3-4 sentences, warm and professional in tone, suitable for a printed report. Do not use headings or bullet points - plain prose only.

Client name: ${fullName}
Lagna (Ascendant): ${lagna}
Rashi (Moon sign): ${rashi}
Nakshatra: ${nakshatra}
Planetary positions: ${formatPlanetList(planets)}

Write the personality and life-theme summary now.`;

  return safeGenerate(prompt, { maxOutputTokens: 300, temperature: 0.7 });
}

/**
 * Richer explanation for a single detected Yoga or Dosha, given its name
 * and the mechanical description already computed by
 * vedicCalculationService (e.g. "Mars is in house 7 from the Lagna").
 */
async function generateYogaDoshaExplanation({ name, mechanicalDescription, isDosha }) {
  const kind = isDosha ? 'Dosha (astrological affliction)' : 'Yoga (astrological combination)';
  const prompt = `You are a professional Vedic astrologer. Explain the following ${kind} in 2-3 sentences for a client report.
Use ONLY the fact given below - do not invent additional planetary details. Keep the tone balanced and informative, not alarming, and note remedies are traditional/optional if relevant. Plain prose only, no headings.

${kind} name: ${name}
Underlying chart fact: ${mechanicalDescription}

Write the explanation now.`;

  return safeGenerate(prompt, { maxOutputTokens: 200, temperature: 0.6 });
}

/**
 * A short outlook paragraph for the current Mahadasha period, from its
 * real ruling planet and start/end dates.
 */
async function generateDashaNarrative({ planet, startDate, endDate }) {
  const prompt = `You are a professional Vedic astrologer. Write a short outlook (2-3 sentences) for a client currently running their ${planet} Mahadasha, which runs from ${startDate} to ${endDate}.
Use only the classical significations of ${planet} as a planet. Do not invent specific life events or dates beyond what is given. Plain prose only, no headings.

Write the outlook now.`;

  return safeGenerate(prompt, { maxOutputTokens: 200, temperature: 0.7 });
}

/**
 * A fuller narrative paragraph for the current transits, built from the
 * real per-planet transit facts already computed by
 * vedicCalculationService.calculateTransits().
 */
async function generateTransitNarrative(transits) {
  const factList = transits
    .map((t) => `${t.planet} is transiting ${t.currentSign} (house ${t.houseFromNatalLagna} from natal Lagna${t.retrograde ? ', retrograde' : ''})`)
    .join('; ');

  const prompt = `You are a professional Vedic astrologer. Write a short current-transit (Gochar) outlook paragraph (3-4 sentences) for a client, based ONLY on the following real transit facts. Do not invent additional planetary positions.

Current transits: ${factList}

Write the transit outlook now.`;

  return safeGenerate(prompt, { maxOutputTokens: 250, temperature: 0.7 });
}

module.exports = {
  generatePersonalitySummary,
  generateYogaDoshaExplanation,
  generateDashaNarrative,
  generateTransitNarrative,
};
