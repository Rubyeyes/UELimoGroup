angular.module('MyApp')
	.controller('ServicesCtrl', ['$scope', 'Service', function($scope, Service) {
		$scope.services = Service.services;
	}])