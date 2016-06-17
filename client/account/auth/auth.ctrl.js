angular.module('FrEExApp')
	.controller('AuthCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
		$scope.user = {};
		$scope.submitted = false;

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
 
	}]);