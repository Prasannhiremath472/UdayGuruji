import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './HomeSections.css';

const FAQ_KEYS = ['isFree', 'accuracy', 'dataNeeded', 'privacy', 'languages'];

export default function FaqSection() {
  const { t } = useTranslation();
  const [openKey, setOpenKey] = useState(null);

  return (
    <section className="home-section">
      <h2 className="home-section-title">{t('home.faq.title')}</h2>
      <div className="faq-list">
        {FAQ_KEYS.map((key) => {
          const isOpen = openKey === key;
          return (
            <div className="faq-item" key={key}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={isOpen}
                onClick={() => setOpenKey(isOpen ? null : key)}
              >
                <span>{t(`home.faq.items.${key}.question`)}</span>
                <span className="faq-chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? (
                <p className="faq-answer">{t(`home.faq.items.${key}.answer`)}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
