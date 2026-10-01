import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getConsultationById, replyToConsultation } from '../../services/consultationService';
import { useToast } from '../../components/common/Toast';
import './ConsultationDetailPage.css';

export default function ConsultationDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [consultation, setConsultation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConsultationById(id);
      setConsultation(data);
      setReplyText(data.admin_reply || '');
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReply = async (status) => {
    if (!replyText.trim()) {
      showToast(t('consultation.replyRequired'), 'error');
      return;
    }
    setSaving(true);
    try {
      const updated = await replyToConsultation(id, { adminReply: replyText, status });
      setConsultation(updated);
      showToast(t('admin.saveSuccess'), 'success');
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error || !consultation) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="consultation-detail-page">
      <Button variant="ghost" onClick={() => navigate('/admin/consultations')}>
        &larr; {t('common.back')}
      </Button>

      <Card title={consultation.full_name}>
        <dl className="detail-grid">
          <div className="detail-row">
            <dt>{t('admin.email')}</dt>
            <dd>{consultation.email || '-'}</dd>
          </div>
          <div className="detail-row">
            <dt>{t('admin.contactPhone')}</dt>
            <dd>{consultation.phone || '-'}</dd>
          </div>
          <div className="detail-row">
            <dt>{t('report.generatedOn')}</dt>
            <dd>{new Date(consultation.created_at).toLocaleString()}</dd>
          </div>
        </dl>
        <h3 className="consultation-question-title">{t('consultation.question')}</h3>
        <p className="consultation-question-text">{consultation.question}</p>
      </Card>

      <Card title={t('consultation.replyTitle')}>
        <textarea
          className="field-input consultation-reply-textarea"
          rows={6}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={t('consultation.replyPlaceholder')}
        />
        <div className="consultation-reply-actions">
          <Button loading={saving} onClick={() => handleReply('answered')}>
            {t('consultation.sendReply')}
          </Button>
          <Button variant="ghost" loading={saving} onClick={() => handleReply('closed')}>
            {t('consultation.closeWithoutNotify')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
