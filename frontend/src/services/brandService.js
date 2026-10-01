import apiClient from './apiClient';

export async function getBrandSettings() {
  const res = await apiClient.get('/brand');
  return res.data.data;
}

export async function updateBrandSettings(payload) {
  const res = await apiClient.put('/brand', payload);
  return res.data.data;
}

export async function uploadBrandLogo(file) {
  const formData = new FormData();
  formData.append('logo', file);
  const res = await apiClient.post('/brand/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}
