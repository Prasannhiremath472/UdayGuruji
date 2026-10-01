import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useBrand } from '../../context/BrandContext';
import { useToast } from '../../components/common/Toast';
import * as brandService from '../../services/brandService';
import './BrandSettingsPage.css';

export default function BrandSettingsPage() {
  const { t } = useTranslation();
  const { brand, refresh } = useBrand();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    siteName: brand.site_name || '',
    primaryColor: brand.primary_color || '#7A2E2E',
    contactEmail: brand.contact_email || '',
    contactPhone: brand.contact_phone || '',
    footerText: brand.footer_text || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await brandService.updateBrandSettings(form);
      await refresh();
      showToast(t('admin.saveSuccess'), 'success');
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      await brandService.uploadBrandLogo(file);
      await refresh();
      showToast(t('admin.saveSuccess'), 'success');
    } catch (err) {
      showToast(err.response?.data?.message || t('errors.generic'), 'error');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  return (
    <div className="brand-settings-page">
      <h1 className="page-title">{t('admin.brandSettingsTitle')}</h1>

      <Card title={t('admin.logo')}>
        <div className="logo-section">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt="Current logo" className="logo-preview" />
          ) : (
            <div className="logo-preview logo-preview-empty">{t('admin.logo')}</div>
          )}
          <label className="btn btn-secondary logo-upload-btn">
            {uploadingLogo ? t('common.loading') : t('admin.uploadLogo')}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              hidden
              disabled={uploadingLogo}
            />
          </label>
        </div>
      </Card>

      <Card title={t('admin.brandSettingsTitle')}>
        <form onSubmit={handleSave} className="brand-form">
          <Input id="siteName" label={t('admin.siteName')} value={form.siteName} onChange={handleChange('siteName')} />
          <Input
            id="primaryColor"
            type="color"
            label={t('admin.primaryColor')}
            value={form.primaryColor}
            onChange={handleChange('primaryColor')}
          />
          <Input
            id="contactEmail"
            type="email"
            label={t('admin.contactEmail')}
            value={form.contactEmail}
            onChange={handleChange('contactEmail')}
          />
          <Input
            id="contactPhone"
            label={t('admin.contactPhone')}
            value={form.contactPhone}
            onChange={handleChange('contactPhone')}
          />
          <Input
            id="footerText"
            label={t('admin.footerText')}
            value={form.footerText}
            onChange={handleChange('footerText')}
          />
          <Button type="submit" loading={saving}>
            {t('common.save')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
