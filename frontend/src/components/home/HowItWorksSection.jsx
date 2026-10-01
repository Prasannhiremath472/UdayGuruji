import { useTranslation } from 'react-i18next';
import './HomeSections.css';

const STEPS = ['enterDetails', 'weCalculate', 'getReport'];

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section className="home-section">
      <h2 className="home-section-title">{t('home.howItWorks.title')}</h2>
      <div className="steps-row">
        {STEPS.map((key, index) => (
          <div className="step-card" key={key}>
            <div className="step-number">{index + 1}</div>
            <h3 className="step-title">{t(`home.howItWorks.steps.${key}.title`)}</h3>
            <p className="step-description">{t(`home.howItWorks.steps.${key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
