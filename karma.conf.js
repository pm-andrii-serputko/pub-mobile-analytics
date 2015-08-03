module.exports = function(config) {
    "use strict";

    var gruntConfig = require("./grunt.config")();

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "./",

        // frameworks to use
        // some available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha", "chai", "sinon-chai"],

        // list of files / patterns to load in the browser
        files: gruntConfig.karma.files,

        // list of files to exclude
        exclude: gruntConfig.karma.exclude,

        proxies: {
            "/": "http://localhost:8888/"
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: gruntConfig.karma.preprocessors,

        // test results reporter to use
        // possible values: "dots", "progress", "coverage"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["spec", "coverage"],

        coverageReporter: {
            dir: gruntConfig.karma.coverage.dir,
            reporters: gruntConfig.karma.coverage.reporters
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
        // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DISABLE,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //        browsers: ["Chrome", "ChromeCanary", "FirefoxAurora", "Safari", "PhantomJS"],
        browsers: ["PhantomJS"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
