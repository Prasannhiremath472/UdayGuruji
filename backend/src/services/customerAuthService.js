const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const customerRepository = require('../repositories/customerRepository');
const { ApiError } = require('../utils/apiResponse');

function issueToken(customer) {
  const token = jwt.sign(
    { sub: customer.id, name: customer.name, email: customer.email, type: 'customer' },
    env.customerJwt.secret,
    { expiresIn: env.customerJwt.expiresIn }
  );

  return {
    token,
    customer: { id: customer.id, name: customer.name, email: customer.email },
  };
}

async function signup({ name, email, phone, password }) {
  const existing = await customerRepository.findByEmail(email);
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists', 'EMAIL_IN_USE');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = await customerRepository.create({ name, email, phone, passwordHash });

  return issueToken({ id, name, email });
}

async function login(email, password) {
  const customer = await customerRepository.findByEmail(email);
  if (!customer) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const isValid = await bcrypt.compare(password, customer.password_hash);
  if (!isValid) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  return issueToken(customer);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.customerJwt.secret);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired session', 'INVALID_TOKEN');
  }
}

module.exports = { signup, login, verifyToken };
