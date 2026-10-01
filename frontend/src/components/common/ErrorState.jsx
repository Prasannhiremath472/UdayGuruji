import { useTranslation } from 'react-i18next';
import Button from './Button';
import './States.css';

export default function ErrorState({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="state-container state-error" role="alert">
      <p className="state-title">{message || t('errors.generic')}</p>
      {onRetry ? (
        <div className="state-action">
          <Button variant="secondary" onClick={onRetry}>
            {t('common.tryAgain')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
