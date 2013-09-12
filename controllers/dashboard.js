var async         = require('async');
var dateUtils     = require('date-utils');

module.exports = function(app) {

	app.get('/dashboard', function(req, res) {
		console.log('getting dashboard');

		if (!req.session.loggedIn) {
			res.redirect('/');
		}

		res.render('layout', {
			title: 'The World\'s Easiest Countdown Service.',
		});
	});

};
