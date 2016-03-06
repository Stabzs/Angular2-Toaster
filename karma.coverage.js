module.exports = function(config) {
	require("./karma.conf")(config);

	config.autoWatch = false;

	config.preprocessors = {
		'lib/**/!(*spec).js': ['coverage']
	};
	
	config.coverageReporter = {
      dir: 'coverage/',
	  reporters: [
		  { type: 'html', subdir: 'generated-js-report' },
          { type: 'json', subdir: 'ts-json-report', file: 'coverage-final.json' }
	  ]
    };

	config.singleRun = true;

	config.reporters.push('coverage');
	config.plugins.push('karma-coverage');

	config.customLaunchers = {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    };
	
	if (process.env.TRAVIS) {
    	config.browsers = ['Chrome_travis_ci'];
	}

	config.set(config);
};