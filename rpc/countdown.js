var async = require('async');
var model = require('../lib/model');
var Countdown = model.load('countdown');

exports.countdown = {
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

		//make sure targetDate is valid
		var d = new Date(args.targetDate);
		if (d == "Invalid Date") {
			console.log(args.targetDate + ' is an invalid targetDate');
			return me(null,{
				success:false,
				error:{
					code: 502,
					message:"targetDate is invalid."
				}
			});
		}
		console.log(d);

		//make sure we have an event name
		if ((typeof args.eventName === "undefined") || (args.eventName == "")) {
			return me(null,{
				success:false,
				error:{
					code: 501,
					message:"eventName is invalid."
				}
			});
		}

		console.log(args.eventName);

		//set format - only have 2 options right now
		var format = (args.format == 'Seconds') ? 'Seconds' : 'Days';

		//strip unsafe chars
		var vanityClean = args.vanityUrl.replace(/[^\sa-z0-9-]/gi, '').toLowerCase();
		vanityClean = vanityClean.replace(/\s+/gi, '-');

		Countdown.findByVanityUrl(vanityClean, function(err,countdown) {
			if (err) { return me(err);	}
			console.log('countdown: ');
			console.log(countdown);

			if (typeof countdown[0] !== "undefined") {
				return me(null,{
					success:false,
					error:{
						code: 503,
						message:"vanityUrl is unavailable."
					}
				});
			} else {
				var data = {
					targetDate: d,
					format: format,
					name:args.eventName,
					vanityUrl:vanityClean,
					externalId:args.externalId,
					externalSource:args.externalSource
				};

				//if they're logged in
				if (req.session.loggedIn) {
						data.owner = req.session.email;
				}

				var c = new Countdown(data);
				c.save(function(err,result) {
					if (err) { return me(err);	}
					console.log('result from save:');
					console.log(result);

					//push the vanity url into the session
					if (typeof req.session.countdowns === "undefined") {
						req.session.countdowns = [vanityClean];
					} else {
						req.session.countdowns.push(vanityClean);
					}


					return me(null,{
						success:true,
						error:false,
						url:result.url()
					});
				});
			}
		});
	},
};
