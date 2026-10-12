import { useTranslation } from 'react-i18next';
import './HomeSections.css';

const BLOCK_KEYS = ['whatIsAstrology', 'howConsultationsWork'];

export default function EducationalContentSection() {
  const { t } = useTranslation();

  return (
    <section className="home-section home-section-bg-about">
      <h2 className="home-section-title">{t('home.educational.title')}</h2>
      <div className="educational-blocks">
        {BLOCK_KEYS.map((key) => (
          <div className="educational-block" key={key}>
            <h3 className="educational-block-title">{t(`home.educational.blocks.${key}.title`)}</h3>
            <p>{t(`home.educational.blocks.${key}.paragraph1`)}</p>
            <p>{t(`home.educational.blocks.${key}.paragraph2`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
