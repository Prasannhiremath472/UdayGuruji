import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import './styles/tokens.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { BrandProvider } from './context/BrandContext';
import { ToastProvider } from './components/common/Toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <BrandProvider>
            <App />
          </BrandProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
