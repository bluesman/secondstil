var async = require('async');
var model = require('../lib/model');
var Countdown = model.load('countdown');

exports.visitor = {
	get: function(args,req,res) {
		var me = this;
		var data = {
			visitorId:req.session.visitorId
		}
		return me(null,{success:true,error:false,data:data});
	}

};
