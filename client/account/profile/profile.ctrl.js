angular.module('MyApp')
	.controller('ProfileCtrl', ['$scope','user', 'Auth', '$state', function($scope, user, Auth, $state) {
		$scope.user = user;

		$scope.logOut = function() {
			Auth.logOut()
			$state.go('home');
		}
	}])