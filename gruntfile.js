var config = require("./grunt.config")();

module.exports = function(grunt) {
    "use strict";

    // Load grunt tasks automatically
    require("load-grunt-tasks")(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Analyzing source with JSHint
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            all: config.alljs
        },
        // Analyzing source with JSCS
        jscs: {
            options: {
                config: ".jscsrc",
                reporter: require("jscs-stylish").path
            },
            all: config.alljs
        },
        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        config.temp,
                        ".sass-cache",
                        config.build
                    ]
                }]
            },
            tmp: {
                files: [{
                    dot: true,
                    src: [
                        config.temp,
                        ".sass-cache"
                    ]
                }]
            }
        },
        // Inject Bower packages into your source code with Grunt.
        wiredep: {
            all: {
                options: config.getWiredepDefaultOptions(),
                src: config.index
            }
        },

        injector: {
            options: config.getInjectorOptions(),
            all: {
                files: config.getInjectorFiles()
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: config.index,
            options: {
                dest: config.build
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: config.app + "images",
                    src: "**/*.{png,jpg,jpeg,gif}",
                    dest: config.build + "images"
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: config.app + "images",
                    src: "**/*.svg",
                    dest: config.build + "images"
                }]
            }
        },
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            dist: [
                "imagemin",
                "svgmin"
            ],
            server: [
                "compass:server",
                "copy:styles",
            ]
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: config.temp + "concat/scripts",
                    src: "*.js",
                    dest: config.temp + "/concat/scripts"
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: config.app,
                    dest: config.build,
                    src: [
                        "*.{ico,png,txt}",
                        ".htaccess",
                        "*.html",
                        "images/{,*/}*.{webp}",
                        "fonts/*",
                        "config.xml"
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: config.app + "styles",
                dest: config.tmp + "styles/",
                src: "{,*/}*.css"
            }
        },
        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        config.build + "scripts/{,*/}*.js",
                        config.build + "styles/{,*/}*.css",
                        config.build + "styles/fonts/*"
                    ]
                }
            }
        },
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: [config.build + "{,*/}*.html"],
            css: [config.build + "styles/{,*/}*.css"],
            options: {
                assetsDirs: [config.build]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: config.build,
                    src: ["*.html"],
                    dest: config.build
                }]
            }
        },
        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: config.app + "styles",
                cssDir: ".tmp/styles",
                generatedImagesDir: config.tmp + "images/generated",
                imagesDir: config.app + "images",
                javascriptsDir: config.app,
                fontsDir: config.app + "styles/fonts",
                importPath: "bower_components",
                httpImagesPath: "images",
                httpGeneratedImagesPath: "images/generated",
                httpFontsPath: "styles/fonts",
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: config.build + "images/generated"
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ["last 1 version"]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: config.tmp + "styles/",
                    src: "{,*/}*.css",
                    dest: config.tmp + "styles/"
                }]
            }
        },
        watch: {
            js: {
                files: config.alljs,
                tasks: ["jshint", "jscs"],
                options: {
                    livereload: true
                }
            },
            compass: {
                files: [config.app + "styles/{,*/}*.{scss,sass}"],
                tasks: ["compass:server", "autoprefixer"]
            },
            gruntfile: {
                files: ["gruntfile.js"]
            },
            livereload: {
                options: {
                    livereload: "<%= connect.options.livereload %>"
                },
                files: []
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: "localhost"
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        config.app
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        config.tmp,
                        config.app,
                        "."
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: config.build,
                    livereload: false
                }
            }
        }
    });

    grunt.registerTask("karma", function() {
        var done = this.async();

        var child;
        var excludeFiles = [];
        var karma = require("karma").server;

        karma.start({
            configFile: __dirname + "/karma.conf.js",
            exclude: excludeFiles,
            singleRun: true
        }, karmaCompleted);

        function karmaCompleted(karmaResult, rrrr) {
            console.log(rrrr);
            console.log("Karma completed!");
            if (child) {
                console.log("Sutting down the child process");
                child.kill();
            }

            if (karmaResult === 1) {
                grunt.fail.warn("karma: tests failed with code " + karmaResult);
            } else {
                done();
            }
        }
    });

    grunt.registerTask("test", ["jshint", "jscs", "karma"]);

    // Wire up the bower css and js and our js into the html
    grunt.registerTask("inject", ["wiredep", "injector"]); // TODO: add templatecache task

    // Optimizing the javascript, css, html
    grunt.registerTask("optimize", [
        "clean:dist",
        "inject",
        "test",
        "useminPrepare",
        "concurrent:dist",
        "autoprefixer",
        "compass:dist",
        "copy:styles",
        "concat",
        "ngmin",
        "cssmin",
        "uglify",
        "copy:dist",
        "rev",
        "usemin",
        "htmlmin"
    ]);

    grunt.registerTask("build", ["optimize", "clean:tmp"]);

    grunt.registerTask("serve", function() {
        grunt.task.run([
            "clean:tmp",
            "inject",
            "concurrent:server",
            "connect:livereload",
            "watch"
        ]);
    });

    grunt.registerTask("serve:build", ["build"], function() {
        serve(false);
    });

    grunt.registerTask("serve:test", ["build-specs"], function(done) {
        grunt.run.tasks(["inject"]);
        console.log("Run the spec runner");
        serve(true, true);
        done();
    });

    function serve(data) {
        console.log(data);
    }
};
