var async         = require('async');
var dateUtils     = require('date-utils');
var ua            = require('useragent');
var model         = require('../lib/model');
var Countdown     = model.load('countdown');
//ua(true); //sync with remote server to make sure we have the latest and greatest

module.exports = function(app) {

	app.get('/', function(req, res) {
		console.log('getting index');

		var minYear = new Date(Date.today()).format("yyyy");

		Countdown.findOne().sort('-year').exec(function(err, doc) {
    	var maxYear = minYear;
    	if (doc) {
    		maxYear = doc.year;
    	}

    	res.render('layout', {
    		title: 'The World\'s Easiest Countdown Service.',
    		directory: {minYear:minYear,maxYear:maxYear}
    	});

    });

	});

	app.get('/about', function(req, res) {
		res.render('layout', {title: 'Countdown Service - About Us'});
	});

	app.get('/faq', function(req, res) {
		res.render('layout', {title: 'secondstill.com - FAQ'});
	});

	app.get('/developers', function(req, res) {
		res.render('layout', {title: 'secondstill.com - Developers'});
	});

	app.get('/terms-policies', function(req, res) {
		res.render('terms-policies.jade', {
			title: 'secondstill.com - Terms & Policies.'
		});

	});

	app.get('/test-widget', function(req,res) {
		res.render('test-widget',{
			title: 'test widget'
		})
	});

};

