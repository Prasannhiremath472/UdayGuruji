import { createContext, useContext, useEffect, useState } from 'react';
import * as brandService from '../services/brandService';

const DEFAULT_BRAND = {
  site_name: 'UdayGuruji Kundali',
  logo_url: null,
  primary_color: '#7A2E2E',
  contact_email: null,
  contact_phone: null,
  footer_text: null,
};

const BrandContext = createContext({ brand: DEFAULT_BRAND, loading: true, refresh: () => {} });

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await brandService.getBrandSettings();
      if (data) setBrand(data);
    } catch {
      // fall back to default brand silently; not a fatal condition for the site to render
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (brand.primary_color) {
      document.documentElement.style.setProperty('--color-primary', brand.primary_color);
    }
  }, [brand.primary_color]);

  return (
    <BrandContext.Provider value={{ brand, loading, refresh: load }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
