import { useTranslation } from 'react-i18next';
import './ReportSections.css';

export default function AshtakavargaSection({ ashtakavarga }) {
  const { t } = useTranslation();

  if (!ashtakavarga || ashtakavarga.length === 0) {
    return (
      <section className="report-section">
        <h2 className="report-section-title">{t('report.ashtakavarga')}</h2>
        <p className="report-no-data">{t('report.noData')}</p>
      </section>
    );
  }

  const sarva = ashtakavarga.filter((a) => a.planet === 'SARVA');

  return (
    <section className="report-section">
      <h2 className="report-section-title">{t('report.ashtakavarga')}</h2>
      <h3 className="report-subsection-title">{t('report.sarvaAshtakavarga')}</h3>
      <table className="report-table report-table-compact">
        <thead>
          <tr>
            {sarva.map((row) => (
              <th key={row.id}>{t('report.house')} {row.house}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {sarva.map((row) => (
              <td key={row.id} data-label={`${t('report.house')} ${row.house}`}>{row.points}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}
