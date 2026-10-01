import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import { calculateNumerology } from '../../services/numerologyService';
import { useToast } from '../../components/common/Toast';
import './NumerologyPage.css';

export default function NumerologyPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ fullName: '', dateOfBirth: '' });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = t('form.required');
    if (!form.dateOfBirth) next.dateOfBirth = t('form.required');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await calculateNumerology(form);
      setResult(data);
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="numerology-page">
      <PageHeader title={t('numerology.title')} subtitle={t('numerology.subtitle')} />
      <div className="page-content-inner">
        <Card>
          <form onSubmit={handleSubmit} className="numerology-form" noValidate>
            <Input
              id="fullName"
              label={t('form.fullName')}
              required
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              error={errors.fullName}
            />
            <Input
              id="dateOfBirth"
              type="date"
              label={t('form.dateOfBirth')}
              required
              value={form.dateOfBirth}
              onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
              error={errors.dateOfBirth}
              max={new Date().toISOString().slice(0, 10)}
            />
            <Button type="submit" fullWidth loading={submitting}>
              {t('numerology.calculate')}
            </Button>
          </form>
        </Card>

        {result ? (
          <div className="numerology-results">
            {[result.lifePath, result.destiny, result.soulUrge].map((item) => (
              <Card key={item.label} className="numerology-card">
                <div className="numerology-number">{item.number}</div>
                <div>
                  <h3 className="numerology-label">{item.label}</h3>
                  <p className="numerology-meaning">{item.meaning}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
