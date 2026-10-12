const puppeteer = require('puppeteer');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/apiResponse');

let browserPromise = null;

function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
