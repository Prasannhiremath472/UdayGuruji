import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { searchKundalis, deleteKundali, downloadPdfAsAdmin } from '../../services/kundaliService';
import './HistoryPage.css';

export default function HistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebouncedValue(query);

  const [data, setData] = useState({ data: [], pagination: { totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchKundalis({ query: debouncedQuery, dateFrom, dateTo, page, limit: 20 });
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
  }, [debouncedQuery, dateFrom, dateTo, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, dateFrom, dateTo]);

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteKundali(id);
      showToast(t('common.delete') + ' OK', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    }
  };

  const columns = [
    { key: 'full_name', header: t('report.name') },
    { key: 'date_of_birth', header: t('report.dateOfBirth') },
    { key: 'place_of_birth', header: t('report.placeOfBirth') },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="history-actions" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" onClick={() => navigate(`/admin/kundalis/${row.id}`)}>
            {t('admin.view')}
          </Button>
          <Button variant="ghost" onClick={() => downloadPdfAsAdmin(row.id, `kundali-${row.full_name}.pdf`)}>
            {t('report.downloadPdf')}
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)}>
            {t('common.delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="history-page">
      <h1 className="page-title">{t('admin.historyTitle')}</h1>

      <Card>
        <div className="history-filters">
          <Input
            id="search"
            label={t('common.search')}
            placeholder={t('admin.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Input
            id="dateFrom"
            type="date"
            label={t('admin.dateFrom')}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            id="dateTo"
            type="date"
            label={t('admin.dateTo')}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </Card>

      <div className="history-results">
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
              onRowClick={(row) => navigate(`/admin/kundalis/${row.id}`)}
            />
            <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
