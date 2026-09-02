/// <reference path="../types/declarations.d.ts" />
import * as report from 'multiple-cucumber-html-reporter';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { Logger } from './logger';


function sanitizeReportFooters(dir: string): void {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      sanitizeReportFooters(fullPath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      content = content.replace(
        /<div class="created-by">[\s\S]*?<\/div>/g,
        `<div class="created-by text-center" style="margin: 20px 0; padding: 15px; color: #73879C; font-size: 13px;">
          <p style="margin: 0; font-weight: 600;">E2E Test Automation Report</p>
          <p style="margin: 4px 0 0 0; font-size: 11px;">Playwright &bull; Cucumber BDD &bull; TypeScript &bull; Page Object Model</p>
        </div>`
      );

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

export function generateHtmlReport(): void {
  const jsonReportDir = path.resolve(process.cwd(), 'reports/json');
  const htmlReportDir = path.resolve(process.cwd(), 'reports/html/advanced');

  if (!fs.existsSync(path.join(jsonReportDir, 'cucumber_report.json'))) {
    Logger.warn('No cucumber_report.json found. Skipping HTML report generation.');
    return;
  }

  fs.ensureDirSync(htmlReportDir);

  try {
    report.generate({
      jsonDir: jsonReportDir,
      reportPath: htmlReportDir,
      metadata: {
        browser: {
          name: (process.env.BROWSER || 'chromium') as 'chrome' | 'firefox' | 'edge',
          version: '1.49',
        },
        device: 'Local Test Runner',
        platform: {
          name: (os.platform() === 'win32' ? 'windows' : os.platform() === 'darwin' ? 'osx' : 'linux') as 'windows' | 'osx' | 'linux',
          version: os.release(),
        },
      },
      customData: {
        title: 'SauceDemo E2E Execution Metrics',
        data: [
          { label: 'Project', value: 'SauceDemo Playwright BDD' },
          { label: 'Architecture', value: 'Page Object Model + Gherkin' },
          { label: 'Execution Date', value: new Date().toLocaleString() },
          { label: 'Environment', value: process.env.BASE_URL || 'https://www.saucedemo.com' },
        ],
      },
      pageTitle: 'SauceDemo E2E Test Report',
      reportName: 'SauceDemo Automation Execution Report',
      displayDuration: true,
      displayReportTime: true,
    });

   
    sanitizeReportFooters(htmlReportDir);

    // Sincroniza automáticamente una copia en la carpeta versionada evidencias/
    const evidenciasHtmlDir = path.resolve(process.cwd(), 'evidencias/html');
    fs.ensureDirSync(evidenciasHtmlDir);
    fs.copySync(htmlReportDir, path.join(evidenciasHtmlDir, 'advanced'));

    Logger.info(`HTML Report successfully generated at: ${htmlReportDir}/index.html`);
  } catch (error) {
    Logger.error(`Error generating HTML Report: ${error}`);
  }
}

if (require.main === module) {
  generateHtmlReport();
}
