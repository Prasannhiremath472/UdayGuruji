import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import PageHeader from '../../components/common/PageHeader';
import { getMuhurat } from '../../services/panchangService';
import { useToast } from '../../components/common/Toast';
import './PanchangMuhuratPage.css';

const today = () => new Date().toISOString().slice(0, 10);

const FAVORABLE_KEYS = ['abhijit', 'amrit_kaal', 'brahma_muhurat'];
const UNFAVORABLE_KEYS = ['rahu_kalam', 'yama_gandam', 'gulika_kalam', 'varjyam'];

function formatWindow(window) {
  if (!window) return null;
  if (window.starts_at && window.ends_at) {
    const time = (str) => str.split(' ')[1]?.slice(0, 5);
    return `${time(window.starts_at)} - ${time(window.ends_at)}`;
  }
  return null;
}

export default function MuhuratPage() {
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
      const data = await getMuhurat(form);
      setResult(data);
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panchang-page">
      <PageHeader title={t('muhurat.title')} />
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
              {t('muhurat.getMuhurat')}
            </Button>
          </form>
        </Card>

        {loading ? <LoadingState /> : null}

        {result ? (
          <div className="muhurat-results">
            <Card title={t('muhurat.favorable')}>
              <ul className="muhurat-list">
                {FAVORABLE_KEYS.map((key) => {
                  const window = formatWindow(result[key]);
                  return window ? (
                    <li key={key} className="muhurat-item muhurat-item-good">
                      <span>{t(`muhurat.windows.${key}`)}</span>
                      <span>{window}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            </Card>
            <Card title={t('muhurat.unfavorable')}>
              <ul className="muhurat-list">
                {UNFAVORABLE_KEYS.map((key) => {
                  const window = formatWindow(result[key]);
                  return window ? (
                    <li key={key} className="muhurat-item muhurat-item-bad">
                      <span>{t(`muhurat.windows.${key}`)}</span>
                      <span>{window}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
