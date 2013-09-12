var async         = require('async');
var dateUtils     = require('date-utils');
var ua            = require('useragent');
var model         = require('../lib/model');
var Countdown     = model.load('countdown');
//ua(true); //sync with remote server to make sure we have the latest and greatest

module.exports = function(app) {

	app.get('/:vanityUrl', function(req, res) {
		console.log('getting :'+req.param('vanityUrl'));

		//grab the countdown data
		Countdown.findByVanityUrl(req.param('vanityUrl'),function(err,countdown) {
			if (err) { return res.redirect('/');}
			if (typeof countdown[0] === "undefined") {return res.redirect('/');	}

			//rpc countdown.create saves the url in the session
			//if they are viewing a page they made for the first time,
			//prompt them for their email address
			var showModal = false;
			if (typeof req.session.countdowns !== "undefined") {
				req.session.countdowns.forEach(function(val, idx, array) {
					if (val == countdown[0].vanityUrl) {
						showModal = true;
					}
				});
			}

			if (req.session.loggedIn) {
				showModal = false;
			}
			console.log('showModal:'+showModal);
			res.render('countdown', {
				title: "Seconds 'til " + countdown[0].name,
				countdown:countdown[0],
				showModal: showModal
			});

		});
	});

};

