console.log('started in ' + process.env.NODE_ENV + ' mode...');

var express = require('express'),
	date = require('./public/lib/date.format'),
	redis = require('connect-redis')(express),
	everyauth = require('everyauth'),
	rpc = require('./lib/jsonrpc'),
	fs = require('fs');

//init the log file
var access_logfile = fs.createWriteStream('./logs/access.log', {
	flags: 'a'
});
//init the app
app = module.exports = express();
app.locals = require('./locals');

var port = 8100;
app.set('secure', false);

if (process.env.NODE_ENV == 'secure') {
	port = 8110;
	app.set('secure', true);
}

//init the openauth thing
var secondstillEveryauth = require('./lib/everyauth.js');
secondstillEveryauth.init(everyauth);
app.set('fbAppId', secondstillEveryauth.conf.fb.appId);
app.set('fbAppSecret', secondstillEveryauth.conf.fb.appSecret);

app.use(require('./helpers'));

//redirect to https if not development
app.use(function(req, res, next) {
	if (process.env.NODE_ENV !== "development") {
		var schema = req.headers["x-forwarded-for"];
	  // --- Do nothing if schema is already https
	  if (schema === "https") return next();

	  // --- Redirect to https
	  var host = 'secondstill.com'; //use req.headers.host eventually
	  res.redirect("https://" + host + req.url);
	} else {
		next();
	}
});

app.use(express.logger({
	stream: access_logfile
}));
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.session({
	key: 'secondstill.sid',
	secret: '@$!#SCDFdsa',
	store: new redis
}));
app.use(require('./lib/auth'));
app.use(everyauth.middleware());
app.use(rpc.server(rpc.rpcDispatchHooks));
app.set('views', __dirname + '/views');
app.set('controllers', __dirname + '/controllers');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('./lib/secure'));
app.use(require('./lib/ipinfodb'));
app.use(app.router);

app.use(express.errorHandler({
	dumpExceptions: true,
	showStack: true
}));

// Controllers
require('./controllers/index')(app);
require('./controllers/widget')(app);
require('./controllers/directory')(app);
require('./controllers/dashboard')(app);
require('./controllers/countdown')(app);

//this is last so individual controllers can override
require('./controllers/partials')(app);

console.log('listening on port: ' + port);
if (!module.parent) app.listen(port);
