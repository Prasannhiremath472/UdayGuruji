const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const { ApiError } = require('../../utils/apiResponse');

const client = axios.create({
  baseURL: env.gemini.baseUrl,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Adapter for Google's Gemini API (generativelanguage.googleapis.com).
 * This is a text-generation layer ONLY - it never computes astrology
 * data itself. It is always called with real, already-calculated chart
 * facts (planets, houses, Dasha dates, etc. from vedicCalculationService
 * / the astrology provider) and asked to write natural-language
 * interpretation text from those facts, never to invent the facts
 * themselves. See geminiInterpretationService.js for the prompts.
 */
async function generateText(prompt, { maxOutputTokens = 500, temperature = 0.7 } = {}) {
  if (!env.gemini.apiKey) {
    throw new ApiError(500, 'AI interpretation service is not configured', 'GEMINI_NOT_CONFIGURED');
  }

  try {
    const response = await client.post(
      `/models/${env.gemini.model}:generateContent`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens, temperature },
      },
      { params: { key: env.gemini.apiKey } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new ApiError(502, 'AI interpretation service returned an empty response', 'GEMINI_EMPTY_RESPONSE');
    }
    return text.trim();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const status = err.response?.status;
    logger.error(`Gemini API call failed: ${err.message}`);
    if (status === 401 || status === 403) {
      throw new ApiError(502, 'AI interpretation service rejected the request credentials', 'GEMINI_AUTH_ERROR');
    }
    if (status === 429) {
      throw new ApiError(503, 'AI interpretation service is busy, please try again shortly', 'GEMINI_RATE_LIMITED');
    }
    throw new ApiError(502, 'AI interpretation service is currently unavailable', 'GEMINI_ERROR');
  }
}

module.exports = { generateText };
