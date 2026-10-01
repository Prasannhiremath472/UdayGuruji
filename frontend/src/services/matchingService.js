import apiClient from './apiClient';

export async function createMatch({ groom, bride }) {
  const res = await apiClient.post('/matching', { groom, bride });
  return res.data.data;
}

export async function getMatchById(id, accessToken) {
  const res = await apiClient.get(`/matching/${id}`, {
    params: accessToken ? { accessToken } : undefined,
  });
  return res.data.data;
}
