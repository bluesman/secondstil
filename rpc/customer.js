var async = require('async');
var utils = require('../lib/utils');
var mailer = require('../lib/sendgrid');

var model = require('../lib/model');
var Customer = model.load('customer');
var Countdown = model.load('countdown');

exports.customer = {
	logout: function(args,req,res) {
		var me = this;
		req.session.loggedIn = false;
		return me(null,{success:true,error:false});
	},

	login: function(args,req,res) {
		var me = this;
		console.log(args);
		if((typeof args.email === "undefined") || (args.email == "")) {
			return me(null, {
				success: false,
				error: {
					code: 511,
					message: "email or password is invalid."
				}
			});
		}

		if((typeof args.password === "undefined") || (args.password == "")) {
			return me(null, {
				success: false,
				error: {
					code: 511,
					message: "email or password is invalid."
				}
			});
		}

		//validate the password
  	//if the customer already exists, don't create it
  	Customer.findByEmail(args.email,function(err,result) {
  		if(err) { return me(err);	}
  		if (typeof result[0] === "undefined") {

  			return me(null, {
  				success: false,
  				error: {
  					code: 511,
  					message: "email or password is invalid."
  				}
  			});

  		} else {
  			var p = result[0].password;
  			var p2 = utils.digest(args.password);
  			console.log('checking password');
  			console.log(p);
  			console.log(p2);
  			if (p === p2) {

  				req.session.loggedIn = true;
  				req.session.email    = args.email;

  				return me(null,{success:true,error:false})

  			} else {
  				return me(null, {
  					success: false,
  					error: {
  						code: 511,
  						message: "email or password is invalid."
  					}
 					});
  			}
  		}
  	});


	},

	create: function(args, req, res) {
		var me = this;
		console.log(args);
		//validate the document and write it to mongo
		/* possible args:
		  - targetDate - parsable date string
		  - format - default 'Days'
		  - eventName
		  - vanityUrl - unique
		*/

		//make sure we have an email
		if((typeof args.email === "undefined") || (args.email == "")) {
			return me(null, {
				success: false,
				error: {
					code: 501,
					message: "email is invalid."
				}
			});
		}

		console.log(args.email);

    var handleCustomer = function(email,password) {

    	req.session.email    = args.email;

    	var urls = [];

    	var updateOwner = function(url, callback) {
    		Countdown.findByVanityUrl(url, function(err, countdown) {
    			if(err) {	return callback(err);	}
    			console.log('countdown: ');
    			console.log(countdown);

    			if(typeof countdown[0] !== "undefined") {
    				countdown[0].owner = email;
    				countdown[0].markModified('owner');
    				countdown[0].save(function(err) {
    					if(err) {
    						return callback(err);
    					}
    					urls.push(countdown[0].url());
    					callback();
    				});
    			} else {
    				callback();
    			}
    		});
    	};

    	var sendEmail = function(err) {
    		if(err) {	return me(err);	}

    		var mail = {
    			from: '"Seconds \'Til Support" <help@secondstill.com>',
    			to: email,
    			headers: {
    				'X-SMTPAPI': {
    					category: "signup",
    				}
    			},
    		};

    		mail.subject = "Welcome to secondstill.com";

    		var txt = "Hey - Thanks for signing up for Seconds 'Till! We are the world's easiest event countdown service.\r\n\r\n";

    		if (urls[0]) {
    			txt += "Here are you countdown urls:\r\n\r\n";
    			urls.forEach(function(url) {
    				txt += url +"\r\n";
    			});
    		}

	      if (password) {
	      	txt += "\r\n\r\nWe have given you a temporary password to use when you log in: " + password;
	      }

	      txt += "\r\n\r\nWe're looking forward to making lots of awesome for you. /r/nClick here to sign in: http://secondstil.com/";
	      txt += "\r\n\r\nHave a good one!\r\n\r\n-t";

	      mail.text = txt;

	      mailer.sendMail(mail, function(error, success) {
	      	console.log("Message " + (success ? "sent" : "failed:" + error));
	      });

	      return me(null, {
	      	success: true,
	      	error: false
	      });
	    };

			//add email to the countdowns in the session
			if (typeof req.session.countdowns !== "undefined") {
				async.forEach(req.session.countdowns, updateOwner, sendEmail);
			} else {
				sendEmail();
			}
		};

		var createCustomer = function() {
			var data = {email: args.email};

		  //make a temporary password
		  var password  = utils.mkPassword();
		  data.password = utils.digest(password);
		  data.visitorId = req.session.visitorId;

		  var c = new Customer(data);

		  c.save(function(err, result) {
		  	if(err) { return me(err);	}
				console.log('result from save:');
				console.log(result);
				handleCustomer(result.email,password);
			});
	  };

  	//if the customer already exists, don't create it
  	Customer.findByEmail(args.email,function(err,result) {
  		if(err) { return me(err);	}
  		if (typeof result[0] === "undefined") {
  			return createCustomer();
  		} else {
  			return handleCustomer(result[0].email);
  		}
  	});

	}
};
