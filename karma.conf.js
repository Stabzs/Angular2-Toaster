module.exports = function (config) {
    var configuration = {
        basePath: '',

        frameworks: ['jasmine'],
        
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher')
        ],

        files: [
            'node_modules/systemjs/dist/system.src.js',
            
            // Polyfills
            'node_modules/core-js/client/shim.js',

            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            

            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

            // Angular 2 itself and the testing library
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

            'karma-test-shim.js',

            { pattern: 'lib/**/*.js', included: false },
            { pattern: 'lib/**/*.js.map', included: false, watched: false },
            { pattern: 'src/**/*.ts', included: false, watched: true }
        ],

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    };

    config.set(configuration);
}