const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/env');
const logger = require('./utils/logger');
const v1Routes = require('./routes/v1');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { success } = require('./utils/apiResponse');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use(
  '/uploads',
  (req, res, next) => {
    // Helmet's default same-origin CORP header would block the frontend
    // (a different origin) from loading logo images via <img src>.
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '..', env.uploads.dir))
);

app.get('/health', (req, res) => success(res, { message: 'Service is healthy', data: { status: 'ok' } }));

app.use(env.apiBasePath, v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
