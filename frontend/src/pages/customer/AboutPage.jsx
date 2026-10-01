import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import ConstellationIllustration from '../../components/home/ConstellationIllustration';
import './AboutPage.css';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <PageHeader title={t('about.title')} subtitle={t('about.intro')} />
      <div className="page-content-inner">
        <ConstellationIllustration className="home-divider" />

        <Card title={t('about.missionTitle')}>
          <p>{t('about.missionText')}</p>
        </Card>

        <Card title={t('about.approachTitle')}>
          <p>{t('about.approachText')}</p>
        </Card>

        <section className="about-cta">
          <p>{t('about.ctaText')}</p>
          <Link to="/kundali">
            <Button>{t('home.generateKundaliCta')}</Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
