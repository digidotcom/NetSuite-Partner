/*
this test will verify the development tools in the current workspace

#Usage

	node gulp/specs
*/

var _ = require('underscore')
,	shell = require('shelljs')
,	path = require('path')
,	fs = require('fs')
,	glob = require('glob').sync
,	Jasmine = require('jasmine')
// ,	CustomReporter = require('./ns-jasmine-reporter.js');


var jasmineRunner = new Jasmine();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999999;

// var customReporter = new CustomReporter();
// jasmine.addReporter(customReporter);

jasmineRunner.specFiles = glob(path.join(__dirname, '*-spec.js'));
jasmineRunner.execute();

