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

// TEMPORARY: logs why Chromium dies on the host; remove once PDFs work.
async function diagnoseChromium() {
  const { spawn, execSync } = require('child_process');
  const exe = path.join(process.cwd(), '.cache', 'chromium', 'chromium');
  const tryRun = (label, cmd, args) =>
    new Promise((resolve) => {
      let buf = '';
      const child = spawn(cmd, args, { env: process.env });
      child.stdout.on('data', (d) => (buf += d));
      child.stderr.on('data', (d) => (buf += d));
      child.on('error', (e) => resolve(label + ' spawn error: ' + e.message));
      child.on('exit', (code, sig) => resolve(label + ' exit code=' + code + ' signal=' + sig + ' ' + buf.slice(-300)));
      setTimeout(() => {
        child.kill('SIGKILL');
        resolve(label + ' STILL RUNNING after 5s (ok) ' + buf.slice(-300));
      }, 5000);
    });
  const sh = (c) => { try { return execSync(c, { encoding: 'utf8', timeout: 3000 }).trim(); } catch (e) { return 'err ' + e.message.slice(0, 80); } };
  try {
    logger.error('CHROMIUM DIAG limits: ' + sh("grep -E 'processes|address space|stack' /proc/self/limits") +
      ' | pids.max=' + sh('cat /sys/fs/cgroup/pids.max') + ' pids.current=' + sh('cat /sys/fs/cgroup/pids.current') +
      ' | ulimit-u=' + sh('ulimit -u') + ' threads-now=' + sh('ls /proc/self/task | wc -l') + ' uid-procs=' + sh('ps -u $(id -u) --no-headers | wc -l'));
    const lowFlags = ['--enable-low-end-device-mode', '--disable-gpu', '--renderer-process-limit=1', '--js-flags=--single-threaded'];
    const base = [...chromium.args, '--headless', '--remote-debugging-port=0', 'about:blank'];
    logger.error('CHROMIUM DIAG B: ' + (await tryRun('lowflags', exe, [...base, ...lowFlags])));
    logger.error('CHROMIUM DIAG C: ' + (await tryRun('lowflags+stack512k', 'sh', ['-c', 'ulimit -s 512; exec "$0" "$@"', exe, ...base, ...lowFlags])));
  } catch (e) {
    logger.error('CHROMIUM DIAG failed: ' + e.message);
  }
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
      .catch(async (err) => {
        browserPromise = null;
        await diagnoseChromium();
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
