// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    client: {
      jasmine: {
       
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/multi-lab'),
      subdir: '.',
      reporters: [
        { type: 'html' },
         { type: 'lcovonly', file: 'lcov.info' },
        { type: 'text-summary' }
      ],
        fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml','coverage'],
    browsers: ['Chrome'],
    singleRun: false,   
    autoWatch: true,
    restartOnFileChange: true
  });
};



