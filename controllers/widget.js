var async         = require('async');
var dateUtils     = require('date-utils');
var ua            = require('useragent');
var model         = require('../lib/model');
var Countdown     = model.load('countdown');
//ua(true); //sync with remote server to make sure we have the latest and greatest

module.exports = function(app) {

	app.get('/widget/:vanityUrl', function(req, res) {
		console.log('getting :'+req.param('vanityUrl'));

		//grab the countdown data
		Countdown.findByVanityUrl(req.param('vanityUrl'),function(err,countdown) {
			if (err) {return res.redirect('/blank.html');}
			if (typeof countdown[0] === "undefined") {return res.redirect('/blank.html');}
			console.log('countdown page for: ');
			console.log(countdown[0]);
			console.log('render countdown');

			res.render('widget', {
				title: "Seconds 'til " + countdown[0].name,
				countdown:countdown[0],
			});

		});
	});

};

