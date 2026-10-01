import { useTranslation } from 'react-i18next';
import './ReportSections.css';

export default function BirthDetailsSection({ kundali }) {
  const { t } = useTranslation();

  const rows = [
    [t('report.name'), kundali.full_name],
    [t('report.dateOfBirth'), kundali.date_of_birth],
    [t('report.timeOfBirth'), kundali.time_of_birth],
    [t('report.placeOfBirth'), kundali.place_of_birth],
    [t('report.coordinates'), `${kundali.latitude}, ${kundali.longitude}`],
    [t('report.timezone'), kundali.timezone],
    [t('report.ayanamsa'), kundali.ayanamsa],
  ];

  return (
    <section className="report-section">
      <h2 className="report-section-title">{t('report.birthDetails')}</h2>
      <dl className="detail-grid">
        {rows.map(([label, value]) => (
          <div className="detail-row" key={label}>
            <dt>{label}</dt>
            <dd>{value || '-'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
