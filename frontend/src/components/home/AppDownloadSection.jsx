import { useTranslation } from 'react-i18next';
import { FaCommentDots, FaShieldAlt } from 'react-icons/fa';
import './HomeSections.css';

export default function AppDownloadSection() {
  const { t } = useTranslation();

  return (
    <section className="home-section app-download-section">
      <div className="app-download-inner">
        <div className="app-download-text">
          <span className="app-download-eyebrow">{t('home.appDownload.eyebrow')}</span>
          <h2 className="app-download-title">{t('home.appDownload.title')}</h2>
          <p className="app-download-subtitle">{t('home.appDownload.subtitle')}</p>
          <ul className="app-download-features">
            <li><FaCommentDots aria-hidden="true" /> {t('home.appDownload.feature1')}</li>
            <li><FaShieldAlt aria-hidden="true" /> {t('home.appDownload.feature2')}</li>
          </ul>
          <p className="app-download-note">{t('home.appDownload.comingSoonNote')}</p>
        </div>
      </div>
    </section>
  );
}
