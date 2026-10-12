import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CoreSummarySection from '../../components/report/CoreSummarySection';
import PersonalitySummarySection from '../../components/report/PersonalitySummarySection';
import BirthDetailsSection from '../../components/report/BirthDetailsSection';
import ChartsSection from '../../components/report/ChartsSection';
import PlanetaryPositionsSection from '../../components/report/PlanetaryPositionsSection';
import DashaSection from '../../components/report/DashaSection';
import YogasDoshasSection from '../../components/report/YogasDoshasSection';
import AshtakavargaSection from '../../components/report/AshtakavargaSection';
import TransitsSection from '../../components/report/TransitsSection';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';
import { getKundaliById, getPublicPdfUrl } from '../../services/kundaliService';
import './KundaliReportPage.css';

export default function KundaliReportPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  const { t } = useTranslation();

  const [kundali, setKundali] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getKundaliById(id, accessToken);
      setKundali(data);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.kundaliNotFound'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken]);

  if (loading) return <LoadingState />;
  if (error || !kundali) return <ErrorState message={error} onRetry={load} />;

  // Tabbed view for on-screen browsing. The PDF/print output is generated
  // separately from KundaliPrintPage -> KundaliReport.jsx, which renders
  // every section on one continuous page regardless of these tabs, so
  // downloading the report always includes everything.
  const tabs = [
    {
      key: 'summary',
      label: t('report.tabs.summary'),
      content: (
        <>
          <CoreSummarySection kundali={kundali} />
          <PersonalitySummarySection summary={kundali.personality_summary} />
          <BirthDetailsSection kundali={kundali} />
        </>
      ),
    },
    {
      key: 'charts',
      label: t('report.tabs.charts'),
      content: <ChartsSection planets={kundali.planets} charts={kundali.charts} />,
    },
    {
      key: 'planets',
      label: t('report.tabs.planets'),
      content: <PlanetaryPositionsSection planets={kundali.planets} />,
    },
    {
      key: 'dasha',
      label: t('report.tabs.dasha'),
      content: <DashaSection dashas={kundali.dashas} />,
    },
    {
      key: 'yogasDoshas',
      label: t('report.tabs.yogasDoshas'),
      content: <YogasDoshasSection yogas={kundali.yogas} doshas={kundali.doshas} />,
    },
    {
      key: 'ashtakavarga',
      label: t('report.tabs.ashtakavarga'),
      content: <AshtakavargaSection ashtakavarga={kundali.ashtakavarga} />,
    },
    {
      key: 'transits',
      label: t('report.tabs.transits'),
      content: <TransitsSection kundaliId={kundali.id} accessToken={accessToken} />,
    },
  ];

  return (
    <div className="kundali-report-page">
      <div className="report-toolbar no-print">
        <Button variant="secondary" onClick={() => window.print()}>
          {t('report.printReport')}
        </Button>
        <a
          className="btn btn-primary"
          href={getPublicPdfUrl(kundali.id, accessToken)}
          target="_blank"
          rel="noreferrer"
        >
          {t('report.downloadPdf')}
        </a>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}
