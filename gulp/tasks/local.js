/* jshint node: true */
/*
@module gulp.local

This gulp task will start a local development environment server. The idea is to have a agile development environment
where the user just modify the project JavaScript, Sass, Less and templates and they are automatically compiled and
even the browser is reloaded to show the changes.

##JavaScript

For compiling JavaScript internally it uses the task 'gulp javascript' so it support two main modalities

#Usage: compiilng JavaScript like in production

	gulp local

#Usage: loading JavaScript with require js

This is more agile for working because JavaScript don't need to be compiled:

	gulp local --js require

##Implementation

Files are watched using nodejs watch and when changes are detected specific gulp task are called to compiling files,
like gulp javascript, gulp sass, gulp templates etc.

*/

'use strict';

var gulp = require('gulp')
,	gutil = require('gulp-util')
,	package_manager = require('../package-manager')
,	batch_logger = require('../library/batch-logger')
,	_ = require('underscore')
,	fs = require('fs')
,	path = require('path')
,	args   = require('yargs').argv
,	express = require('express')
,	child_process = require('child_process')
,	serveIndex = require('serve-index')
,	del = require('del')
,	livereload = require('../livereload');

function initServer(cb)
{
	var http_config = package_manager.getTaskConfig('local.http', false)
	,	https_config = package_manager.getTaskConfig('local.https', false);

	// PS: added flag in distro
    var use_nginx = package_manager.getTaskConfig('local.nginx', false);

	if (!http_config && !https_config)
	{
		gutil.log('No server configuration specified in the files');
		cb();
	}

	((args.nginx || use_nginx) ? initServerNginx : initServerExpress)(http_config, https_config, cb);
}

function initServerExpress(http_config, https_config, cb)
{
	var app = express();

	// Allow CORS requests in server
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});

	app.use('/', express.static(process.gulp_dest));
	app.use('/Modules', express.static('./Modules'));
	app.use('/', serveIndex(process.gulp_dest));
	app.use('/Modules', serveIndex('./Modules'));

	// we also serve jasmine library for the unit tests
	var jasmine = package_manager.getModuleFolder('third_parties/jasmine')
	if(jasmine)
	{
		var jasmineFolder = path.join('.', 'Modules', jasmine);
		app.use('/jasmine', express.static(jasmineFolder));
		app.use('/jasmine', serveIndex(jasmineFolder));
	}

	var logger = batch_logger();

	// Starts the http server
	if (http_config)
	{
		app.listen(http_config.port, '0.0.0.0', cb);
		logger.push('+- Local http server available at: ', gutil.colors.cyan(
			'http://localhost:' + http_config.port + '/'
		));
	}

	// Starts the https server
	if (https_config)
	{
		var https = require('https')
		,	keyfile
		,	certfile;

		try
		{
			keyfile = process.env[https_config.key] || https_config.key;
			certfile = process.env[https_config.cert] || https_config.cert;

			var https_options = {
				key: fs.readFileSync(keyfile, 'utf8')
			,	cert: fs.readFileSync(certfile, 'utf8')
			};

			var server = https.createServer(https_options, app);

			server.listen(https_config.port, '0.0.0.0');
			logger.push('+- Local https server available at: ', gutil.colors.cyan(
				'https://localhost:' + https_config.port + '/'
			));
		}
		catch(ex)
		{
			logger.push(gutil.colors.red('+- Could not start secure local server. Reason: ' + ex.toString()));
		}
	}

	if(livereload.isEnabled()) {
		logger.push('+- LiveReload server running at: ', gutil.colors.cyan('ws://localhost:' + livereload.getPort() + '/livereload'));
		if (https_config) {
			logger.push('+- LiveReload secure server running at: ', gutil.colors.cyan('wss://localhost:' + livereload.getSecurePort() + '/livereload'));
		}
	}

	// cb();
	logger.push('+- Watching current folder: ', gutil.colors.cyan(path.join(process.cwd(), 'Modules')));
	logger.push('+- To cancel Gulp Watch enter: ', gutil.colors.cyan('control + c'));
	logger.flush();
}

function prepareNginxFolders(nginxBasePath) {
    var nginxDestPath = path.join(process.cwd(), package_manager.distro.folders.binaries || process.gulp_dest, 'nginx');

    // delete folder if exists
    try {
        del.sync([nginxDestPath]);
    } catch(e) {}
    // create it again
    fs.mkdirSync(nginxDestPath);
    // copy mime.types file that is not compiled
    fs.createReadStream(path.join(nginxBasePath, 'mime.types')).pipe(fs.createWriteStream(path.join(nginxDestPath, 'mime.types')));

    return nginxDestPath;
}

function initServerNginx(http_config, https_config, cb)
{
	var nginxBasePath = path.resolve(path.join('gulp', 'nginx'));
	var configTemplate = fs.readFileSync(path.join(nginxBasePath, 'configuration.tpl'), 'utf8');
	var httpTemplate  = fs.readFileSync(path.join(nginxBasePath, 'http.conf.tpl'), 'utf8');
	var httpsTemplate  = fs.readFileSync(path.join(nginxBasePath, 'https.conf.tpl'), 'utf8');

	// PS: added different destination path and create logger
    var nginxDestPath = prepareNginxFolders(nginxBasePath);
    var logger = batch_logger();

	var templateOptions = {
		http_config: !!http_config
	,	https_config: !!https_config
	,	rootDir: path.resolve('.')
	,	localDistributionPath: JSON.stringify(process.gulp_dest)
		// PS: added config ports to templates
	,	http_port: http_config && http_config.port
	,	https_port: https_config && https_config.port
	};

	var configResult = _.template(configTemplate, templateOptions);
	fs.writeFileSync(path.join(nginxDestPath, 'configuration'), configResult, 'utf8'); // PS: change destination folder

	if(http_config)
	{
		var httpResult = _.template(httpTemplate, templateOptions);
		fs.writeFileSync(path.join(nginxDestPath, 'http.conf'), httpResult, 'utf8'); // PS: change destination folder

        // PS: add http message to logger
        logger.push('+- Local http server available at: ', gutil.colors.cyan(
            'http://localhost:' + http_config.port + '/'
        ));
	}

	if(https_config)
	{
		templateOptions.keyfile = JSON.stringify(process.env[https_config.key] || path.join(process.cwd(), https_config.key)); // PS: make path to file absolute
		templateOptions.certFile = JSON.stringify(process.env[https_config.cert] || path.join(process.cwd(), https_config.cert)); // PS: make path to file absolute
		var httpsResult = _.template(httpsTemplate, templateOptions);
		fs.writeFileSync(path.join(nginxDestPath, 'https.conf'), httpsResult, 'utf8'); // PS: change destination folder

        // PS: add https message to logger
        logger.push('+- Local https server available at: ', gutil.colors.cyan(
            'https://localhost:' + https_config.port + '/'
        ));
	}

	var nginxArguments = [
		'-c', 'configuration'
	,	'-p', nginxDestPath // PS: change destination folder
	];

	try
	{
		fs.mkdirSync(path.join(nginxDestPath, 'temp')); // PS: change destination folder
	}
	catch(err)
	{
	}

	try
	{
		fs.mkdirSync(path.join(nginxDestPath, 'logs')); // PS: change destination folder
	}
	catch(err)
	{
	}

    // PS: add output messages for live reload and watcher
    if(livereload.isEnabled()) {
        logger.push('+- LiveReload server running at: ', gutil.colors.cyan('ws://localhost:' + livereload.getPort() + '/livereload'));
        if (https_config) {
            logger.push('+- LiveReload secure server running at: ', gutil.colors.cyan('wss://localhost:' + livereload.getSecurePort() + '/livereload'));
        }
    }
    logger.push('+- Watching current folder: ', gutil.colors.cyan(path.join(process.cwd(), 'Modules')));
    logger.push('+- To cancel Gulp Watch enter: ', gutil.colors.cyan('control + c'));

	var nginx_process = child_process.spawn('nginx', nginxArguments, { stdio: [0,1,2] });
	cb = _.once(cb);
	nginx_process.on('error', cb);
	setTimeout(function(){ cb(null, nginx_process); logger.flush(); }, 2000); // PS: added printing the logger to the callback
}

module.exports = {
	initServerNginx: initServerNginx,
	initServerExpress: initServerExpress,
	initServer: initServer
};

gulp.task('local-install', function()
{
	// just define a flag so other tasks know if they must exit on error or not. i.e. when 'gulp local' we don't want to kill the local server on sass, handlebars, javascript errors.
	package_manager.isGulpLocal = true;
});

gulp.task('local', ['local-install', 'frontend', 'watch', 'javascript-entrypoints', 'hosting-root-files'], initServer);

// TODO remove in the future
gulp.task('local-nginx', [], function(cb)
{
	cb('Use gulp local --nginx');
});
