angular.module('MyApp')
	.controller('AuthCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
		$scope.user = {};
		$scope.submitted = false;
		$scope.err = "";

		$scope.register = function(form) {
			$scope.submitted = true;
			if(form.$valid) {
				Auth.register($scope.user).then(function(err) {
					if(err) {
						$scope.error = err.message;
					} else {
						$state.go('home');
					}
				});
			}
			
		};

		$scope.logIn = function() {
			$scope.submitted = true;
			Auth.logIn($scope.user).then(function(err) {
				if(err) {
					$scope.error = err.message;
				} else {
					$state.go('home');
				}
			});
		};

		$scope.forgetPassword = function() {
			if($scope.user.email) {
				Auth.checkUserByEmail($scope.user.email).then(function(err, response) {
					if(err) {
						$scope.err = "Email is not registered"
					} else {
						$scope.notice = "An email of reset password is sent to your email address"
					}
				})
			} else {
				$scope.err = "Email is required ~!"
			}
		};
 
	}]);