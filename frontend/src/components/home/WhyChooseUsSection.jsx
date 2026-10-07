import { useTranslation } from 'react-i18next';
import './HomeSections.css';

const REASONS = ['accuracy', 'privacy', 'classical', 'freeToStart'];

export default function WhyChooseUsSection() {
  const { t } = useTranslation();

  return (
    <section className="home-section">
      <h2 className="home-section-title">{t('home.whyChooseUs.title')}</h2>
      <div className="why-choose-layout">
        <div className="why-choose-image">
          <img src="/images/temple-hands.jpg" alt="" loading="lazy" />
        </div>
        <div className="reasons-grid">
          {REASONS.map((key) => (
            <div className="reason-card" key={key}>
              <h3 className="reason-title">{t(`home.whyChooseUs.reasons.${key}.title`)}</h3>
              <p className="reason-description">{t(`home.whyChooseUs.reasons.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
