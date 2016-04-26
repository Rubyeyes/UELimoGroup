angular.module('FrEExApp')
	.controller('ProfileCtrl', ['$scope','user', function($scope, user) {
		$scope.user = user;
	}])