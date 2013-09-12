module.exports = function(req, res, next) {
	res.locals.req = req;
	res.locals.res = res;

	res.locals.errors = [];

	//navigation
	res.locals.tabs = function(req, res) {
		var tabs = [];

		if (req.session.loggedIn) {
			tabs.push({
				name: 'dashboard',
				label: 'Dashboard',
				url: '/dashboard'
			});
			tabs.push({
				name: 'logout',
				label: 'Log Out',
				url: '/logout'
			});
		} else {
			tabs.push({
				name: 'index',
				label: 'Home',
				url: '/'
			});
			tabs.push({
				name: 'signup',
				label: 'Sign Up',
				url: '#signupModal',
				modal: 'modal'
			});
			tabs.push({
				name: 'login',
				label: 'Log In To Your Dashboard',
				url: '#loginModal',
				modal: 'modal'
			});
		}
		console.log('logging tabs');
		console.log(tabs)
		return tabs;
	};

	res.locals.params = function(req, res) {
		return req.params;
	};

	next();
};
