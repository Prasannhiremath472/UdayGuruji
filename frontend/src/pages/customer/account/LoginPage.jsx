import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import './AccountAuthPages.css';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useCustomerAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || t('account.loginError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="account-auth-page">
      <Card title={t('account.loginTitle')}>
        <form onSubmit={handleSubmit} className="account-auth-form" noValidate>
          <Input
            id="email"
            type="email"
            label={t('account.email')}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Input
            id="password"
            type="password"
            label={t('account.password')}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? <p className="account-auth-error" role="alert">{error}</p> : null}
          <Button type="submit" fullWidth loading={submitting}>
            {t('account.loginButton')}
          </Button>
        </form>
        <p className="account-auth-switch">
          {t('account.noAccount')} <Link to="/account/signup">{t('account.signupLink')}</Link>
        </p>
      </Card>
    </div>
  );
}
