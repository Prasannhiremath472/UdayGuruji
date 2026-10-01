import { useTranslation } from 'react-i18next';
import './ReportSections.css';

export default function YogasDoshasSection({ yogas, doshas }) {
  const { t } = useTranslation();

  return (
    <section className="report-section">
      <div className="yogas-doshas-grid">
        <div>
          <h2 className="report-section-title">{t('report.yogas')}</h2>
          {yogas && yogas.length > 0 ? (
            <ul className="report-list">
              {yogas.map((y) => (
                <li key={y.id}>
                  <strong>{y.yoga_name}</strong>
                  {y.ai_explanation ? (
                    <p className="ai-generated-text">{y.ai_explanation}</p>
                  ) : y.description ? (
                    <span> — {y.description}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="report-no-data">{t('report.noData')}</p>
          )}
        </div>

        <div>
          <h2 className="report-section-title">{t('report.doshas')}</h2>
          {doshas && doshas.length > 0 ? (
            <ul className="report-list">
              {doshas.map((d) => (
                <li key={d.id}>
                  <strong>{d.dosha_name}</strong>
                  <span className={`badge ${d.present ? 'badge-warning' : 'badge-success'}`}>
                    {d.present ? t('report.present') : t('report.notPresent')}
                  </span>
                  {d.ai_explanation ? (
                    <p className="ai-generated-text">{d.ai_explanation}</p>
                  ) : d.description ? (
                    <p className="report-list-desc">{d.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="report-no-data">{t('report.noData')}</p>
          )}
        </div>
      </div>
    </section>
  );
}
