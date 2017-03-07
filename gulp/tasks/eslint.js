/* jshint node: true */

'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var args   = require('yargs').argv;
var gIf = require('gulp-if');

var moduleToLint = args.lintfiles || 'Modules/**/*.js';

gulp.task('eslint', function() {
    return gulp.src([moduleToLint])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gIf(!args.nolint, eslint.failAfterError()));
});
