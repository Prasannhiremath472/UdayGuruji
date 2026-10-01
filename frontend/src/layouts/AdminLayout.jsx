import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import './AdminLayout.css';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { brand } = useBrand();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: t('nav.dashboard'), end: true },
    { to: '/admin/history', label: t('nav.history') },
    { to: '/admin/consultations', label: t('nav.consultations') },
    { to: '/admin/brand-settings', label: t('nav.brandSettings') },
  ];

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <button
          type="button"
          className="admin-hamburger"
          aria-label="Toggle navigation"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="admin-brand">
          <img
            src={brand.logo_url || '/udaygurujilogo.png'}
            alt={brand.site_name || t('common.siteName')}
            className="admin-brand-logo"
          />
          {brand.site_name || t('common.siteName')}
        </span>
        <div className="admin-topbar-actions">
          <LanguageSwitcher />
          {user ? (
            <button type="button" className="admin-logout" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          ) : null}
        </div>
      </header>

      <div className="admin-body">
        <aside className={`admin-sidebar ${drawerOpen ? 'admin-sidebar-open' : ''}`}>
          <nav>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
                onClick={() => setDrawerOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        {drawerOpen ? <div className="admin-overlay" onClick={() => setDrawerOpen(false)} /> : null}

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
