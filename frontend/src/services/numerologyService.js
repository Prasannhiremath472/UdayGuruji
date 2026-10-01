import apiClient from './apiClient';

export async function calculateNumerology({ fullName, dateOfBirth }) {
  const res = await apiClient.post('/numerology', { fullName, dateOfBirth });
  return res.data.data;
}
