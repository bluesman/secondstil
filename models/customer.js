var utils = require('../lib/utils');
var async = require('async');
var wembliModel = require('../lib/model');

this.Model = function(mongoose) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var ForgotPassword = new Schema({
		timestamp: {
			type: String
		},
		token: {
			type: String
		}
	});

	var Customer = new Schema({
		visitorId: {
			type:String
		},
		fbId: {
			type: String
		},
		first_name: {
			type: String
		},
		last_name: {
			type: String
		},
		zip_code: {
			type: Number
		},
		email: {
			type: String,
			unique: true
		},
		password: {
			type: String
		},
		forgot_password: [ForgotPassword],
		date_created: {
			type: Date,
			default:Date.now
		},
		last_modified: {
			type: Date
		}
	});

	Customer.pre('save', function(next) {
		console.log('customer email is: ' + this.email);
		//if no email throw an error
		if (!this.email) {
			return next(new Error('error - no email for customer'));
		}

		this.last_modified = new Date();
		console.log('pre save');
		next();
	});

	Customer.methods.full_name = function() {
		return this.first_name + ' ' + this.last_name
	};

	Customer.statics.findByEmail = function(email, callback) {
		return this.find({
			email: email
		}, callback);
	};


	//not sure if mongoose does connection pooling - i hope so :)
	//var db = mongoose.connect(mongoose.dbSetting);
	mongoose.model('customer', Customer);
	return mongoose.model('customer');
};
