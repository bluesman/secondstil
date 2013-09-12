'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('secondstill.services', []).factory('rpc', ['$rootScope', '$http', function($rootScope, $http) {
	var rpc = {};

	var jsonRpc = {
		"jsonrpc": "2.0",
		"id": 1,
		"params": {}
	};


	rpc.fetch = function(method, args, callback, transformRequest, transformResponse) {
		jsonRpc.method = method;
		jsonRpc.params.args = args;
		var data = JSON.stringify(jsonRpc);

		var cb = function(err, data) {
				var eventName = 'rpc:';
				$rootScope.$broadcast(eventName + 'success', {
					'method': method
				});
				var ret = callback(err, data);
				$rootScope.$broadcast(eventName + 'callbackComplete', {
					'method': method
				});
			}

		if(typeof transformRequest === "undefined") {
			transformRequest = function(data) {
				return data;
			}
		}

		if(typeof transformResponse === "undefined") {
			transformResponse = function(data) {
				return JSON.parse(data);
			}
		}

		$http.post('/', data, {
			headers: {
				"Content-Type": "application/json"
			},
			transformRequest: transformRequest,
			transformResponse: transformResponse
		}).success(function(data, status) {
			var result = {};
			result.data = data;
			result.status = status;
			return cb(null, result.data.result);
		}).error(function(err) {
			callback(err);
		});
	};

	return rpc;
}])

.factory('countdownString', function() {

	return function(target, element, format) {
		var now = new Date();

		var formatters = {
			'Seconds': function(seconds) {
				return Math.floor(seconds) + ' seconds';
			},
			'Days': function(seconds) {

				var daysMultiplier = (60 * 60 * 24);
				var hoursMultiplier = (60 * 60);
				var minMultiplier = (60);

				element.css('color', '#555555');

				var days = Math.floor(seconds / daysMultiplier);
				seconds = seconds - (days * daysMultiplier);

				//diff = diff - daysMultiplier;
				var hours = Math.floor(seconds / hoursMultiplier);
				var mins = Math.floor((seconds / minMultiplier) - (hours * (60 * 60)));
				var secs = Math.floor(seconds - (mins * 60));
				var daysStr = (days == 1) ? days + ' Day, ' : days + ' Days, ';

				var hourStr = ('0' + hours).slice(-2);
				hourStr += (hourStr === "01") ? ' Hour, ' : ' Hours, ';

				var minStr = ('0' + mins).slice(-2);
				minStr += (minStr === "01") ? ' Min and ' : ' Mins and ';

				var secStr = ('0' + secs).slice(-2);
				secStr += ' Seconds';

				return daysStr + hourStr + minStr + secStr;

			}
		}

		var seconds = (target - now) / 1000;

		if(seconds < 0) {
			element.css('color', '#9D0006');
			return "You missed it! It happened " + Math.floor(Math.abs(seconds)) + " seconds ago.";
		}

		return formatters[format](seconds);
	};
}).value('version', '0.1');
