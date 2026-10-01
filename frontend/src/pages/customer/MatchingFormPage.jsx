import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import TimeInput12h from '../../components/common/TimeInput12h';
import PageHeader from '../../components/common/PageHeader';
import { createMatch } from '../../services/matchingService';
import { useToast } from '../../components/common/Toast';
import './MatchingFormPage.css';

const EMPTY_PERSON = { fullName: '', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' };

function PersonFields({ label, prefix, value, onChange, errors }) {
  const { t } = useTranslation();
  const handleField = (field) => (e) => onChange(prefix, field, e.target.value);

  return (
    <Card title={label}>
      <div className="person-fields">
        <Input
          id={`${prefix}-fullName`}
          label={t('form.fullName')}
          required
          value={value.fullName}
          onChange={handleField('fullName')}
          error={errors.fullName}
        />
        <Input
          id={`${prefix}-dateOfBirth`}
          type="date"
          label={t('form.dateOfBirth')}
          required
          value={value.dateOfBirth}
          onChange={handleField('dateOfBirth')}
          error={errors.dateOfBirth}
          max={new Date().toISOString().slice(0, 10)}
        />
        <TimeInput12h
          id={`${prefix}-timeOfBirth`}
          label={t('form.timeOfBirth')}
          required
          value={value.timeOfBirth}
          onChange={handleField('timeOfBirth')}
          error={errors.timeOfBirth}
        />
        <Input
          id={`${prefix}-placeOfBirth`}
          label={t('form.placeOfBirth')}
          placeholder={t('form.placeOfBirthPlaceholder')}
          required
          value={value.placeOfBirth}
          onChange={handleField('placeOfBirth')}
          error={errors.placeOfBirth}
        />
      </div>
    </Card>
  );
}

export default function MatchingFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [groom, setGroom] = useState(EMPTY_PERSON);
  const [bride, setBride] = useState(EMPTY_PERSON);
  const [errors, setErrors] = useState({ groom: {}, bride: {} });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (prefix, field, value) => {
    const setter = prefix === 'groom' ? setGroom : setBride;
    setter((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [prefix]: { ...prev[prefix], [field]: undefined } }));
  };

  const validatePerson = (person) => {
    const next = {};
    if (!person.fullName.trim()) next.fullName = t('form.required');
    if (!person.dateOfBirth) next.dateOfBirth = t('form.required');
    if (!person.timeOfBirth) next.timeOfBirth = t('form.required');
    if (!person.placeOfBirth.trim()) next.placeOfBirth = t('form.required');
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const groomErrors = validatePerson(groom);
    const brideErrors = validatePerson(bride);
    setErrors({ groom: groomErrors, bride: brideErrors });
    if (Object.keys(groomErrors).length || Object.keys(brideErrors).length) return;

    setSubmitting(true);
    try {
      const match = await createMatch({ groom, bride });
      navigate(`/matching/${match.id}?accessToken=${encodeURIComponent(match.accessToken)}`);
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="matching-form-page">
      <PageHeader title={t('matching.title')} subtitle={t('matching.subtitle')} />
      <div className="page-content-inner">
        <form onSubmit={handleSubmit} className="matching-form">
          <PersonFields label={t('matching.groom')} prefix="groom" value={groom} onChange={handleChange} errors={errors.groom} />
          <PersonFields label={t('matching.bride')} prefix="bride" value={bride} onChange={handleChange} errors={errors.bride} />
          <Button type="submit" fullWidth loading={submitting}>
            {t('matching.calculate')}
          </Button>
        </form>
      </div>
    </div>
  );
}
