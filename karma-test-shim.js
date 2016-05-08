//Based on https://github.com/mgechev/angular2-seed/blob/master/test-main.js
//Updated with excellent insight from https://github.com/antonybudianto/angular2-starter

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () { };

var paths = {
    'n:*': 'node_modules/*'
};

// map tells the System loader where to look for things
var map = {
    'lib': 'lib',
    'src': 'src',
    'rxjs': 'n:rxjs',
    '@angular': 'n:@angular'
};

var packages = {
    'src': { defaultExtension: 'ts', format: 'register' },
    'lib': { defaultExtension: 'js' },
    'rxjs': { defaultExtension: 'js' }
};

var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/testing',
];

// add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
packageNames.forEach(function (pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});

var config = {
    baseURL: '/base/',
    map: map,
    packages: packages,
    paths: paths
};

System.config(config);


Promise.all([
    System.import('@angular/platform-browser/src/browser/browser_adapter'),
    System.import('@angular/platform-browser-dynamic/testing'),
    System.import('@angular/core/testing'),
]).then(function (modules) {
    var browser_adapter = modules[0];
    var providers = modules[1];
    var testing = modules[2];
    testing.setBaseTestProviders(providers.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
        providers.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

    browser_adapter.BrowserDomAdapter.makeCurrent();
}).then(function () {
    return Promise.all(
        Object.keys(window.__karma__.files)
            .filter(onlySpecFiles)
            .map(file2moduleName)
            .map(importModules)
    );
})
    .then(function () {
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