/**
 * Curated horoscope snippet bank, rotated deterministically by date so a
 * given sign+period+category shows stable text within that period rather
 * than changing on every page refresh. This is template content, NOT a
 * computed astronomical prediction - the UI must present it with a clear
 * "for entertainment purposes" disclaimer (see frontend HoroscopePage).
 */

const RASHIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const CATEGORIES = ['general', 'love', 'career', 'health'];

const SNIPPETS = {
  general: [
    'A day for steady progress - focus on one priority at a time rather than spreading yourself thin.',
    'Unexpected news may shift your plans. Stay flexible and look for the opportunity in the change.',
    'Your instincts are sharper than usual today - trust your first read on a situation.',
    'A good day to reconnect with someone you have been meaning to reach out to.',
    'Patience pays off now - avoid rushing a decision that can wait a little longer.',
  ],
  love: [
    'Open, honest conversation strengthens a close relationship today.',
    'Single? A chance encounter could spark an interesting connection.',
    'Small gestures mean more than grand ones in your relationships right now.',
    'Give a partner or close friend some space if tension has been building.',
    'A shared activity brings you closer to someone important to you.',
  ],
  career: [
    'A collaborative effort at work moves faster than working alone today.',
    'Double-check the details before submitting or signing off on something important.',
    'Your ideas get a receptive audience - it is a good day to speak up in a meeting.',
    'A financial decision benefits from a second opinion before you commit.',
    'Recognition for past effort may come your way - stay humble and keep building.',
  ],
  health: [
    'Prioritize rest tonight - your energy will thank you tomorrow.',
    'A short walk or stretch break clears your head better than pushing through fatigue.',
    'Stay mindful of hydration and meals today, especially if your schedule is packed.',
    'Emotional stress may show up physically - a few quiet minutes can help reset.',
    'Good day to start a small, sustainable health habit rather than a drastic change.',
  ],
};

module.exports = { RASHIS, CATEGORIES, SNIPPETS };
