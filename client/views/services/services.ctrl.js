angular.module('MyApp')
	.controller('ServicesCtrl', ['$scope', 'Service','Info', 'Share', '$state', function($scope, Service, Info, Share, $state) {
		$scope.services = Service.services;
		$scope.information = Info.info;

		$scope.reserve = function(service) {
			Share.setService(service._id);
			$state.go('reserve');
		}
	}])