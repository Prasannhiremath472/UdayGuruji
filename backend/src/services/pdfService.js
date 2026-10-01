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
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });
    return pdfBuffer;
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
