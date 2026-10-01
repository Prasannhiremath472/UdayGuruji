import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { searchConsultations } from '../../services/consultationService';
import './ConsultationsPage.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'answered', label: 'Answered' },
  { value: 'closed', label: 'Closed' },
];

export default function ConsultationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], pagination: { totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchConsultations({ status, page, limit: 20 });
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
  }, [status, page]);

  const columns = [
    { key: 'full_name', header: t('report.name') },
    { key: 'question', header: t('consultation.question'), render: (row) => `${row.question.slice(0, 60)}${row.question.length > 60 ? '…' : ''}` },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className={`status-badge status-${row.status}`}>{row.status}</span>,
    },
    { key: 'created_at', header: t('report.generatedOn'), render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="consultations-page">
      <h1 className="page-title">{t('nav.consultations')}</h1>

      <Card>
        <Select
          id="status"
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        />
      </Card>

      <div className="consultations-results">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : data.data.length === 0 ? (
          <EmptyState title={t('admin.noResults')} />
        ) : (
          <>
            <Table
              columns={columns}
              rows={data.data}
              rowKey="id"
              onRowClick={(row) => navigate(`/admin/consultations/${row.id}`)}
            />
            <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
