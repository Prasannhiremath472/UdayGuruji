import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import './AccountAuthPages.css';

export default function SignupPage() {
  const { t } = useTranslation();
  const { signup } = useCustomerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || t('account.signupError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="account-auth-page">
      <Card title={t('account.signupTitle')}>
        <form onSubmit={handleSubmit} className="account-auth-form" noValidate>
          <Input
            id="name"
            label={t('account.name')}
            required
            value={form.name}
            onChange={update('name')}
            autoComplete="name"
          />
          <Input
            id="email"
            type="email"
            label={t('account.email')}
            required
            value={form.email}
            onChange={update('email')}
            autoComplete="email"
          />
          <Input
            id="phone"
            type="tel"
            label={t('account.phone')}
            value={form.phone}
            onChange={update('phone')}
            autoComplete="tel"
          />
          <Input
            id="password"
            type="password"
            label={t('account.password')}
            required
            minLength={8}
            value={form.password}
            onChange={update('password')}
            autoComplete="new-password"
          />
          {error ? <p className="account-auth-error" role="alert">{error}</p> : null}
          <Button type="submit" fullWidth loading={submitting}>
            {t('account.signupButton')}
          </Button>
        </form>
        <p className="account-auth-switch">
          {t('account.haveAccount')} <Link to="/account/login">{t('account.loginLink')}</Link>
        </p>
      </Card>
    </div>
  );
}
