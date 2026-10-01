const consultationRepository = require('../repositories/consultationRepository');
const { ApiError } = require('../utils/apiResponse');

async function submitQuestion(input) {
  const id = await consultationRepository.create(input);
  return consultationRepository.findById(id);
}

async function getById(id) {
  const consultation = await consultationRepository.findById(id);
  if (!consultation) {
    throw new ApiError(404, 'Consultation not found', 'CONSULTATION_NOT_FOUND');
  }
  return consultation;
}

async function search(params) {
  return consultationRepository.search(params);
}

async function replyToConsultation(id, { adminReply, status = 'answered', repliedBy }) {
  await getById(id);
  return consultationRepository.reply(id, { adminReply, status, repliedBy });
}

module.exports = { submitQuestion, getById, search, replyToConsultation };
