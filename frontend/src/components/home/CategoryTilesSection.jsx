import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaBriefcase, FaHome, FaRegClock } from 'react-icons/fa';
import './HomeSections.css';

const CATEGORIES = [
  { to: '/matching', icon: FaHeart, key: 'loveRelationships' },
  { to: '/numerology', icon: FaBriefcase, key: 'careerMoney' },
  { to: '/kundali', icon: FaHome, key: 'familyHealth' },
  { to: '/muhurat', icon: FaRegClock, key: 'auspiciousTiming' },
];

export default function CategoryTilesSection() {
  const { t } = useTranslation();

  return (
    <section className="home-section">
      <h2 className="home-section-title">{t('home.categories.title')}</h2>
      <div className="category-tiles-grid">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Link to={category.to} key={category.key} className="category-tile">
              <span className="category-tile-icon" aria-hidden="true"><Icon /></span>
              <h3 className="category-tile-title">{t(`home.categories.${category.key}.title`)}</h3>
              <p className="category-tile-description">{t(`home.categories.${category.key}.description`)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
