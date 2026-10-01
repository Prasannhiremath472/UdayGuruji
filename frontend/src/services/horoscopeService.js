import apiClient from './apiClient';

export async function getRashis() {
  const res = await apiClient.get('/horoscope');
  return res.data.data;
}

export async function getHoroscope(rashi, period = 'daily') {
  const res = await apiClient.get(`/horoscope/${rashi}`, { params: { period } });
  return res.data.data;
}
