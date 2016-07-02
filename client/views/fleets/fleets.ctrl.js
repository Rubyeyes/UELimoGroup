angular.module('MyApp')
	.controller('FleetsCtrl', ['$scope', 'Fleet', function($scope, Fleet) {
		$scope.fleets = Fleet.fleets;
	}])