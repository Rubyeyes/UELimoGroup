angular.module('MyApp')
	.controller('ReserveCtrl', ['$scope', 'Service', 'Fleet', 'Order', 'user', '$window', 'Email', 'Info', 'Auth', '$state', '$filter', function($scope, Service, Fleet, Order, user, $window, Email, Info, Auth, $state, $filter) {
		$scope.services = Service.services;
		$scope.fleets = Fleet.fleets;
		$scope.newUser = {};
		var currentOrder = {};

		$scope.addReservation = function() {

			if($scope.date === '' || $scope.people ==='' || $scope.selectedFleet === {} || $scope.selectedService === {}) {return};
			
			if($scope.createAccount) {
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
			var currentFleet = order.fleet[0];
			var currentService = order.service[0];
			var template = "<html><h3 style='color: #a1774f'>Thank you for choosing U E Limo Group</h3><br><h3>" +
							"Your Order # is : " + order._id + 
							"</h3><p>Name: " + order.username + 
							"</p><p>Email: " + order.email + 
							"</p><p>Phone #: " + order.phone_number + 
							"</p><p>Fleet: " + currentFleet.brand + " " + currentFleet.type +
							"</p><p>Service: " + currentService.name + 
							"</p><p>People: " + order.people + 
							"</p><p>Date: " + $filter('date')(order.date, "yyyy-MM-dd HH:mm")+ 
							"</p></html>"
			Email.sendEmail({	
				email: order.email,
				cc: Info.info.email,
				subject: "UE Limo Group Reservation",
				content: template
			});
		}

		//Form process
		$scope.reservFinished = false;


	}])