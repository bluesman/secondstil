'use strict';

/* Directives */


angular.module('secondstill.directives', [])
	.directive('signupModal',function() {
		return function(scope,element,attr) {
			element.modal('show');
		}
	})

	.directive('countdown', function($timeout,countdownString) {
		return {
			restrict:"ECA",
			replace:true,
			templateUrl:'partials/countdown',
			link: function(scope,element,attr) {
				console.log(attr)

				scope.name = attr.name;
				scope.vanityUrl = attr.vanityUrl;

				var updateLater = function() {
					scope.tId = $timeout(function() {
						formatCountdown();
						updateLater();
					},1000);
				};

				var formatCountdown = function() {
					var target    = new Date(attr.targetDate);
					scope.countdown = countdownString(target,element,attr.format);
				};

				updateLater();
			}
		}
	})

	.directive('vanityUrl', function() {
		return function(scope,element,attr) {
			//watch the event name field and make a valid vanity url as they type
			scope.$watch('eventName',function(newVal,oldVal,scope) {
				if (newVal && (typeof newVal !=="undefined")) {
				  //strip non url chars
				  scope.vanityUrl = newVal.replace(/[^\sa-z0-9]/gi, '').toLowerCase();
				  scope.vanityUrl = newVal.replace(/\s+/gi, '-');
				}
			});
		};
	})
	.directive('datePreview', function($timeout,$filter,countdownString) {
		return function(scope,element,attr) {
			/*
			watch the date models, when they change update the preview
			date models are:
	      - month, day, year, hour ,min, second, format
			*/

			var updateLater = function() {
				scope.tId = $timeout(function() {
					formatPreview(null,null,scope);
					updateLater();
				},1000);
			};

			var models = ['month','day','year','hour','min','seconds','format'];

			var formatPreview = function(newVal,oldVal,scope) {
				var error = false;


	      //check if we have enough data to make a countdown
				$(models).each(function(idx,el) {
					if (typeof scope[el] == "undefined") {
						error = true;
					}
					if (scope[el] === "") {
						error = true;
					}
				});

				if (error) {
					if (typeof scope.tId !== "undefined") {
						$timeout.cancel(scope.tId);
						delete scope.tId;
					}
					return;
				}

				//zero pad hour min and sec
				scope.hour    = ('0' + scope.hour).slice(-2);
				scope.min     = ('0' + scope.min).slice(-2);
				scope.seconds = ('0' + scope.seconds).slice(-2);

				//still here? good - make the countdown
				scope.targetStr = scope.month + ' ' + scope.day + ', ' + scope.year + ' ' + scope.hour + ':' + scope.min + ':' + scope.seconds + ' ' + scope.ampm;
				var target    = new Date(scope.targetStr);

				scope.formatPreview = countdownString(target,element,scope.format);

				//init the timer if it hasn't started
				if (typeof scope.tId === "undefined") {	updateLater(); }
			};

			$(models).each(function(idx,el) {
				scope.$watch(el,formatPreview);
			});

			//updateLater();

		};
	})
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
