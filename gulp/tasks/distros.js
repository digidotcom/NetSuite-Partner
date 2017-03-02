var gulp = require('gulp');
var path = require('path');
var distros = require('../distros');
var package_manager = require('../package-manager');

var distrosWatch = path.join(process.gulp_init_cwd, distros.config.get('dir'), '*.json');

gulp.task('distros', function() {
    distros.generate();
});

gulp.task('watch-distros', function() {
    gulp.watch(distrosWatch, {interval: package_manager.configuration.watcherInterval}, ['distros', 'frontend']);
});