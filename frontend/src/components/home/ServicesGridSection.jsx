import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaSun, FaHashtag, FaHeart, FaMoon, FaRegClock, FaStar, FaArrowRight,
} from 'react-icons/fa';
import './HomeSections.css';

const SERVICES = [
  { to: '/kundali', icon: FaSun, key: 'kundali' },
  { to: '/horoscope', icon: FaStar, key: 'horoscope' },
  { to: '/numerology', icon: FaHashtag, key: 'numerology' },
  { to: '/matching', icon: FaHeart, key: 'matching' },
  { to: '/panchang', icon: FaMoon, key: 'panchang' },
  { to: '/muhurat', icon: FaRegClock, key: 'muhurat' },
];

export default function ServicesGridSection() {
  const { t } = useTranslation();

  return (
    <section className="home-section">
      <h2 className="home-section-title">{t('home.servicesGrid.title')}</h2>
      <div className="services-grid">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <Link to={service.to} key={service.key} className="service-tile">
              <span className="service-tile-icon" aria-hidden="true"><Icon /></span>
              <span className="service-tile-title">{t(`home.servicesGrid.items.${service.key}`)}</span>
              <FaArrowRight className="service-tile-arrow" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
