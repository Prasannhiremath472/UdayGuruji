import { useTranslation } from 'react-i18next';
import './ReportSections.css';

export default function PersonalitySummarySection({ summary }) {
  const { t } = useTranslation();

  if (!summary) return null;

  return (
    <section className="report-section">
      <h2 className="report-section-title">{t('report.personalitySummary')}</h2>
      <p className="ai-generated-text">{summary}</p>
      <p className="ai-disclaimer">{t('report.aiDisclaimer')}</p>
    </section>
  );
}
