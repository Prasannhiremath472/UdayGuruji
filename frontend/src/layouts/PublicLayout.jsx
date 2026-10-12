import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import NavDropdown from '../components/common/NavDropdown';
import Button from '../components/common/Button';
import { useBrand } from '../context/BrandContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useTheme } from '../context/ThemeContext';
import './PublicLayout.css';

export default function PublicLayout() {
  const { t } = useTranslation();
  const { brand } = useBrand();
  const { isAuthenticated } = useCustomerAuth();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const consultationsItems = [
    { to: '/kundali', label: t('nav.kundali') },
    { to: '/matching', label: t('nav.matching') },
    { to: '/contact', label: t('nav.askQuestion') },
  ];

  const freeServicesItems = [
    { to: '/panchang', label: t('nav.panchang') },
    { to: '/muhurat', label: t('nav.muhurat') },
    { to: '/numerology', label: t('nav.numerology') },
  ];

  // Flat list used for the mobile drawer, where dropdowns don't make sense.
  const mobileNavItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/kundali', label: t('nav.kundali') },
    { to: '/matching', label: t('nav.matching') },
    { to: '/horoscope', label: t('nav.horoscope') },
    { to: '/panchang', label: t('nav.panchang') },
    { to: '/muhurat', label: t('nav.muhurat') },
    { to: '/numerology', label: t('nav.numerology') },
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/contact', label: t('nav.contact') },
    { to: isAuthenticated ? '/account' : '/account/login', label: isAuthenticated ? t('nav.account') : t('nav.accountLogin') },
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
          <NavLink to="/" end className={({ isActive }) => `public-nav-link ${isActive ? 'public-nav-link-active' : ''}`}>
            {t('nav.home')}
          </NavLink>
          <NavDropdown label={t('nav.consultations')} items={consultationsItems} />
          <NavLink to="/horoscope" className={({ isActive }) => `public-nav-link ${isActive ? 'public-nav-link-active' : ''}`}>
            {t('nav.horoscope')}
          </NavLink>
          <NavDropdown label={t('nav.freeServices')} items={freeServicesItems} />
          <NavLink to="/about" className={({ isActive }) => `public-nav-link ${isActive ? 'public-nav-link-active' : ''}`}>
            {t('nav.about')}
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `public-nav-link ${isActive ? 'public-nav-link-active' : ''}`}>
            {t('nav.services')}
          </NavLink>
          <NavLink
            to={isAuthenticated ? '/account' : '/account/login'}
            className={({ isActive }) => `public-nav-link ${isActive ? 'public-nav-link-active' : ''}`}
          >
            {isAuthenticated ? t('nav.account') : t('nav.accountLogin')}
          </NavLink>
        </nav>

        <div className="public-header-actions">
          <Link to="/kundali" className="public-cta-link">
            <Button variant="gold">{t('home.generateKundaliCta')}</Button>
          </Link>
          <button
            type="button"
            className="public-theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>
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
          {mobileNavItems.map((item) => (
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
        <div className="public-footer-inner">
          <div className="public-footer-brand">
            <img
              src={brand.logo_url || '/udaygurujilogo.png'}
              alt={brand.site_name || t('common.siteName')}
              className="public-footer-logo"
            />
            <span>{brand.site_name || t('common.siteName')}</span>
          </div>

          <div className="public-footer-columns">
            <div className="public-footer-column">
              <h3>{t('footer.toolsHeading')}</h3>
              <Link to="/kundali">{t('nav.kundali')}</Link>
              <Link to="/matching">{t('nav.matching')}</Link>
              <Link to="/horoscope">{t('nav.horoscope')}</Link>
              <Link to="/panchang">{t('nav.panchang')}</Link>
              <Link to="/muhurat">{t('nav.muhurat')}</Link>
              <Link to="/numerology">{t('nav.numerology')}</Link>
            </div>

            <div className="public-footer-column">
              <h3>{t('footer.companyHeading')}</h3>
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/services">{t('nav.services')}</Link>
              <Link to="/contact">{t('nav.contact')}</Link>
              <Link to="/admin/login">{t('nav.adminLogin')}</Link>
            </div>

            <div className="public-footer-column">
              <h3>{t('footer.contactHeading')}</h3>
              <p className="public-footer-note">{t('footer.contactNote')}</p>
              {brand.contact_email ? <a href={`mailto:${brand.contact_email}`}>{brand.contact_email}</a> : null}
              {brand.contact_phone ? <a href={`tel:${brand.contact_phone}`}>{brand.contact_phone}</a> : null}
            </div>
          </div>
        </div>

        <div className="public-footer-bottom">
          <p>{brand.footer_text || `© ${new Date().getFullYear()} ${brand.site_name || t('common.siteName')}`}</p>
        </div>
      </footer>
    </div>
  );
}
