import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaSun, FaHeart, FaStar, FaMoon, FaRegClock, FaHashtag, FaArrowRight, FaCommentDots, FaCheckCircle,
} from 'react-icons/fa';
import Button from '../../components/common/Button';
import ZodiacWheelIllustration from '../../components/home/ZodiacWheelIllustration';
import ServicesGridSection from '../../components/home/ServicesGridSection';
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import CategoryTilesSection from '../../components/home/CategoryTilesSection';
import HoroscopePreviewSection from '../../components/home/HoroscopePreviewSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import AppDownloadSection from '../../components/home/AppDownloadSection';
import EducationalContentSection from '../../components/home/EducationalContentSection';
import FaqSection from '../../components/home/FaqSection';
import { useBrand } from '../../context/BrandContext';
import { getPublicStats } from '../../services/kundaliService';
import './HomePage.css';

const QUICK_ACTIONS = [
  { to: '/kundali', icon: FaSun, key: 'kundali' },
  { to: '/matching', icon: FaHeart, key: 'matching' },
  { to: '/horoscope', icon: FaStar, key: 'horoscope' },
  { to: '/contact', icon: FaCommentDots, key: 'askQuestion' },
];

const TICKER_MESSAGE_KEYS = ['item1', 'item2', 'item3', 'item4', 'item5'];

const FEATURES = [
  { to: '/kundali', icon: FaSun, titleKey: 'home.features.kundali.title', descKey: 'home.features.kundali.description' },
  { to: '/matching', icon: FaHeart, titleKey: 'home.features.matching.title', descKey: 'home.features.matching.description' },
  { to: '/horoscope', icon: FaStar, titleKey: 'home.features.horoscope.title', descKey: 'home.features.horoscope.description' },
  { to: '/panchang', icon: FaMoon, titleKey: 'home.features.panchang.title', descKey: 'home.features.panchang.description' },
  { to: '/muhurat', icon: FaRegClock, titleKey: 'home.features.muhurat.title', descKey: 'home.features.muhurat.description' },
  { to: '/numerology', icon: FaHashtag, titleKey: 'home.features.numerology.title', descKey: 'home.features.numerology.description' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { brand } = useBrand();
  const [stats, setStats] = useState(null);
  const tickerMessages = TICKER_MESSAGE_KEYS.map((key) => t(`home.ticker.${key}`));

  useEffect(() => {
    getPublicStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-text">
            <span className="home-hero-eyebrow">{t('home.heroEyebrow')}</span>
            <h1 className="home-hero-title">{t('home.heroTitle', { siteName: brand.site_name || t('common.siteName') })}</h1>
            <ul className="home-hero-bullets">
              <li><FaCheckCircle aria-hidden="true" /> {t('home.heroBullets.freeKundli')}</li>
              <li><FaCheckCircle aria-hidden="true" /> {t('home.heroBullets.classicalMethods')}</li>
            </ul>
            <div className="home-hero-actions">
              <Link to="/kundali">
                <Button>{t('home.generateKundaliCta')}</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary">{t('home.askQuestionCta')}</Button>
              </Link>
            </div>
            {stats ? (
              <div className="home-hero-stats">
                <div className="home-hero-stat">
                  <span className="home-hero-stat-value">{stats.totalKundalis}+</span>
                  <span className="home-hero-stat-label">{t('home.stats.kundalisGenerated')}</span>
                </div>
                <div className="home-hero-stat">
                  <span className="home-hero-stat-value">3</span>
                  <span className="home-hero-stat-label">{t('home.stats.languagesSupported')}</span>
                </div>
                <div className="home-hero-stat home-hero-stat-text">
                  <span className="home-hero-stat-label">{t('home.stats.methodology')}</span>
                </div>
              </div>
            ) : null}
          </div>
          <div className="home-hero-visual">
            <ZodiacWheelIllustration className="home-hero-illustration" />
          </div>
        </div>
      </section>

      <div className="home-ticker" aria-hidden="true">
        <div className="home-ticker-track">
          {[...tickerMessages, ...tickerMessages].map((msg, i) => (
            <span className="home-ticker-item" key={i}>
              <span className="home-ticker-dot" />
              {msg}
            </span>
          ))}
        </div>
      </div>

      <section className="home-quick-actions">
        <h2 className="home-section-title">{t('home.quickActions.title')}</h2>
        <div className="home-quick-actions-grid">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link to={action.to} key={action.key} className="quick-action-card">
                <span className="quick-action-icon" aria-hidden="true"><Icon /></span>
                <h3 className="quick-action-title">{t(`home.quickActions.${action.key}.title`)}</h3>
                <p className="quick-action-description">{t(`home.quickActions.${action.key}.description`)}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-features">
        <h2 className="home-section-title">{t('home.featuresTitle')}</h2>
        <p className="home-section-subtitle">{t('home.featuresSubtitle')}</p>
        <div className="home-features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link to={feature.to} key={feature.to} className="feature-card">
                <span className="feature-icon" aria-hidden="true"><Icon /></span>
                <h3 className="feature-title">{t(feature.titleKey)}</h3>
                <p className="feature-description">{t(feature.descKey)}</p>
                <span className="feature-link">
                  {t('home.exploreLink')} <FaArrowRight aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <CategoryTilesSection />
      <ServicesGridSection />
      <HowItWorksSection />
      <HoroscopePreviewSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <AppDownloadSection />
      <EducationalContentSection />
      <FaqSection />

      <section className="home-cta-band">
        <div className="home-cta-band-inner">
          <h2 className="home-cta-title">{t('home.ctaBandTitle')}</h2>
          <p className="home-cta-text">{t('home.ctaBandSubtitle')}</p>
          <Link to="/kundali">
            <Button variant="gold">{t('home.generateKundaliCta')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
