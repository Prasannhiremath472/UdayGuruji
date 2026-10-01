import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import PageHeader from '../../components/common/PageHeader';
import { getPanchang } from '../../services/panchangService';
import { useToast } from '../../components/common/Toast';
import './PanchangMuhuratPage.css';

const today = () => new Date().toISOString().slice(0, 10);

export default function PanchangPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ date: today(), place: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.place.trim()) {
      showToast(t('form.required'), 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await getPanchang(form);
      setResult(data);
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const panchangRows = result
    ? [
        [t('panchang.tithi'), result.tithi?.name],
        [t('panchang.nakshatra'), result.nakshatra?.name],
        [t('panchang.yoga'), result.yoga?.['1']?.name],
        [t('panchang.karana'), result.karana?.['1']?.name],
        [t('panchang.weekday'), result.weekday?.vedic_weekday_name],
        [t('panchang.sunrise'), result.sunrise],
        [t('panchang.sunset'), result.sunset],
      ]
    : [];

  return (
    <div className="panchang-page">
      <PageHeader title={t('panchang.title')} />
      <div className="page-content-inner">
        <Card>
          <form onSubmit={handleSubmit} className="lookup-form" noValidate>
            <Input
              id="date"
              type="date"
              label={t('form.dateOfBirth')}
              required
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />
            <Input
              id="place"
              label={t('form.placeOfBirth')}
              placeholder={t('form.placeOfBirthPlaceholder')}
              required
              value={form.place}
              onChange={(e) => setForm((p) => ({ ...p, place: e.target.value }))}
            />
            <Button type="submit" fullWidth loading={loading}>
              {t('panchang.getPanchang')}
            </Button>
          </form>
        </Card>

        {loading ? <LoadingState /> : null}

        {result ? (
          <Card title={t('panchang.resultsFor', { date: result.date })}>
            <dl className="lookup-detail-grid">
              {panchangRows.map(([label, value]) => (
                <div className="detail-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{value || '-'}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
