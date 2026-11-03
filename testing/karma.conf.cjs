const path = require('node:path');

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    reporters: process.env.SHOWROOM_LEGACY_TESTS ? ['progress'] : ['progress', 'coverage'],
    coverageReporter: {
      dir: path.join(__dirname, 'reports/coverage'),
      subdir: process.env.SHOWROOM_TEST_SCOPE || '.',
      reporters: [{ type: 'html' }, { type: 'lcovonly' }, { type: 'text-summary' }],
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: false,
  });
};
