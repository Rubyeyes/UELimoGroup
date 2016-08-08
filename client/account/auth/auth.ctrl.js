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
			$state.go('forget');
		};

		$scope.resetPassword = function() {
			console.log($scope.forgetEmail);
			var sendEmail = {
				email: $scope.forgetEmail
			}
			Auth.resetPassword(sendEmail).then(function(err) {
				if(err) {
					$scope.error = err.message;
				} else {
					$scope.notice = "An email has been sent to" + sendEmail.email
				}
			})
		}
 
	}]);