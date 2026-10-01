import { useTranslation } from 'react-i18next';
import { translatePlanet, translateSign, translateNakshatra } from '../../i18n/astrologyTerms';
import './ReportSections.css';

export default function PlanetaryPositionsSection({ planets }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (!planets || planets.length === 0) {
    return (
      <section className="report-section">
        <h2 className="report-section-title">{t('report.planetaryPositions')}</h2>
        <p className="report-no-data">{t('report.noData')}</p>
      </section>
    );
  }

  return (
    <section className="report-section">
      <h2 className="report-section-title">{t('report.planetaryPositions')}</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th>{t('report.planet')}</th>
            <th>{t('report.sign')}</th>
            <th>{t('report.degree')}</th>
            <th>{t('report.house')}</th>
            <th>{t('report.nakshatra')}</th>
            <th>{t('report.retrograde')}</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((p) => (
            <tr key={p.id || p.planet}>
              <td data-label={t('report.planet')}>{translatePlanet(p.planet, lang)}</td>
              <td data-label={t('report.sign')}>{translateSign(p.sign, lang)}</td>
              <td data-label={t('report.degree')}>{Number(p.degree).toFixed(2)}°</td>
              <td data-label={t('report.house')}>{p.house}</td>
              <td data-label={t('report.nakshatra')}>{translateNakshatra(p.nakshatra, lang)}</td>
              <td data-label={t('report.retrograde')}>{p.retrograde ? t('common.yes') : t('common.no')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
