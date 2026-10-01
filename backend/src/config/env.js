require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  return value;
}

const env = {
  nodeEnv: required('NODE_ENV', 'development'),
  port: parseInt(required('PORT', '5000'), 10),
  apiBasePath: required('API_BASE_PATH', '/api/v1'),

  corsOrigins: required('CORS_ORIGINS', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  db: {
    host: required('DB_HOST', 'localhost'),
    port: parseInt(required('DB_PORT', '3306'), 10),
    user: required('DB_USER', 'root'),
    password: required('DB_PASSWORD', ''),
    database: required('DB_NAME', 'kundali_db'),
    connectionLimit: parseInt(required('DB_CONNECTION_LIMIT', '10'), 10),
  },

  jwt: {
    secret: required('JWT_SECRET', ''),
    expiresIn: required('JWT_EXPIRES_IN', '8h'),
  },

  astrology: {
    provider: required('ASTROLOGY_PROVIDER', 'free_astrology_api'),
    apiKey: required('FREE_ASTROLOGY_API_KEY', ''),
    baseUrl: required('FREE_ASTROLOGY_API_BASE_URL', 'https://json.freeastrologyapi.com'),
  },

  geocoding: {
    nominatimBaseUrl: required('NOMINATIM_BASE_URL', 'https://nominatim.openstreetmap.org'),
    nominatimUserAgent: required('NOMINATIM_USER_AGENT', 'UdayGuruji-Kundali/1.0'),
  },

  timezone: {
    apiKey: required('TIMEZONEDB_API_KEY', ''),
    baseUrl: required('TIMEZONEDB_BASE_URL', 'https://api.timezonedb.com/v2.1'),
  },

  gemini: {
    apiKey: required('GEMINI_API_KEY', ''),
    baseUrl: required('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
    model: required('GEMINI_MODEL', 'gemini-2.0-flash'),
    enabled: required('GEMINI_INTERPRETATIONS_ENABLED', 'true') === 'true',
  },

  frontendBaseUrl: required('FRONTEND_BASE_URL', 'http://localhost:5173'),

  uploads: {
    dir: required('UPLOAD_DIR', 'uploads'),
    maxLogoSizeMb: parseInt(required('MAX_LOGO_SIZE_MB', '2'), 10),
  },

  rateLimit: {
    kundaliWindowMinutes: parseInt(required('KUNDALI_RATE_LIMIT_WINDOW_MINUTES', '15'), 10),
    kundaliMax: parseInt(required('KUNDALI_RATE_LIMIT_MAX', '20'), 10),
    authWindowMinutes: parseInt(required('AUTH_RATE_LIMIT_WINDOW_MINUTES', '15'), 10),
    authMax: parseInt(required('AUTH_RATE_LIMIT_MAX', '10'), 10),
  },

  seedAdmin: {
    name: required('SEED_ADMIN_NAME', 'Admin'),
    email: required('SEED_ADMIN_EMAIL', 'admin@example.com'),
    password: required('SEED_ADMIN_PASSWORD', 'ChangeMe123!'),
  },
};

if (env.nodeEnv === 'production') {
  const missing = [];
  if (!env.jwt.secret) missing.push('JWT_SECRET');
  if (!env.db.password) missing.push('DB_PASSWORD');
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }
}

module.exports = env;
