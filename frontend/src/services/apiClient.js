import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const isAdminPath = window.location.pathname.startsWith('/admin');
  const adminToken = localStorage.getItem('kundali_admin_token');
  const customerToken = localStorage.getItem('kundali_customer_token');
  // On admin pages always use the admin token. Elsewhere prefer the
  // customer token when the visitor is logged in, but fall back to an
  // admin token so staff can still use public-facing create flows (e.g.
  // generating a kundali for a walk-in customer) while logged in.
  const token = isAdminPath ? adminToken : (customerToken || adminToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('kundali_admin_token');
      localStorage.removeItem('kundali_admin_user');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    if (error.response?.status === 401 && window.location.pathname.startsWith('/account')) {
      localStorage.removeItem('kundali_customer_token');
      localStorage.removeItem('kundali_customer_user');
      if (!window.location.pathname.includes('/account/login')) {
        window.location.href = '/account/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
