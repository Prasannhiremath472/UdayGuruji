import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import TimeInput12h from '../../components/common/TimeInput12h';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import { createKundali } from '../../services/kundaliService';
import { useToast } from '../../components/common/Toast';
import './KundaliFormPage.css';

const INITIAL_FORM = {
  fullName: '',
  gender: '',
  dateOfBirth: '',
  timeOfBirth: '',
  placeOfBirth: '',
};

export default function KundaliFormPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const genderOptions = [
    { value: '', label: '-' },
    { value: 'male', label: t('form.genderMale') },
    { value: 'female', label: t('form.genderFemale') },
    { value: 'other', label: t('form.genderOther') },
  ];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = t('form.required');
    if (!form.dateOfBirth) next.dateOfBirth = t('form.required');
    if (!form.timeOfBirth) next.timeOfBirth = t('form.required');
    if (!form.placeOfBirth.trim()) next.placeOfBirth = t('form.required');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const kundali = await createKundali({ ...form, languagePreference: i18n.language });
      navigate(`/report/${kundali.id}?accessToken=${encodeURIComponent(kundali.accessToken)}`);
    } catch (err) {
      const message = err.response?.data?.message || t('form.errorGeneric');
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="kundali-form-page">
      <PageHeader title={t('form.title')} subtitle={t('form.subtitle')} />
      <div className="page-content-inner">
        <Card>
          <form onSubmit={handleSubmit} className="kundali-form" noValidate>
            <Input
              id="fullName"
              label={t('form.fullName')}
              placeholder={t('form.fullNamePlaceholder')}
              required
              value={form.fullName}
              onChange={handleChange('fullName')}
              error={errors.fullName}
            />

            <Select
              id="gender"
              label={t('form.gender')}
              options={genderOptions}
              value={form.gender}
              onChange={handleChange('gender')}
            />

            <Input
              id="dateOfBirth"
              type="date"
              label={t('form.dateOfBirth')}
              required
              value={form.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              error={errors.dateOfBirth}
              max={new Date().toISOString().slice(0, 10)}
            />

            <TimeInput12h
              id="timeOfBirth"
              label={t('form.timeOfBirth')}
              required
              value={form.timeOfBirth}
              onChange={handleChange('timeOfBirth')}
              error={errors.timeOfBirth}
            />

            <Input
              id="placeOfBirth"
              label={t('form.placeOfBirth')}
              placeholder={t('form.placeOfBirthPlaceholder')}
              required
              value={form.placeOfBirth}
              onChange={handleChange('placeOfBirth')}
              error={errors.placeOfBirth}
            />

            <Button type="submit" fullWidth loading={submitting}>
              {submitting ? t('form.generating') : t('form.generateButton')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
