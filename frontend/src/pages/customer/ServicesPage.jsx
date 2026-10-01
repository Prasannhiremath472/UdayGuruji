import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSun, FaHeart, FaStar, FaMoon, FaRegClock, FaHashtag, FaArrowRight } from 'react-icons/fa';
import PageHeader from '../../components/common/PageHeader';
import './ServicesPage.css';

const SERVICES = [
  { to: '/kundali', icon: FaSun, key: 'kundali' },
  { to: '/matching', icon: FaHeart, key: 'matching' },
  { to: '/horoscope', icon: FaStar, key: 'horoscope' },
  { to: '/panchang', icon: FaMoon, key: 'panchang' },
  { to: '/muhurat', icon: FaRegClock, key: 'muhurat' },
  { to: '/numerology', icon: FaHashtag, key: 'numerology' },
];

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <div className="services-page">
      <PageHeader title={t('services.title')} subtitle={t('services.intro')} />
      <div className="page-content-inner">
        <div className="services-list">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link to={service.to} key={service.to} className="service-row">
                <span className="service-icon" aria-hidden="true"><Icon /></span>
                <div className="service-row-text">
                  <h2 className="service-row-title">{t(`home.features.${service.key}.title`)}</h2>
                  <p className="service-row-description">{t(`services.details.${service.key}`)}</p>
                </div>
                <span className="service-arrow" aria-hidden="true"><FaArrowRight /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
