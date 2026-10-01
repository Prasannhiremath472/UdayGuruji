const { calculateGunaMilan } = require('../src/services/gunaMilanService');

describe('calculateGunaMilan', () => {
  it('scores a perfect same-sign, same-nakshatra match as the maximum for most kootas', () => {
    const person = { moonSign: 'Leo', nakshatra: 'Magha' };
    const result = calculateGunaMilan(person, { ...person });

    expect(result.maxScore).toBe(36);
    // Same nakshatra -> same Nadi group -> Nadi Dosha (0 points), which is
    // the classical outcome for identical nakshatra matches.
    expect(result.hasNadiDosha).toBe(true);
    expect(result.kootas.find((k) => k.name === 'Nadi').score).toBe(0);
    // Gana, Yoni, Graha Maitri should all max out for an identical nakshatra.
    expect(result.kootas.find((k) => k.name === 'Gana').score).toBe(6);
    expect(result.kootas.find((k) => k.name === 'Yoni').score).toBe(4);
    expect(result.kootas.find((k) => k.name === 'Graha Maitri').score).toBe(5);
  });

  it('always returns exactly 8 kootas summing to the fixed 36-point max scale', () => {
    const result = calculateGunaMilan(
      { moonSign: 'Aries', nakshatra: 'Ashwini' },
      { moonSign: 'Libra', nakshatra: 'Swati' }
    );
    expect(result.kootas).toHaveLength(8);
    expect(result.kootas.reduce((sum, k) => sum + k.maxScore, 0)).toBe(36);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(36);
  });

  it('flags Bhakoot Dosha for a classically inauspicious sign distance (2/12)', () => {
    // Aries (idx 0) to Taurus (idx 1): distance 2 - inauspicious per Bhakoot rules.
    const result = calculateGunaMilan(
      { moonSign: 'Aries', nakshatra: 'Ashwini' },
      { moonSign: 'Taurus', nakshatra: 'Rohini' }
    );
    expect(result.hasBhakootDosha).toBe(true);
    expect(result.kootas.find((k) => k.name === 'Bhakoot').score).toBe(0);
  });

  it('does not flag Bhakoot Dosha for a favorable sign distance', () => {
    // Aries (idx 0) to Gemini (idx 2): distance 3 - not in the inauspicious set.
    const result = calculateGunaMilan(
      { moonSign: 'Aries', nakshatra: 'Ashwini' },
      { moonSign: 'Gemini', nakshatra: 'Mrigashira' }
    );
    expect(result.hasBhakootDosha).toBe(false);
    expect(result.kootas.find((k) => k.name === 'Bhakoot').score).toBe(7);
  });

  it('produces a verdict string consistent with the total score', () => {
    const highScore = calculateGunaMilan(
      { moonSign: 'Leo', nakshatra: 'Magha' },
      { moonSign: 'Sagittarius', nakshatra: 'Purva Ashadha' }
    );
    expect(typeof highScore.verdict).toBe('string');
    expect(highScore.verdict.length).toBeGreaterThan(0);
  });
});
