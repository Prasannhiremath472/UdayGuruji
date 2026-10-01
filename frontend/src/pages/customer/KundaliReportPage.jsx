import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KundaliReport from '../../components/report/KundaliReport';
import TransitsSection from '../../components/report/TransitsSection';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
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
      <KundaliReport kundali={kundali} />
      <div className="kundali-report-transits">
        <TransitsSection kundaliId={kundali.id} accessToken={accessToken} />
      </div>
    </div>
  );
}
