import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import AskQuestionPage from './AskQuestionPage';
import { useBrand } from '../../context/BrandContext';
import './ContactPage.css';

export default function ContactPage() {
  const { t } = useTranslation();
  const { brand } = useBrand();

  const hasContactInfo = brand.contact_email || brand.contact_phone;

  return (
    <div className="contact-page">
      <PageHeader title={t('contact.title')} subtitle={t('contact.intro')} />
      <div className="page-content-inner">
        {hasContactInfo ? (
          <Card title={t('contact.reachUsTitle')}>
            <dl className="contact-info-grid">
              {brand.contact_email ? (
                <div className="detail-row">
                  <dt>{t('admin.email')}</dt>
                  <dd><a href={`mailto:${brand.contact_email}`}>{brand.contact_email}</a></dd>
                </div>
              ) : null}
              {brand.contact_phone ? (
                <div className="detail-row">
                  <dt>{t('admin.contactPhone')}</dt>
                  <dd><a href={`tel:${brand.contact_phone}`}>{brand.contact_phone}</a></dd>
                </div>
              ) : null}
            </dl>
          </Card>
        ) : null}

        <AskQuestionPage />
      </div>
    </div>
  );
}
