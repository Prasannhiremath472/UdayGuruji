import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { submitConsultation } from '../../services/consultationService';
import { useToast } from '../../components/common/Toast';
import './AskQuestionPage.css';

const EMPTY_FORM = { fullName: '', email: '', phone: '', question: '' };

export default function AskQuestionPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = t('form.required');
    if (!form.email.trim() && !form.phone.trim()) next.email = t('consultation.contactRequired');
    if (!form.question.trim() || form.question.trim().length < 5) next.question = t('consultation.questionTooShort');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitConsultation(form);
      setSubmitted(true);
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="ask-question-page">
        <Card title={t('consultation.thankYouTitle')}>
          <p>{t('consultation.thankYouMessage')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="ask-question-page">
      <Card title={t('consultation.title')}>
        <form onSubmit={handleSubmit} className="ask-question-form" noValidate>
          <Input
            id="fullName"
            label={t('form.fullName')}
            required
            value={form.fullName}
            onChange={handleChange('fullName')}
            error={errors.fullName}
          />
          <div className="form-row">
            <Input
              id="email"
              type="email"
              label={t('admin.email')}
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
            <Input
              id="phone"
              label={t('admin.contactPhone')}
              value={form.phone}
              onChange={handleChange('phone')}
            />
          </div>
          <div className="field">
            <label htmlFor="question" className="field-label">
              {t('consultation.question')}
              <span className="field-required">*</span>
            </label>
            <textarea
              id="question"
              className={`field-input ask-question-textarea ${errors.question ? 'field-input-error' : ''}`}
              rows={5}
              value={form.question}
              onChange={handleChange('question')}
            />
            {errors.question ? <span className="field-error">{errors.question}</span> : null}
          </div>
          <Button type="submit" fullWidth loading={submitting}>
            {t('consultation.submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
