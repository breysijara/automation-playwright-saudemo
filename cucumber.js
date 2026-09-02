module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      'src/fixtures/**/*.ts',
      'src/steps/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'summary',
      'progress-bar',
      'json:reports/json/cucumber_report.json',
      'html:reports/html/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 2,
    retry: 0,
    backtrace: true,
    forceExit: true
  }
};
