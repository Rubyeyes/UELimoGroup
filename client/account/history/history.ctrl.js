angular.module('MyApp')
	.controller('HistoryCtrl', ['$scope','user', function($scope, user) {
		$scope.user = user;
		$scope.orders = user.orders;

	}])