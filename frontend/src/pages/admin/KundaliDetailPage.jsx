import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KundaliReport from '../../components/report/KundaliReport';
import TransitsSection from '../../components/report/TransitsSection';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/common/Button';
import { getKundaliById, downloadPdfAsAdmin } from '../../services/kundaliService';
import './KundaliDetailPage.css';

export default function KundaliDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [kundali, setKundali] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getKundaliById(id);
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
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !kundali) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="kundali-detail-page">
      <div className="detail-toolbar">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          &larr; {t('common.back')}
        </Button>
        <div className="detail-toolbar-actions">
          <Button variant="secondary" onClick={() => window.print()}>
            {t('report.printReport')}
          </Button>
          <Button onClick={() => downloadPdfAsAdmin(kundali.id, `kundali-${kundali.full_name}.pdf`)}>
            {t('report.downloadPdf')}
          </Button>
        </div>
      </div>
      <KundaliReport kundali={kundali} />
      <TransitsSection kundaliId={kundali.id} accessToken={null} />
    </div>
  );
}
