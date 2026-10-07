import apiClient from './apiClient';

export async function signup(payload) {
  const res = await apiClient.post('/account/signup', payload);
  return res.data.data;
}

export async function login(email, password) {
  const res = await apiClient.post('/account/login', { email, password });
  return res.data.data;
}

export async function fetchCurrentCustomer() {
  const res = await apiClient.get('/account/me');
  return res.data.data;
}
