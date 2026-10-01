import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/customer/HomePage';
import AboutPage from './pages/customer/AboutPage';
import ServicesPage from './pages/customer/ServicesPage';
import ContactPage from './pages/customer/ContactPage';
import KundaliFormPage from './pages/customer/KundaliFormPage';
import KundaliReportPage from './pages/customer/KundaliReportPage';
import KundaliPrintPage from './pages/customer/KundaliPrintPage';
import HoroscopePage from './pages/customer/HoroscopePage';
import PanchangPage from './pages/customer/PanchangPage';
import MuhuratPage from './pages/customer/MuhuratPage';
import NumerologyPage from './pages/customer/NumerologyPage';
import MatchingFormPage from './pages/customer/MatchingFormPage';
import MatchingResultPage from './pages/customer/MatchingResultPage';

import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import HistoryPage from './pages/admin/HistoryPage';
import KundaliDetailPage from './pages/admin/KundaliDetailPage';
import BrandSettingsPage from './pages/admin/BrandSettingsPage';
import ConsultationsPage from './pages/admin/ConsultationsPage';
import ConsultationDetailPage from './pages/admin/ConsultationDetailPage';

import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Kept for any existing bookmarks/links to the old direct URL. */}
        <Route path="/ask" element={<Navigate to="/contact" replace />} />
        <Route path="/kundali" element={<KundaliFormPage />} />
        <Route path="/report/:id" element={<KundaliReportPage />} />
        <Route path="/horoscope" element={<HoroscopePage />} />
        <Route path="/panchang" element={<PanchangPage />} />
        <Route path="/muhurat" element={<MuhuratPage />} />
        <Route path="/numerology" element={<NumerologyPage />} />
        <Route path="/matching" element={<MatchingFormPage />} />
        <Route path="/matching/:id" element={<MatchingResultPage />} />
      </Route>

      {/* Chrome-less print/PDF route: intentionally outside PublicLayout so
          Puppeteer renders only the report itself, with no nav/footer. */}
      <Route path="/report/:id/print" element={<KundaliPrintPage />} />

      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/history" element={<HistoryPage />} />
          <Route path="/admin/kundalis/:id" element={<KundaliDetailPage />} />
          <Route path="/admin/brand-settings" element={<BrandSettingsPage />} />
          <Route path="/admin/consultations" element={<ConsultationsPage />} />
          <Route path="/admin/consultations/:id" element={<ConsultationDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
