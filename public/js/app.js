'use strict';


// Declare app level module which depends on filters, and services
angular.module('secondstillApp', ['secondstill.filters', 'secondstill.services', 'secondstill.directives'])
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.when('/',{	templateUrl:'partials/index' });
		$routeProvider.when('/faq',{templateUrl:'partials/faq'});
		$routeProvider.when('/developers',{templateUrl:'partials/developers'});
		$routeProvider.when('/dashboard',{templateUrl:'partials/dashboard'});

		$locationProvider.html5Mode(true);
	}])
	.run(['$rootScope','rpc',function($rootScope,rpc) {

    rpc.fetch('visitor.get', {},

      //response callback
      function(err, result) {
        if(err) {
          //handle err
          alert('error happened - contact help@secondstil.com');
          return;
        }

        console.log(result);
        $rootScope.visitorData = result.data;

      },

      //transformRequest
      function(data, headersGetter) { return data; },

      //transformResponse
      function(data, headersGetter) { return JSON.parse(data); }
    );


	}]);
