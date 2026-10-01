import { useTranslation } from 'react-i18next';
import BirthDetailsSection from './BirthDetailsSection';
import CoreSummarySection from './CoreSummarySection';
import PersonalitySummarySection from './PersonalitySummarySection';
import ChartsSection from './ChartsSection';
import PlanetaryPositionsSection from './PlanetaryPositionsSection';
import DashaSection from './DashaSection';
import YogasDoshasSection from './YogasDoshasSection';
import AshtakavargaSection from './AshtakavargaSection';
import { useBrand } from '../../context/BrandContext';
import './KundaliReport.css';

export default function KundaliReport({ kundali }) {
  const { t } = useTranslation();
  const { brand } = useBrand();

  return (
    <article className="kundali-report a4-page">
      <header className="report-header">
        <img src={brand.logo_url || '/udaygurujilogo.png'} alt={brand.site_name} className="report-logo" />
        <div>
          <h1 className="report-main-title">{t('report.title')}</h1>
          <p className="report-brand-name">{brand.site_name}</p>
        </div>
      </header>

      <CoreSummarySection kundali={kundali} />
      <PersonalitySummarySection summary={kundali.personality_summary} />
      <BirthDetailsSection kundali={kundali} />
      <ChartsSection planets={kundali.planets} charts={kundali.charts} />
      <PlanetaryPositionsSection planets={kundali.planets} />
      <DashaSection dashas={kundali.dashas} />
      <YogasDoshasSection yogas={kundali.yogas} doshas={kundali.doshas} />
      <AshtakavargaSection ashtakavarga={kundali.ashtakavarga} />

      <footer className="report-footer">
        <p>{t('report.generatedOn')}: {new Date(kundali.created_at).toLocaleString()}</p>
        {brand.footer_text ? <p>{brand.footer_text}</p> : null}
      </footer>
    </article>
  );
}
