import apiClient from './apiClient';

export async function submitConsultation({ fullName, email, phone, kundaliId, question }) {
  const res = await apiClient.post('/consultations', { fullName, email, phone, kundaliId, question });
  return res.data.data;
}

export async function searchConsultations({ status, page = 1, limit = 20 }) {
  const res = await apiClient.get('/consultations', { params: { status, page, limit } });
  return res.data;
}

export async function getConsultationById(id) {
  const res = await apiClient.get(`/consultations/${id}`);
  return res.data.data;
}

export async function replyToConsultation(id, { adminReply, status }) {
  const res = await apiClient.patch(`/consultations/${id}`, { adminReply, status });
  return res.data.data;
}
