import { BeforeAll, AfterAll, Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';
import { CustomWorld } from './customWorld';
import { Config } from '../config/environment';
import { Logger } from '../utils/logger';
import * as path from 'path';
import * as fs from 'fs-extra';

setDefaultTimeout(60 * 1000);

let globalBrowser: Browser;

BeforeAll(async function () {
  Logger.info(`[LIFECYCLE] Initializing browser: ${Config.browser} (Headless: ${Config.headless})`);
  const launchOptions = {
    headless: Config.headless,
    slowMo: Config.slowMo,
  };

  switch (Config.browser.toLowerCase()) {
    case 'firefox':
      globalBrowser = await firefox.launch(launchOptions);
      break;
    case 'webkit':
      globalBrowser = await webkit.launch(launchOptions);
      break;
    case 'chromium':
    default:
      globalBrowser = await chromium.launch(launchOptions);
      break;
  }
});

Before(async function (this: CustomWorld, scenario) {
  Logger.info(`--------------------------------------------------------------------------------`);
  Logger.info(`[SCENARIO START] ${scenario.pickle.name}`);

  // Create isolated context per scenario to ensure total test independence
  const videoDir = path.resolve(process.cwd(), 'reports/videos');
  fs.ensureDirSync(videoDir);

  this.browser = globalBrowser;
  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: Config.recordVideo !== 'off' ? { dir: videoDir } : undefined,
    ignoreHTTPSErrors: true,
  });

  // Start tracing for rich post-mortem debugging
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  this.page = await this.context.newPage();
  this.initPages(this.page);
});

After(async function (this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
  const tracesDir = path.resolve(process.cwd(), 'reports/traces');
  const screenshotsDir = path.resolve(process.cwd(), 'reports/screenshots');
  fs.ensureDirSync(tracesDir);
  fs.ensureDirSync(screenshotsDir);

  const isFailed = scenario.result?.status === Status.FAILED;

  if (isFailed) {
    Logger.error(`[SCENARIO FAILED] ${scenario.pickle.name}`);
    const screenshotPath = path.join(screenshotsDir, `FAILED_${scenarioName}_${Date.now()}.png`);
    const screenshotBuffer = await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.attach(screenshotBuffer, 'image/png');
    Logger.info(`Evidence screenshot saved: ${screenshotPath}`);

    // Save trace on failure
    const tracePath = path.join(tracesDir, `TRACE_${scenarioName}.zip`);
    await this.context.tracing.stop({ path: tracePath });
    Logger.info(`Playwright trace saved: ${tracePath}`);
  } else {
    Logger.info(`[SCENARIO PASSED] ${scenario.pickle.name}`);
    // Discard trace if passed to optimize disk
    await this.context.tracing.stop();
  }

  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  Logger.info('[LIFECYCLE] Closing browser instance');
  if (globalBrowser) {
    await globalBrowser.close();
  }
});
