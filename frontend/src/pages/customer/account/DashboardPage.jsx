import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import LoadingState from '../../../components/common/LoadingState';
import EmptyState from '../../../components/common/EmptyState';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import { getMyKundalis } from '../../../services/kundaliService';
import { getMyMatches } from '../../../services/matchingService';
import './DashboardPage.css';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { customer, logout } = useCustomerAuth();
  const [kundalis, setKundalis] = useState(null);
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    getMyKundalis().then(setKundalis).catch(() => setKundalis([]));
    getMyMatches().then(setMatches).catch(() => setMatches([]));
  }, []);

  return (
    <div className="account-dashboard">
      <div className="account-dashboard-header">
        <h1 className="account-dashboard-title">{t('account.welcomeBack', { name: customer?.name })}</h1>
        <Button variant="ghost" onClick={logout}>{t('account.logout')}</Button>
      </div>

      <Card title={t('account.myKundalis')}>
        {kundalis === null ? (
          <LoadingState />
        ) : kundalis.length === 0 ? (
          <EmptyState
            title={t('account.noKundalis')}
            action={<Link to="/kundali"><Button>{t('account.generateKundali')}</Button></Link>}
          />
        ) : (
          <ul className="account-record-list">
            {kundalis.map((k) => (
              <li key={k.id}>
                <Link to={`/report/${k.id}`}>
                  {k.full_name} — {k.date_of_birth} ({k.rashi || '—'})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title={t('account.myMatches')}>
        {matches === null ? (
          <LoadingState />
        ) : matches.length === 0 ? (
          <EmptyState title={t('account.noMatches')} />
        ) : (
          <ul className="account-record-list">
            {matches.map((m) => (
              <li key={m.id}>
                <Link to={`/matching/${m.id}`}>
                  {m.groom_name} &amp; {m.bride_name} — {m.total_score}/{m.max_score} ({m.verdict})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
