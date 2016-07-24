angular.module('MyApp')
	.controller('ReserveCtrl', ['$scope', 'Service', 'Fleet', 'Order', 'user', '$window', 'Email', 'Info', 'Auth', '$state', function($scope, Service, Fleet, Order, user, $window, Email, Info, Auth, $state) {
		$scope.services = Service.services;
		$scope.fleets = Fleet.fleets;
		$scope.newUser = {};
		var currentOrder = {};

		$scope.addReservation = function() {

			if($scope.date === '' || $scope.people ==='' || $scope.selectedFleet === {} || $scope.selectedService === {}) {return};
			
			if($scope.createAccount) {
				console.log('createdAccount');
				Auth.register($scope.newUser).then(function(err) {
					if(err) {
						$scope.error = err.message;
						$scope.createAccount = false;
					} else {
						Auth.getUserInfo().then(function(resp) {
							currentOrder = {
								username: resp.username,
								email: resp.email,
								phone_number: resp.phone_number,
								date: $scope.date,
								people: $scope.people,
								fleet: $scope.selectedFleet._id,
								service: $scope.selectedService._id,
								user: resp._id,
							};
							Order.create(currentOrder).then(function(order) {
								$scope.sendEmail(order);
								$state.go('history');
								$scope.createAccount = false;
							});
						});
					}
				});
			} else if(user) {			
				currentOrder = {
					username: user.username,
					email: user.email,
					phone_number: user.phone_number,
					date: $scope.date,
					people: $scope.people,
					fleet: $scope.selectedFleet._id,
					service: $scope.selectedService._id,
					user: user._id,
				}
				Order.create(currentOrder).then(function(order) {
					$scope.sendEmail(order);
					$state.go('history');
				});
			} else {
				console.log('NotCreateUser');
				currentOrder = {
					username: $scope.newUser.username,
					email: $scope.newUser.email,
					phone_number: $scope.newUser.phone_number,
					date: $scope.date,
					people: $scope.people,
					fleet: $scope.selectedFleet._id,
					service: $scope.selectedService._id
				}
				Order.create(currentOrder).then(function(order) {
					$scope.sendEmail(order);
					$state.go('home');
				});
			}
			
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


	}])