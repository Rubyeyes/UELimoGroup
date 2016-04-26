angular.module('FrEExApp')
	.controller('AuthCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth) {
		$scope.user = {};

		$scope.register = function() {
			Auth.register($scope.user).then(function() {
				$state.go('home');
			});
		};

		$scope.logIn = function() {
			Auth.logIn($scope.user).then(function() {
				$state.go('home');
			});
		};
	}])