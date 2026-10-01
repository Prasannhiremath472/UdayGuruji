// Static lookup tables translating provider-returned English astrology terms
// (planet/sign/nakshatra names) into Hindi/Marathi, since the astrology
// provider's responses are English-only.

export const PLANET_NAMES = {
  Sun: { en: 'Sun', hi: 'सूर्य', mr: 'सूर्य' },
  Moon: { en: 'Moon', hi: 'चंद्र', mr: 'चंद्र' },
  Mars: { en: 'Mars', hi: 'मंगल', mr: 'मंगळ' },
  Mercury: { en: 'Mercury', hi: 'बुध', mr: 'बुध' },
  Jupiter: { en: 'Jupiter', hi: 'गुरु', mr: 'गुरू' },
  Venus: { en: 'Venus', hi: 'शुक्र', mr: 'शुक्र' },
  Saturn: { en: 'Saturn', hi: 'शनि', mr: 'शनी' },
  Rahu: { en: 'Rahu', hi: 'राहु', mr: 'राहू' },
  Ketu: { en: 'Ketu', hi: 'केतु', mr: 'केतू' },
  Uranus: { en: 'Uranus', hi: 'अरुण', mr: 'अरुण' },
  Neptune: { en: 'Neptune', hi: 'वरुण', mr: 'वरुण' },
  Pluto: { en: 'Pluto', hi: 'यम', mr: 'यम' },
};

export const SIGN_NAMES = {
  Aries: { en: 'Aries', hi: 'मेष', mr: 'मेष' },
  Taurus: { en: 'Taurus', hi: 'वृषभ', mr: 'वृषभ' },
  Gemini: { en: 'Gemini', hi: 'मिथुन', mr: 'मिथुन' },
  Cancer: { en: 'Cancer', hi: 'कर्क', mr: 'कर्क' },
  Leo: { en: 'Leo', hi: 'सिंह', mr: 'सिंह' },
  Virgo: { en: 'Virgo', hi: 'कन्या', mr: 'कन्या' },
  Libra: { en: 'Libra', hi: 'तुला', mr: 'तूळ' },
  Scorpio: { en: 'Scorpio', hi: 'वृश्चिक', mr: 'वृश्चिक' },
  Sagittarius: { en: 'Sagittarius', hi: 'धनु', mr: 'धनु' },
  Capricorn: { en: 'Capricorn', hi: 'मकर', mr: 'मकर' },
  Aquarius: { en: 'Aquarius', hi: 'कुंभ', mr: 'कुंभ' },
  Pisces: { en: 'Pisces', hi: 'मीन', mr: 'मीन' },
};

export const NAKSHATRA_NAMES = {
  Ashwini: { en: 'Ashwini', hi: 'अश्विनी', mr: 'अश्विनी' },
  Bharani: { en: 'Bharani', hi: 'भरणी', mr: 'भरणी' },
  Krittika: { en: 'Krittika', hi: 'कृत्तिका', mr: 'कृत्तिका' },
  Rohini: { en: 'Rohini', hi: 'रोहिणी', mr: 'रोहिणी' },
  Mrigashira: { en: 'Mrigashira', hi: 'मृगशिरा', mr: 'मृगशीर्ष' },
  Ardra: { en: 'Ardra', hi: 'आर्द्रा', mr: 'आर्द्रा' },
  Punarvasu: { en: 'Punarvasu', hi: 'पुनर्वसु', mr: 'पुनर्वसू' },
  Pushya: { en: 'Pushya', hi: 'पुष्य', mr: 'पुष्य' },
  Ashlesha: { en: 'Ashlesha', hi: 'आश्लेषा', mr: 'आश्लेषा' },
  Magha: { en: 'Magha', hi: 'मघा', mr: 'मघा' },
  'Purva Phalguni': { en: 'Purva Phalguni', hi: 'पूर्वाफाल्गुनी', mr: 'पूर्वा फाल्गुनी' },
  'Uttara Phalguni': { en: 'Uttara Phalguni', hi: 'उत्तराफाल्गुनी', mr: 'उत्तरा फाल्गुनी' },
  Hasta: { en: 'Hasta', hi: 'हस्त', mr: 'हस्त' },
  Chitra: { en: 'Chitra', hi: 'चित्रा', mr: 'चित्रा' },
  Swati: { en: 'Swati', hi: 'स्वाति', mr: 'स्वाती' },
  Vishakha: { en: 'Vishakha', hi: 'विशाखा', mr: 'विशाखा' },
  Anuradha: { en: 'Anuradha', hi: 'अनुराधा', mr: 'अनुराधा' },
  Jyeshtha: { en: 'Jyeshtha', hi: 'ज्येष्ठा', mr: 'ज्येष्ठा' },
  Mula: { en: 'Mula', hi: 'मूल', mr: 'मूळ' },
  'Purva Ashadha': { en: 'Purva Ashadha', hi: 'पूर्वाषाढ़ा', mr: 'पूर्वाषाढा' },
  'Uttara Ashadha': { en: 'Uttara Ashadha', hi: 'उत्तराषाढ़ा', mr: 'उत्तराषाढा' },
  Shravana: { en: 'Shravana', hi: 'श्रवण', mr: 'श्रवण' },
  Dhanishta: { en: 'Dhanishta', hi: 'धनिष्ठा', mr: 'धनिष्ठा' },
  Shatabhisha: { en: 'Shatabhisha', hi: 'शतभिषा', mr: 'शततारका' },
  'Purva Bhadrapada': { en: 'Purva Bhadrapada', hi: 'पूर्वाभाद्रपद', mr: 'पूर्वा भाद्रपदा' },
  'Uttara Bhadrapada': { en: 'Uttara Bhadrapada', hi: 'उत्तराभाद्रपद', mr: 'उत्तरा भाद्रपदा' },
  Revati: { en: 'Revati', hi: 'रेवती', mr: 'रेवती' },
};

function translateTerm(table, term, lang) {
  if (!term) return term;
  const entry = table[term];
  if (!entry) return term;
  return entry[lang] || entry.en;
}

export const translatePlanet = (name, lang) => translateTerm(PLANET_NAMES, name, lang);
export const translateSign = (name, lang) => translateTerm(SIGN_NAMES, name, lang);
export const translateNakshatra = (name, lang) => translateTerm(NAKSHATRA_NAMES, name, lang);
