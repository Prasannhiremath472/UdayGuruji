import { useTranslation } from 'react-i18next';
import './States.css';

export default function LoadingState({ message }) {
  const { t } = useTranslation();
  return (
    <div className="state-container" role="status" aria-live="polite">
      <span className="state-spinner" aria-hidden="true" />
      <p className="state-message">{message || t('common.loading')}</p>
    </div>
  );
}
