import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <EmptyState
      title="404"
      description={t('errors.notFound')}
      action={
        <Link to="/">
          <Button>{t('nav.home')}</Button>
        </Link>
      }
    />
  );
}
