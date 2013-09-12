var async         = require('async');
var dateUtils     = require('date-utils');
var ua            = require('useragent');
var model         = require('../lib/model');
var Countdown     = model.load('countdown');
var utils         = require('../lib/utils');

//ua(true); //sync with remote server to make sure we have the latest and greatest

module.exports = function(app) {

	app.get('/calendar/:year',function(req,res) {

		Countdown.countByMonth(req.param('year'),function(err,results) {
			console.log(results);

			res.render('year', {
				title: "Countdown events in " + req.param('year'),
				year:req.param('year'),
				monthNames: utils.monthNames(),
				counts:results
			});

		});
	});

	app.get('/calendar/:year/:month',function(req,res) {

		Countdown.countByDay({
				year:req.param('year'),
				month:req.param('month')
			},function(err,results) {
				console.log(results);

				res.render('month', {
					title: "Countdown events in " + req.param('month') + ', '+ req.param('year'),
					year:req.param('year'),
					month:req.param('month'),
					counts:results
				});
			});
	});


	app.get('/calendar/:year/:month/:day', function(req, res) {

		Countdown.find({year:req.param('year'),month:req.param('month'),day:req.param('day')},{},function(err,countdowns) {
			console.log(countdowns);
			res.render('day', {
				title: "Countdown events in " + req.param('month') + ', '+ req.param('year'),
				year:req.param('year'),
				month:req.param('month'),
				day:req.param('day'),
				countdowns:countdowns
			});
		});
	});

};

