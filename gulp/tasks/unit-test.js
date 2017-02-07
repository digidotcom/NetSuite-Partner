/*
Example command: 
	
	#execute some modules
	time gulp unit-test --modules=Address,AjaxRequestsKiller,ApplicationSkeleton,Backbone.CollectionView,Backbone.CompositeView,Backbone.FormView,BackboneExtras,BrontoIntegration,Cart,Case,CMSadapter,Content,CreditCard,CreditMemo,Main,Deposit,DepositApplication,Facets,Utilities,Wizard,UrlHelper,TrackingServices,SocialSharing,PromocodeSupport,ProductReviews,ProductList,PrintStatement,PluginContainer,PaymentWizard,OrderWizard,HandlebarsExtras,ImageLoader,GoogleAdWords,GoogleUniversalAnalytics,GoogleTagManager,ErrorManagement,Invoice,ItemRelations,ListHeader,Merchandising,MyAccountApplication,NavigationHelper

	#execute all : 
	gulp unit-test

	# DEBUG your tests in your browser erver opened so you can debug the page in your browser at http://localhost:7777/test1.html
	gulp unit-test --dont-exit

	# only run some modules
	gulp unit-test --modules=Address,AjaxRequestsKiller,ApplicationSkeleton,Backbone.CollectionView,Backbone.CompositeView,Backbone.FormView,BackboneExtras,BrontoIntegration,Cart,Case,CMSadapter,Content,CreditCard,CreditMemo,Main,Deposit,DepositApplication

For running unit tests we will run selenium based tests just as we run automation. For this the selenium server must be running. 

Installing and running th selenium server:

# install java

# download selenium server: 

curl -O http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.0.jar

# download googlechrome selenium drivers: 

curl -O http://chromedriver.storage.googleapis.com/2.22/chromedriver_mac32.zip
unzip chromedriver_mac32.zip

# Execute selenium server: 

java -Dwebdriver.chrome.driver=./chromedriver -jar selenium-server-standalone-2.53.0.jar

*/
'use strict';

var gulp = require('gulp')
,	_ = require('underscore');


gulp.task('utest', ['local-install', 'javascript'], function(cb)
{
	var package_manager = require('../package-manager')
	,	shell = require('shelljs')
	,	args   = require('yargs').argv
	,	path = require('path');

	setTimeout(function(){ //TODO: dependencies !! - issue in gulp javascript task ?

		var applicationName = 'shopping' //TODO: take from distro.json
		var starterPath = 'javascript/unittest-local-starter.js'

		var modules, msg = '';

		if(args.modules)
		{
			modules = []
			_.each(args.modules.split(','), function(module)
			{
				modules = _.union(modules, package_manager.getGlobsForModule(module, 'unit-test-entry-point'))
			});
			msg = 'Rendering Unit test of modules ' + args.modules.split(',').join(', ')
		}
		else
		{
			var modules = package_manager.getGlobsFor('unit-test-entry-point')	
			msg = 'Rendering Unit test of all modules'
		}

		modules = _.map(modules, function(glob)
		{
			return path.basename(glob, '.js');
		});

		modules.sort();

		var s = shell.cat('LocalDistribution/javascript/'+applicationName+'.js')
		var replacement = '\n'+
			executeSpecs.toString()+';\n'+
			'executeSpecs('+JSON.stringify(modules)+');\n'+
			''
			// 'require('+JSON.stringify(modules)+', function()\n{\n\tjasmine.getEnv().execute();\n});'+

		s = s.replace(/require\(\["SC\.Shopping\.Starter"\]\)/g, replacement)
		s.to('LocalDistribution/'+starterPath)

		var html = 
			'<html><head><title>SC unit test</title><head>'+			
				'<link rel="shortcut icon" type="image/png" href="/jasmine/lib/jasmine-2.1.3/jasmine_favicon.png">'+
				'<link rel="stylesheet" href="/jasmine/lib/jasmine-2.1.3/jasmine.css">'+
				'<script src="/jasmine/lib/jasmine-2.1.3/jasmine.js"></script>'+
				'<script src="/jasmine/lib/jasmine-2.1.3/jasmine-html.js"></script>'+
				'<script src="/jasmine/lib/jasmine-2.1.3/boot.js"></script>'+
				'<script>window.SC={}</script>'+
			'</head>'+

			'<body>'+
				'<script>\n'+addJasmineReporter.toString()+';\naddJasmineReporter();\n</script>'+
				'<script data-main="'+starterPath+'" src="javascript/require.js"></script>'+
			'</body></html>'+
			'';

		html.to('LocalDistribution/test1.html');
		cb();

	}, 10);
});




//@function executeSpecs executed in the browser!
function executeSpecs(modules) 
{
	var params = window.location.href.indexOf('?')===-1 ? '' : window.location.href.split('?')[1]
	params = params.split('&')
	var p = {}
	for (var i = 0; i < params.length; i++) 
	{
		var o = params[i].split('=')
		p[o[0]] = o[1]
	}
	if(!p.modules && modules)
	{
	}
	else if(p.modules)
	{
		modules = p.modules.split(',');
	}

	//add a message
	var msgEl = document.createElement('p')
	var msg = 'Specs: ' + (modules ? modules.join(', ') : 'NONE !');
	msgEl.innerHTML = msg;
	document.body.insertBefore(msgEl, document.body.firstChild);
	try
	{	//because jasmine.getEnv().execute() was already executed with empty specs - we will execute again.
		document.querySelector('.duration').remove();
		document.querySelector('.alert .bar').remove();
		document.querySelector('.alert .exceptions').remove();		
	}
	catch(ex){}

	require(modules, function()
	{
		jasmine.getEnv().execute();
	});
}


//@function addJasmineReporter runs in the browser!
function addJasmineReporter()
{
	window.jasmineDone=false;
	var myReporter = {
		jasmineDoneCount: 0
	,	jasmineDone: function() 
		{
			this.jasmineDoneCount++;
			if(this.jasmineDoneCount === 2) // it is '2' because the way we installed the specs - we have one empty and ours secondly
			{
				window.jasmineDone = true; 
			}
		}
  	}
	jasmine.getEnv().addReporter(myReporter);	
}




gulp.task('unit-test', ['utest'], function(cb)
{

	var shell = require('shelljs')
	,	initServer = require('./local').initServer
	,	args   = require('yargs').argv;
	initServer(function()
	{
		var child = shell.exec('node gulp/unit-test/unit-test-run.js', function(code, stdout)
		{
			if(code !== 0)
			{
				console.log('Error in gulp/unit-test/unit-test-run.js: \n')
			}
			console.log(stdout)
			cb();
			if (!args.dontExit)
			{
				process.exit(code);
			}
		});
	})
});

// //just internal tool testing : 
// gulp.task('unit-test-determinism', [], function(cb)
// {
// 	var shell = require('shelljs')
// 	,	args   = require('yargs').argv;

// 	var repeat = args.repeat || 15;
// 	for (var i = 0; i < repeat; i++) 
// 	{
// 		var code = shell.exec('gulp unit-test').code;
// 		if(code !== 0)
// 		{
// 			console.log('UNIT TEST DETERMINISM FAILS')
// 		}
// 	}	
// 	console.log('UNIT TEST DETERMINISM SUCCEEDED');
// });