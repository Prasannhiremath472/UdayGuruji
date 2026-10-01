import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { useBrand } from '../context/BrandContext';
import './PublicLayout.css';

export default function PublicLayout() {
  const { t } = useTranslation();
  const { brand } = useBrand();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/kundali', label: t('nav.kundali') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <div className="public-layout">
      <header className="public-header">
        <Link to="/" className="public-brand">
          <img
            src={brand.logo_url || '/udaygurujilogo.png'}
            alt={brand.site_name || t('common.siteName')}
            className="public-brand-logo"
          />
        </Link>

        <nav className="public-nav public-nav-desktop">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `public-nav-link ${isActive ? 'public-nav-link-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="public-header-actions">
          <LanguageSwitcher />
          <button
            type="button"
            className="public-hamburger"
            aria-label="Toggle navigation"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {drawerOpen ? (
        <nav className="public-nav-mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `public-nav-link ${isActive ? 'public-nav-link-active' : ''}`}
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <main className="public-main public-main-full-bleed">
        <Outlet />
      </main>
      <footer className="public-footer">
        <nav className="public-footer-links" aria-label="Tools">
          <Link to="/horoscope">{t('nav.horoscope')}</Link>
          <Link to="/matching">{t('nav.matching')}</Link>
          <Link to="/panchang">{t('nav.panchang')}</Link>
          <Link to="/muhurat">{t('nav.muhurat')}</Link>
          <Link to="/numerology">{t('nav.numerology')}</Link>
        </nav>
        <p>{brand.footer_text || `© ${new Date().getFullYear()} ${brand.site_name || t('common.siteName')}`}</p>
      </footer>
    </div>
  );
}
