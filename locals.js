var model = require('./lib/model'),
	Customer = model.load('customer');

module.exports = {
	req: function(req, res) {
		console.log(req)
		return req;
	},
	res: function(req, res) {
		return res;
	},
	session: function(req, res) {
		return req.session
	},

	/* STATIC */
	getAppSettings: function() {
		return app.settings;
	},
	environment: function() {
		return process.env.NODE_ENV;
	},
	fbCredentials: function() {
		var credentials = {};
		credentials.appId = app.settings.fbAppId;
		credentials.appSecret = app.settings.fbAppSecret;
		credentials.host = app.settings.host;
		//console.log(credentials);
		return credentials;
	},
};
