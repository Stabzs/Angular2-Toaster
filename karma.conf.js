module.exports = function (config) {
    var dependencies = require('./package.json').dependencies;
    var excludedDependencies = [
        'systemjs', 'zone.js'
    ];

    var configuration = {
        basePath: '',

        frameworks: ['jasmine'],

        files: [
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/es6-promise/dist/es6-promise.js',
            'node_modules/es6-shim/es6-shim.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/systemjs/dist/system.src.js',

            'karma-test-shim.js',

            { pattern: 'lib/**/*.js', included: false },
            { pattern: 'lib/**/*.js.map', included: false, watched: false },
            { pattern: 'src/**/*.ts', included: false, watched: false }
        ],

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    };

    Object.keys(dependencies).forEach(function (key) {
        if (excludedDependencies.indexOf(key) >= 0) { return; }

        configuration.files.push({
            pattern: 'node_modules/' + key + '/**/*.js',
            included: false,
            watched: false
        });
    });

    config.set(configuration);
}
