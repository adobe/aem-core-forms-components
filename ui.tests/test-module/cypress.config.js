const { defineConfig } = require('cypress');
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

module.exports = defineConfig({
  fixturesFolder: 'libs/fixtures',
  screenshotsFolder: 'target/screenshots',
  videosFolder: 'target/videos',
  videoUploadOnPasses: false,
  video: true,
  chromeWebSecurity: true,
  viewportHeight: 900,
  viewportWidth: 1440,
  pageLoadTimeout: 200000,
  defaultCommandTimeout: 10000,
  responseTimeout: 120000,
  watchForFileChanges: true,
  trashAssetsBeforeRuns: true,
  reporterEnabled: 'spec, cypress-circleci-reporter',
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--start-fullscreen')

          return launchOptions
        }
        if (browser.name === 'electron') {
          launchOptions.preferences.fullscreen = true
          return launchOptions
        }
      })
      initPlugin(on, config);
      config.env.specPattern = 'specs/**/*.cy.{js,jsx,ts,tsx}';
      return require('./libs/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:4502',
    specPattern: 'specs/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'libs/support/index.js',
  },
});