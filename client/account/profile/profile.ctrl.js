angular.module('MyApp')
	.controller('ProfileCtrl', ['$scope','user', function($scope, user) {
		$scope.user = user;
	}])