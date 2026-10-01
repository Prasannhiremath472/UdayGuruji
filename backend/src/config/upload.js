const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const env = require('../config/env');

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', env.uploads.dir, 'logos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `logo-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error('Only PNG, JPEG, WEBP, or SVG images are allowed'));
  }
  cb(null, true);
}

const logoUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.uploads.maxLogoSizeMb * 1024 * 1024 },
});

module.exports = { logoUpload };
