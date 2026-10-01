const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/userRepository');
const { ApiError } = require('../utils/apiResponse');

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role, name: user.name, email: user.email },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }
}

module.exports = { login, verifyToken };
