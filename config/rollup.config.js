export default {
    entry: './dist/angular2-toaster.js',
    output: {
        file: 'dist/bundles/angular2-toaster.umd.js',
        format: 'umd'
    },
    moduleName: 'angular2toaster',
    external: [
        '@angular/core',
        '@angular/common',
        'rxjs/Observable',
        'rxjs/Observer',
        'rxjs/operators/share',
        'rxjs/Subject',       
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx',
        'rxjs/operators/share': 'Rx',
        'rxjs/Subject': 'Rx'
    },
    onwarn: (e) => { return }
}
