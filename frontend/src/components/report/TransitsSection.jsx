import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import { getTransits } from '../../services/kundaliService';
import { translatePlanet, translateSign } from '../../i18n/astrologyTerms';
import './ReportSections.css';

export default function TransitsSection({ kundaliId, accessToken }) {
  const { t, i18n } = useTranslation();
  const [transits, setTransits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTransits(kundaliId, accessToken)
      .then((data) => {
        if (!cancelled) setTransits(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || t('errors.generic'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kundaliId, accessToken, t]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!transits) return null;

  return (
    <section className="report-section no-print">
      <h2 className="report-section-title">{t('report.transits')}</h2>
      <p className="transits-disclaimer">{t('report.transitsDisclaimer')}</p>
      {transits.narrative ? (
        <div className="dasha-narrative-callout">
          <p className="ai-generated-text">{transits.narrative}</p>
          <p className="ai-disclaimer">{t('report.aiDisclaimer')}</p>
        </div>
      ) : null}
      <table className="report-table">
        <thead>
          <tr>
            <th>{t('report.planet')}</th>
            <th>{t('report.sign')}</th>
            <th>{t('report.house')}</th>
            <th>{t('report.interpretation')}</th>
          </tr>
        </thead>
        <tbody>
          {transits.transits.map((tr) => (
            <tr key={tr.planet}>
              <td data-label={t('report.planet')}>{translatePlanet(tr.planet, i18n.language)}</td>
              <td data-label={t('report.sign')}>{translateSign(tr.currentSign, i18n.language)}</td>
              <td data-label={t('report.house')}>{tr.houseFromNatalLagna}</td>
              <td data-label={t('report.interpretation')}>{tr.interpretation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
