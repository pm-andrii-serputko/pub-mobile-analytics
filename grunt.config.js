module.exports = function() {
    "use strict";

    var app = "./app/";
    var report = "./report/";
    var temp = ".tmp/";
    var wiredep = require("wiredep");
    var bowerFiles = wiredep({devDependencies: true}).js;

    var config = {
        /**
         * Files paths
         */
        alljs: [
            app + "**/*.js",
            "./*.js"
        ],
        build: "./www/",
        index: app + "index.html",
        js: [
            app + "**/*.module.js",
            app + "**/*.js",
            "!" + app + "**/*.test.js",
            "!.tmp/**/*js"
        ],
        css: app + "styles/**/*.css",
        app: app,
        temp: temp,

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require("./bower.json"),
            directory: app + "bower_components"
        },

        /**
         * karma and testing settings
         */
        specHelpers: [],
        serverIntegrationSpecs: []
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.director
        };

        return options;
    };

    config.getInjectorOptions = function() {
        var options = {
            relative: true
        };
        return options;
    };

    config.getInjectorFiles = function() {
        var files = {};
        files[config.index] = [config.js, config.css];
        return files;
    };

    config.karma = getKarmaOptions();

    return config;

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                // config.specHelpers,
                app + "**/*.module.js",
                app + "**/*.js",
                // temp + config.templateCache.file,
                config.serverIntegrationSpecs,
                app + "app.module.test.js"
            ),
            exclude: [],
            coverage: {
                dir: report + "coverage",
                reporters: [
                    {type: "html", subdir: "report-html"},
                    {type: "text-summary"}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[app + "**/!(*.test)+(*.js)"] = ["coverage"];
        return options;
    }
};
