angular.module('MyApp')
	.controller('ReserveCtrl', ['$scope', 'Service', 'Fleet', 'Order', 'user', '$window', 'Email', 'Info', function($scope, Service, Fleet, Order, user, $window, Email, Info) {
		$scope.services = Service.services;
		$scope.fleets = Fleet.fleets;

		$scope.addReservation = function() {
			if($scope.date === '' || $scope.people ==='' || $scope.selectedFleet === {} || $scope.selectedService === {}) {return};
			Order.create({
				date: $scope.date,
				people: $scope.people,
				fleet: $scope.selectedFleet._id,
				service: $scope.selectedService._id,
				user: user._id
			}).then(function(err, order) {
				if(err) {
					console.log(err)
				} else{		
					$scope.sendEmail(order);			
					$window.location.href = '/history';
				}
			});
		};

		//Send email
		$scope.sendEmail = function(order) {
			Email.sendEmail({	
				email: user.email,
				cc: Info.info.email,
				subject: "UE Limo Group Reservation",
				content: "<html><p>You got a new order</p></html>"
			});
		}

	}])