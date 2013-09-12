'use strict';

/* Controllers */

function MainCtrl($rootScope, $scope, $location, rpc) {
  console.log('running main');
  Keen.configure('50802969897a2c2613000005','de422c0f73ad4a1887e793b1a6df25b9');
  console.log($rootScope.visitorData);

};

function NavCtrl($rootScope, $location, $scope, $window, rpc) {
  $rootScope.currentPath = $location.path();

  $scope.logout = function() {
    //post the form data to the json api
    rpc.fetch('customer.logout', {},

    //response callback
    function(err, result) {
      if(err) {
        //handle err
        alert('error happened - contact help@secondstil.com');
        return;
      }
      console.log(result);

      //go to the url
      $window.location.href = '/';

    },

    //transformRequest
    function(data, headersGetter) { return data; },

    //transformResponse
    function(data, headersGetter) { return JSON.parse(data); }
    );
  }
}

function FaqCtrl($rootScope,$location) {
  $rootScope.currentPath = $location.path();
  Keen.addEvent("views", {page:$location.path()});
};

function DevelopersCtrl($rootScope,$location) {
  $rootScope.currentPath = $location.path();
  Keen.addEvent("views", {page:$location.path()});

};

function CountdownCtrl($rootScope,$location) {
  $rootScope.currentPath = $location.path();
  Keen.addEvent("views", {page:$location.path()});
};

function LoginCtrl($scope,$location,$window,rpc) {
  $scope.loginForm = function() {
    console.log('login form submit');
    var args = {
      email: $scope.email,
      password: $scope.password
    };

    //post the form data to the json api
    rpc.fetch('customer.login', args,

      //response callback
      function(err, result) {
        if(err) {
          //handle err
          alert('error happened - contact help@secondstil.com');
          return;
        }

        if (result.error) {
          $scope.formError = true;
          $('.error').html(result.error.message).show();
          return;
        }

        //go to the url
        $window.location.href = '/dashboard';

      },

      //transformRequest
      function(data, headersGetter) {
        //$('#more-events .spinner').show();
        return data;
      },

      //transformResponse
      function(data, headersGetter) {
        //$('#more-events .spinner').hide();
        return JSON.parse(data);
      }
    );

  };
}

function CalendarCtrl($location, $scope, $rootScope, $window, rpc) {
};

function IndexCtrl($location, $scope, $rootScope, $window, rpc) {
	$rootScope.currentPath = $location.path();
  Keen.addEvent("views", {page:$location.path()});

	$scope.formError = false;
	console.log('running index ctrl');
	$scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	$scope.ampms = ["AM", "PM"];
	$scope.ampm = 'PM';
	$scope.formats = ["Days", "Seconds"];
	$scope.format = "Days";
	$scope.year = new Date().getFullYear();

	$scope.submitForm = function() {
		//check for a valid target date, format, event name and vanity url
		console.log($scope.targetStr);
		console.log('submitting form');
		if(typeof $scope.targetStr === "undefined") {
			$scope.formError = true;
			return;
		}

		if(typeof $scope.vanityUrl === "undefined") {
			$scope.formError = true;
			return;
		}

		$scope.formError = false;

		var args = {
			targetDate: $scope.targetStr,
			format: $scope.format,
			eventName: $scope.eventName,
			vanityUrl: $scope.vanityUrl
		};

	  //post the form data to the json api
		rpc.fetch('countdown.create', args,

  		//response callback
  		function(err, result) {
  			if(err) {
  				//handle err
  				alert('error happened - contact help@secondstil.com');
  				return;
  			}

  			if (result.error) {
  				$scope.formError = true;
  				$('.error').html(result.error.message);
  				return;
  			}

  			$scope.formError = false;
  			if (typeof result.url === "undefined") {
  				$scope.formError = true;
  				$('.error').html('A system error occurred, please contact help@secondstil.com');
  				return;
  			}

  			//go to the url
  			$window.location.href = result.url;

  		},

  		//transformRequest
  		function(data, headersGetter) {
  			//$('#more-events .spinner').show();
  			return data;
  		},

  		//transformResponse
  		function(data, headersGetter) {
  			//$('#more-events .spinner').hide();
  			return JSON.parse(data);
  		}
  	);
	}

};

function SignupCtrl($scope,rpc) {
  console.log('running signup ctrl');

	$scope.signupForm = function() {
		console.log('saving email');

		rpc.fetch('customer.create', {email:$scope.email},

  		//response callback
  		function(err, result) {
  			if(err || typeof result =="undefined") {
  				//handle err
  				alert('error happened - contact help@secondstil.com');
  				$scope.formError = true;
  				return;
  			}

  			if (result.error) {
  				$scope.formError = true;
  				$('.error').html(result.error.message);
  				return;
  			}

  			$('#signup').modal('hide');

  		},

  		//transformRequest
  		function(data, headersGetter) {
  			//$('#more-events .spinner').show();
  			return data;
  		},

  		//transformResponse
  		function(data, headersGetter) {
  			//$('#more-events .spinner').hide();
  			return JSON.parse(data);
  		}
  	);
	};
};

function DashboardCtrl($location,$scope,$rootScope) {
	console.log('running dashboard ctrl');
  $rootScope.currentPath = $location.path();

};
