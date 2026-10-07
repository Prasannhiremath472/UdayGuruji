import apiClient from './apiClient';

export async function createKundali(payload) {
  const res = await apiClient.post('/kundalis', payload);
  return res.data.data;
}

export async function getKundaliById(id, accessToken) {
  const res = await apiClient.get(`/kundalis/${id}`, {
    params: accessToken ? { accessToken } : undefined,
  });
  return res.data.data;
}

export async function searchKundalis({ query, dateFrom, dateTo, page = 1, limit = 20 }) {
  const res = await apiClient.get('/kundalis', {
    params: { query, dateFrom, dateTo, page, limit },
  });
  return res.data;
}

export async function deleteKundali(id) {
  await apiClient.delete(`/kundalis/${id}`);
}

export async function getMyKundalis() {
  const res = await apiClient.get('/kundalis/mine');
  return res.data.data;
}

export async function getTransits(id, accessToken) {
  const res = await apiClient.get(`/kundalis/${id}/transits`, {
    params: accessToken ? { accessToken } : undefined,
  });
  return res.data.data;
}

export function getPublicPdfUrl(id, accessToken) {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  return `${base}/kundalis/${id}/pdf?accessToken=${encodeURIComponent(accessToken)}`;
}

export async function downloadPdfAsAdmin(id, fileName) {
  const res = await apiClient.get(`/kundalis/${id}/pdf`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || `kundali-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
