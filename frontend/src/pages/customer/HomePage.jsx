import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaSun, FaHeart, FaStar, FaMoon, FaRegClock, FaHashtag, FaArrowRight,
} from 'react-icons/fa';
import Button from '../../components/common/Button';
import ZodiacWheelIllustration from '../../components/home/ZodiacWheelIllustration';
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import FaqSection from '../../components/home/FaqSection';
import { useBrand } from '../../context/BrandContext';
import './HomePage.css';

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

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-text">
            <span className="home-hero-eyebrow">{t('home.heroEyebrow')}</span>
            <h1 className="home-hero-title">{t('home.heroTitle', { siteName: brand.site_name || t('common.siteName') })}</h1>
            <p className="home-hero-subtitle">{t('home.heroSubtitle')}</p>
            <div className="home-hero-actions">
              <Link to="/kundali">
                <Button>{t('home.generateKundaliCta')}</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-on-ink">{t('home.askQuestionCta')}</Button>
              </Link>
            </div>
          </div>
          <div className="home-hero-visual">
            <ZodiacWheelIllustration className="home-hero-illustration" />
          </div>
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

      <HowItWorksSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
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
