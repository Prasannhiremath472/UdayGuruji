import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import KundaliReport from '../../components/report/KundaliReport';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getKundaliById } from '../../services/kundaliService';

/**
 * Chrome-less report page rendered by Puppeteer (pdfService.js on the
 * backend) to produce the downloadable PDF, and also usable directly for
 * a clean browser print. No navigation, toolbar, or footer chrome - just
 * the A4 report itself.
 */
export default function KundaliPrintPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('accessToken');

  const [kundali, setKundali] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getKundaliById(id, accessToken)
      .then((data) => {
        if (!cancelled) setKundali(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Report not found');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, accessToken]);

  if (loading) return <LoadingState />;
  if (error || !kundali) return <ErrorState message={error} />;

  return <KundaliReport kundali={kundali} />;
}
