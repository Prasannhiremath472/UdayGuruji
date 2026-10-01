import apiClient from './apiClient';

export async function getPanchang({ date, time, place }) {
  const res = await apiClient.get('/panchang', { params: { date, time, place } });
  return res.data.data;
}

export async function getMuhurat({ date, time, place }) {
  const res = await apiClient.get('/muhurat', { params: { date, time, place } });
  return res.data.data;
}
