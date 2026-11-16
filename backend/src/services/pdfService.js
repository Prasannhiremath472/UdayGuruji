const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/apiResponse');

let browserPromise = null;

// Bundled Chromium: shared hosting has no system Chrome or its libraries, and
// /tmp is mounted noexec, so everything is extracted under the app directory.
async function prepareChromium() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  const dir = path.join(process.cwd(), '.cache', 'chromium');
  fs.mkdirSync(dir, { recursive: true });
  process.env.TMPDIR = dir;

  const lambdafs = require('@sparticuz/chromium/build/lambdafs').default;
  const binDir = path.join(path.dirname(require.resolve('@sparticuz/chromium/package.json')), 'bin');
  const [executablePath] = await Promise.all([
    lambdafs.inflate(path.join(binDir, 'chromium.br')),
    lambdafs.inflate(path.join(binDir, 'fonts.tar.br')),
    lambdafs.inflate(path.join(binDir, 'swiftshader.tar.br')),
    lambdafs.inflate(path.join(binDir, 'al2023.tar.br')),
  ]);

  process.env.FONTCONFIG_PATH = path.join(dir, 'fonts');
  process.env.LD_LIBRARY_PATH = [path.join(dir, 'al2023', 'lib'), process.env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(':');
  return executablePath;
}

function getBrowser() {
  if (!browserPromise) {
    browserPromise = prepareChromium()
      .then((executablePath) =>
        puppeteer.launch({
          executablePath,
          headless: 'shell',
          args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
        })
      )
      .catch((err) => {
        browserPromise = null;
        throw err;
      });
  }
  return browserPromise;
}

/**
 * Renders the given frontend report URL (a print-ready page) to an A4 PDF
 * buffer. Keeps a single source of truth for report layout: the same
 * React report component drives both browser printing and PDF export.
 */
async function renderReportPdf(reportUrl) {
  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.goto(reportUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.emulateMediaType('print');
    const pdfData = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });
    // page.pdf() returns a Uint8Array, not a true Node Buffer - Express's
    // res.send() only auto-detects real Buffers for binary responses, so
    // passing the Uint8Array through as-is gets JSON-stringified instead
    // of sent as raw bytes, producing a PDF file that downloads but won't
    // open. Wrapping it here (no copy - Buffer.from shares the underlying
    // memory for a Uint8Array) fixes that.
    return Buffer.from(pdfData);
  } catch (err) {
    logger.error(`PDF generation failed for ${reportUrl}: ${err.message}`);
    throw new ApiError(500, 'Unable to generate PDF at this time', 'PDF_GENERATION_FAILED');
  } finally {
    if (page) await page.close();
  }
}

async function closeBrowser() {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

module.exports = { renderReportPdf, closeBrowser };
