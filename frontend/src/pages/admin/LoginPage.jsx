import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
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
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || t('admin.loginError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Card title={t('admin.loginTitle')}>
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <Input
            id="email"
            type="email"
            label={t('admin.email')}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Input
            id="password"
            type="password"
            label={t('admin.password')}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? <p className="login-error" role="alert">{error}</p> : null}
          <Button type="submit" fullWidth loading={submitting}>
            {t('admin.loginButton')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
