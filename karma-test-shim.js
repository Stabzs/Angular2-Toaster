//Based on https://github.com/mgechev/angular2-seed/blob/master/test-main.js
//Updated with excellent insight from https://github.com/antonybudianto/angular2-starter

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () { };

var paths = {
    'n:': 'node_modules/'
};

// map tells the System loader where to look for things
var map = {
    'lib': 'lib',
    'src': 'src',
    'rxjs': 'n:rxjs',
    '@angular': 'n:@angular',

    'traceur': 'n:traceur/dist/traceur.js',

    '@angular/core': 'n:@angular/core/bundles/core.umd.js',
    '@angular/common': 'n:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'n:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'n:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'n:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',

    '@angular/core/testing': 'n:@angular/core/bundles/core-testing.umd.js',
    '@angular/common/testing': 'n:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'n:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'n:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'n:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js'
};

var packages = {
    'src': { defaultExtension: 'ts', format: 'register' },
    'lib': { defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' }
};

var config = {
    baseURL: '/base/',
    map: map,
    packages: packages,
    paths: paths
};

System.config(config);


Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
]).then(function (providers) {
    var coreTesting = providers[0];
    var browserTesting = providers[1];
    coreTesting.TestBed.initTestEnvironment(
            browserTesting.BrowserDynamicTestingModule,
            browserTesting.platformBrowserDynamicTesting());
}).then(function () {
    return Promise.all(
        Object.keys(window.__karma__.files)
            .filter(onlySpecFiles)
            .map(file2moduleName)
            .map(importModules)
    );
}).then(function () {
        __karma__.start();
    }, function (error) {
        console.error(error.stack || error);
        __karma__.start();
    });

function onlySpecFiles(path) {
    return /[\.|-]spec\.js$/.test(path);
}

// Normalize paths to module names.
function file2moduleName(filePath) {
    return filePath.replace(/\\/g, '/')
        .replace(/^\/base\//, '')
        .replace(/\.js/, '');
}

function importModules(path) {
    return System.import(path);
}