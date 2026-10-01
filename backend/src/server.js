const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { pool } = require('./database/pool');
const pdfService = require('./services/pdfService');

const server = app.listen(env.port, () => {
  logger.info(`Kundali backend listening on port ${env.port} [${env.nodeEnv}]`);
});

async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);
  server.close(async () => {
    try {
      await pdfService.closeBrowser();
      await pool.end();
      logger.info('Shutdown complete.');
      process.exit(0);
    } catch (err) {
      logger.error(`Error during shutdown: ${err.message}`);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
});
