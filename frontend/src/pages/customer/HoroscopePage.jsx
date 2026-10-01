import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import PageHeader from '../../components/common/PageHeader';
import { getRashis, getHoroscope } from '../../services/horoscopeService';
import './HoroscopePage.css';

const PERIODS = ['daily', 'weekly', 'monthly'];

export default function HoroscopePage() {
  const { t } = useTranslation();
  const [rashis, setRashis] = useState([]);
  const [selectedRashi, setSelectedRashi] = useState('Aries');
  const [period, setPeriod] = useState('daily');
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRashis().then(setRashis).catch(() => setRashis([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getHoroscope(selectedRashi, period)
      .then(setHoroscope)
      .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
      .finally(() => setLoading(false));
  }, [selectedRashi, period, t]);

  return (
    <div className="horoscope-page">
      <PageHeader title={t('horoscope.title')} subtitle={t('horoscope.disclaimer')} />
      <div className="page-content-inner">
        <div className="rashi-grid">
          {rashis.map((rashi) => (
            <button
              key={rashi}
              type="button"
              className={`rashi-chip ${selectedRashi === rashi ? 'rashi-chip-active' : ''}`}
              onClick={() => setSelectedRashi(rashi)}
            >
              {t(`horoscope.rashis.${rashi}`, rashi)}
            </button>
          ))}
        </div>

        <div className="period-toggle">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              className={`period-btn ${period === p ? 'period-btn-active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {t(`horoscope.period.${p}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : horoscope ? (
          <Card title={`${t(`horoscope.rashis.${horoscope.rashi}`, horoscope.rashi)} - ${t(`horoscope.period.${horoscope.period}`)}`}>
            <div className="horoscope-categories">
              {Object.entries(horoscope.categories).map(([category, text]) => (
                <div key={category} className="horoscope-category">
                  <h3 className="horoscope-category-title">{t(`horoscope.category.${category}`)}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
