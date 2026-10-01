import { useTranslation } from 'react-i18next';
import { translateSign, translateNakshatra } from '../../i18n/astrologyTerms';
import './ReportSections.css';

export default function CoreSummarySection({ kundali }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const items = [
    { label: t('report.lagna'), value: translateSign(kundali.lagna, lang) },
    { label: t('report.rashi'), value: translateSign(kundali.rashi, lang) },
    { label: t('report.nakshatra'), value: translateNakshatra(kundali.nakshatra, lang) },
    { label: t('report.nakshatraPada'), value: kundali.nakshatra_pada },
  ];

  return (
    <section className="report-section">
      <div className="summary-grid">
        {items.map((item) => (
          <div className="summary-card" key={item.label}>
            <span className="summary-label">{item.label}</span>
            <span className="summary-value">{item.value || '-'}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
