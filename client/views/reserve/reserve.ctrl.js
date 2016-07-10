angular.module('MyApp')
	.controller('ReserveCtrl', ['$scope', 'Service', 'Fleet', 'Order', 'user', '$window', 'Email', 'Info', function($scope, Service, Fleet, Order, user, $window, Email, Info) {
		$scope.services = Service.services;
		$scope.fleets = Fleet.fleets;
		$scope.newUser = {};

		$scope.addReservation = function() {
			if($scope.date === '' || $scope.people ==='' || $scope.selectedFleet === {} || $scope.selectedService === {}) {return};
			
			if(user) {
				var currentOrder = {
					name: user.username,
					email: user.email,
					phone_number: user.phone_number,
					date: $scope.date,
					people: $scope.people,
					fleet: $scope.selectedFleet._id,
					service: $scope.selectedService._id,
					user: user._id,
				}
			} else {
				var currentOrder = {
					name: $scope.newUser.name,
					email: $scope.newUser.email,
					phone_number: $scope.newUser.phone_number,
					date: $scope.date,
					people: $scope.people,
					fleet: $scope.selectedFleet._id,
					service: $scope.selectedService._id
				}
			}
			Order.create(currentOrder).then(function(order) {
				$scope.sendEmail(order);
			});
		};

		//Send email
		$scope.sendEmail = function(order) {
			Email.sendEmail({	
				email: order.email,
				cc: Info.info.email,
				subject: "UE Limo Group Reservation",
				content: "<html><p>You got a new order</p></html>"
			});
		}

		//Form process
		$scope.reservFinished = false;

		// $scope.register = function(form) {
		// 	$scope.submitted = true;
		// 	if(form.$valid) {
		// 		Auth.register($scope.user).then(function(err) {
		// 			if(err) {
		// 				$scope.error = err.message;
		// 			} else {
		// 				$state.go('home');
		// 			}
		// 		});
		// 	}
			
		// };

	}])