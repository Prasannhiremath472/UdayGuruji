import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { searchKundalis } from '../../services/kundaliService';
import './DashboardPage.css';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchKundalis({ page: 1, limit: 10 });
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const columns = [
    { key: 'full_name', header: t('report.name') },
    { key: 'date_of_birth', header: t('report.dateOfBirth') },
    { key: 'place_of_birth', header: t('report.placeOfBirth') },
    { key: 'created_at', header: t('report.generatedOn'), render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">{t('admin.dashboardTitle')}</h1>

      <div className="dashboard-stats">
        <Card>
          <span className="stat-label">{t('admin.totalKundalis')}</span>
          <span className="stat-value">{data.pagination?.total ?? 0}</span>
        </Card>
      </div>

      <Card title={t('admin.recentKundalis')}>
        {data.data.length === 0 ? (
          <EmptyState title={t('admin.noResults')} />
        ) : (
          <Table
            columns={columns}
            rows={data.data}
            rowKey="id"
            onRowClick={(row) => navigate(`/admin/kundalis/${row.id}`)}
          />
        )}
      </Card>
    </div>
  );
}
