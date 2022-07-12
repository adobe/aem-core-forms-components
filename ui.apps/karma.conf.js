/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
var getCoverageReporters = function () {
    return [
        {
            type : "lcov",
            // Force coverage subdir to be <browser_family> only, in lower case, without version
            // This way we can hardcode their location in pom.xml to enable automation of SonarQube analysis
            subdir : function (browser, platform) {
                return browser.toLowerCase().split(" ")[0];
            }
        },
        {
            type : 'cobertura',
            // Force coverage subdir to be <browser_family> only, in lower case, without version
            // This way we can hardcode their location in pom.xml to enable automation of SonarQube analysis
            subdir : function (browser, platform) {
                return browser.toLowerCase().split(" ")[0];
            },
            file : 'cobertura.xml'
        },
        {
            // done for istanbul combine to work
            type : "json",
            // Force coverage subdir to be <browser_family> only, in lower case, without version
            // This way we can hardcode their location in pom.xml to enable automation of SonarQube analysis
            subdir : function (browser, platform) {
                return browser.toLowerCase().split(" ")[0];
            }
        }
    ];
}

module.exports = function (config) {
    var karmaConfig = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath : '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks : [
            'jasmine',
            'sinon'
        ],

        // list of files / patterns to load in the browser
        files : [
            'src/main/content/jcr_root/apps/core/fd/components/form/container/v2/container/clientlibs/site/js/formcontainerview.js',
            'src/main/content/jcr_root/apps/core/fd/components/form/datepicker/v1/datepicker/clientlibs/site/js/datepickerview.js'
        ],

        // list of files to exclude
        exclude : [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors : {
            'src/main/content/jcr_root/apps/core/fd/components/form/**/*.js' : 'coverage'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters : ["progress", 'kjhtml', 'htmlDetailed', 'coverage', 'junit'],

        // web server port
        port : 9876,

        // enable / disable colors in the output (reporters and logs)
        colors : true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel : config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch : true,

        // disabling cross origin checking, since we load client libraries from AEM
        crossOriginAttribute : false,

        customLaunchers : {
            FirefoxNoExtensions : {
                base : "Firefox",
                prefs : {
                    // Fixes tabs opened on startup
                    "extensions.enabledScopes" : 0
                }
            },
            ChromeHeadless : {
                base : 'Chrome',
                flags : [
                    '--headless',
                    '--no-sandbox',
                    '--remote-debugging-port=9222'
                ]
            }
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers : ['ChromeHeadless'/*, 'Firefox', 'Opera', 'IE', 'Safari'*/],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun : false,

        clearContext : false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency : Infinity,

        coverageReporter : {
            dir : "target/coverage/",
            includeAllSources : true,
            reporters : getCoverageReporters()
        },

        htmlDetailed : {
            splitResults : true,
            dir : 'target/_report',
            autoReload : false,
            useHostedBootstrap : true
        },

        browserNoActivityTimeout : 10 * 60000,
        captureConsole : false,
        browserConsoleLogOptions : {
            terminal : false
        },
        junitReporter : {
            outputDir : 'target/junitReport', // results will be saved as $outputDir/$browserName.xml
            outputFile : 'TEST-JASMINE-CONTENT.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
            useBrowserName : true // add browser name to report and classes names
        }
    };
    config.set(karmaConfig);
}