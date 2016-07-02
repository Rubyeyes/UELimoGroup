angular.module('MyApp')
	.controller('ReserveCtrl', ['$scope', 'Service', 'Fleet', 'Order', function($scope, Service, Fleet, Order) {
		$scope.services = Service.services;
		$scope.fleets = Fleet.fleets;

		$scope.addReservation = function() {
			Order.create({
				date: $scope.date,
				people: $scope.people,
				price: $scope.price,
				description: $scope.description
			});
		};
	}])