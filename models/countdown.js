var utils = require('../lib/utils');
var async = require('async');

this.Model = function(mongoose) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var Countdown = new Schema({
		owner: {
			type: String
		},
		targetDate: {
			type: Date
		},
		format: {
			type: String,
			default: 'Days'
		},
		year: {
			type: String
		},
		month: {
			type: String
		},
		day: {
			type: String
		},
		name: {
			type: String
		},
		vanityUrl: {
			type: String
		},
		proto: {
			type: String,
			default: 'http'
		},
		domain: {
			type: String,
			default: 'secondstil.com'
		},
		externalId: {
			type:String
		},
		externalSource: {
			 type:String
		},
		created: {
			type: Date,
			default: Date.now
		},
		lastModified: {
			type: Date
		}
	},
	{
		autoIndex:false
	}
	);

	Countdown.index({vanityUrl:1});

	Countdown.pre('save', function(next) {
		console.log('targetDate is: ' + this.targetDate);
		//if no targetDate throw an error
		if (!this.targetDate) {
			return next(new Error('error - no targetDate for countdown'));
		}

		if (!this.name) {
			return next(new Error('error - no name for countdown'))
		}

		if (!this.vanityUrl) {
			return next(new Error('error - no vanityUrl for countdown'))
		}

		this.lastModified = new Date();

		//split up the target date for easy categorization
		this.year  = this.targetDate.format("yyyy");
		this.month = this.targetDate.format("mmmm");
		this.day   = this.targetDate.format("dd");

		next();
	});

	Countdown.methods.test = function() {
		console.log('test');
	};

	Countdown.methods.url = function() {
		return this.proto + '://' + this.domain + '/' + this.vanityUrl;
	};

	Countdown.statics.findByVanityUrl = function(vanityUrl, callback) {
		return this.find({
			vanityUrl: vanityUrl
		}, callback);
	};

	Countdown.statics.countByMonth = function(year,cb) {
		this.find({"year":year},{month:1},function(err,countdowns){

			var data = {};
			utils.monthNames().forEach(function(val,idx) {
				data[val] = 0;
			});
			async.forEach(countdowns,
				function(item,callback) {
					data[item.month]++;
					callback();
				},
				function(err,results) {
					return cb(null,data);
				}
				);
		});
	};

	Countdown.statics.countByDay = function(args,cb) {
		this.find({"year":args.year,"month":args.month},{year:1,month:1,targetDate:1},function(err,countdowns){

			var data = {};

			async.forEach(countdowns,
				function(item,callback) {
					var day = item.targetDate.format('dd');
					console.log(day);
					data[day] = (typeof data[day] == "undefined") ? 1 : data[day] + 1;
					callback();
				},
				function(err,results) {
					return cb(null,data);
				}
				);
		});
	};

	//not sure if mongoose does connection pooling - i hope so :)
	//var db = mongoose.connect(mongoose.dbSetting);
	mongoose.model('countdown', Countdown);
	return mongoose.model('countdown');
};
