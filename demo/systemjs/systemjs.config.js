(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app':                          'app', // 'dist',
    'rxjs':                         'node_modules/rxjs',
    '@angular':                     'node_modules/@angular',
    'angular2-toaster':             'node_modules/angular2-toaster',
    //'reflect-metadata':             'node_modules/reflect-metadata',
    //'zone':                         'node_modules/zone.js',
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'build':                        { main: 'app.js',  defaultExtension: 'js' },
    'rxjs':                         { defaultExtension: 'js' },
    'angular2-toaster':             { defaultExtension: 'js' }
  };

  var packageNames = [
    '@angular/compiler',
    '@angular/common',
    '@angular/core',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic'
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    map: map,
    packages: packages
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);

})(this);