import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';
import Card from '../common/Card';
import LoadingState from '../common/LoadingState';
import { getRashis, getHoroscope } from '../../services/horoscopeService';
import './HomeSections.css';

export default function HoroscopePreviewSection() {
  const { t } = useTranslation();
  const [rashis, setRashis] = useState([]);
  const [selectedRashi, setSelectedRashi] = useState(null);
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRashis().then(setRashis).catch(() => setRashis([]));
  }, []);

  useEffect(() => {
    if (!selectedRashi) return;
    setLoading(true);
    getHoroscope(selectedRashi, 'daily')
      .then(setHoroscope)
      .catch(() => setHoroscope(null))
      .finally(() => setLoading(false));
  }, [selectedRashi]);

  const firstCategoryText = horoscope ? Object.values(horoscope.categories)[0] : null;

  return (
    <section className="home-section home-section-bg-prediction">
      <h2 className="home-section-title">{t('home.horoscopePreview.title')}</h2>
      <p className="home-section-subtitle">{t('home.horoscopePreview.subtitle')}</p>

      <div className="horoscope-preview-rashi-grid">
        {rashis.map((rashi) => (
          <button
            key={rashi}
            type="button"
            className={`horoscope-preview-rashi ${selectedRashi === rashi ? 'horoscope-preview-rashi-active' : ''}`}
            onClick={() => setSelectedRashi(rashi)}
          >
            {t(`horoscope.rashis.${rashi}`, rashi)}
          </button>
        ))}
      </div>

      {selectedRashi ? (
        <Card className="horoscope-preview-result">
          {loading ? (
            <LoadingState />
          ) : firstCategoryText ? (
            <>
              <p className="horoscope-preview-text">{firstCategoryText}</p>
              <Link to="/horoscope" className="horoscope-preview-link">
                {t('home.horoscopePreview.readFull')} <FaArrowRight aria-hidden="true" />
              </Link>
            </>
          ) : null}
        </Card>
      ) : (
        <p className="home-section-note">{t('home.horoscopePreview.selectPrompt')}</p>
      )}
    </section>
  );
}
