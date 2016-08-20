angular.module('MyApp')
	.controller('ReserveCtrl', ['$scope', 'Service', 'Fleet', 'Order', 'user', '$window', 'Email', 'Info', 'Auth', '$state', '$filter', 'Share', '$document', 'uiGmapIsReady', '$timeout', function($scope, Service, Fleet, Order, user, $window, Email, Info, Auth, $state, $filter, Share, $document, uiGmapIsReady, $timeout ) {
		$scope.services = Service.services;
		$scope.fleets = Fleet.fleets;
		$scope.newUser = {};
		$scope.selectedFleet = {};
		$scope.selectedService = {};		
		$scope.origin = "";
		$scope.destination = "";
		$scope.showQuote = false;
		$scope.showCreateAccount = true;
		var currentOrder = {};

		//Check if login
		if(user) {
			$scope.newUser.username = user.username;
			$scope.newUser.email = user.email;
			$scope.newUser.phone_number = user.phone_number;
			$scope.showCreateAccount = false;
		}

		//Check if come from fleet or service
		if(Share.getFleet()) {
			$scope.selectedFleet._id = Share.getFleet();
		};
		if(Share.getService()) {
			$scope.selectedService._id = Share.getService();
		};

		//Filling form process control
		$scope.basicInfo = true;
		$scope.serviceInfo = false;
		$scope.travelInfo = false;
		$scope.confirmInfo = false;
		$scope.singleTrip = false;
		$scope.wholeDay = false;

		$scope.showNextService = function() {
			$scope.basicInfo = false;
			$scope.serviceInfo = true;
		};

		$scope.showPrevBasic = function() {
			$scope.basicInfo = true;
			$scope.serviceInfo = false;
		};

		$scope.showNextTravel = function() {
			$scope.serviceInfo = false;
			$scope.travelInfo = true;
		};

		$scope.showPrevService = function() {
			$scope.serviceInfo = true;
			$scope.travelInfo = false;
		};

		$scope.showPrevTravel = function() {	
			$scope.travelInfo = true;		
			$scope.confirmInfo = false;
		}

		// Load Google Map and Estimate cost
		$scope.map = {
		    control: {},
		    center: {
		        latitude: 34,
		        longitude: -118
		    },
		    zoom: 8,
		    options: {
		    	scrollwheel: false
		    }
		  };
		  
		  // marker object
		  $scope.marker = {
		    center: {
		        latitude: 34,
		        longitude: -118
		    }
		  }
		  
		  // instantiate google map objects for directions
		  var directionsDisplay = new google.maps.DirectionsRenderer();
		  var directionsService = new google.maps.DirectionsService();
		  var geocoder = new google.maps.Geocoder();
		  
		  // get directions using google maps api
		  $scope.getQuote = function () {
		    var request = {
		      origin: $scope.origin,
		      destination: $scope.destination,
			  drivingOptions: {
			    departureTime: $scope.date
			  },
		      travelMode: google.maps.DirectionsTravelMode.DRIVING
		    };
		    directionsService.route(request, function (response, status, routes) {
		      if (status === google.maps.DirectionsStatus.OK) {
		        directionsDisplay.setDirections(response);
		        directionsDisplay.setMap($scope.map.control.getGMap());

		        $scope.distance = response.routes[0].legs[0].distance.text;
		        $scope.duration = response.routes[0].legs[0].duration.text;
		        Fleet.get($scope.selectedFleet._id).then(function(resp) {
		        	var quoteFleet = resp		        
		        	$scope.quote = quoteFleet.initial_fee + quoteFleet.price/60 * response.routes[0].legs[0].duration.value/60 + quoteFleet.price_mile * response.routes[0].legs[0].distance.value/1609.34
		        })

		       	$scope.showQuote = true;
				$scope.travelInfo = false;		
				$scope.confirmInfo = true;
		  		if($scope.tripType === "singleTrip"){
		  			$scope.singleTrip = true;
		  		} else if($scope.tripType ==  "wholeDay") {
		  			$scope.wholeDay = true;
		  		}
		      } else {
		        alert('Google route unsuccesfull!');
		      }
		    });
			
		  }

		$scope.addReservation = function() {

			if($scope.quote === "") {
				getQuote();
			}

			if($scope.date === '' || $scope.people ==='' || $scope.selectedFleet === {} || $scope.selectedService === {}) {return};
			
			if($scope.createAccount) {
				Auth.register($scope.newUser).then(function(err) {
					if(err) {
						$scope.error = err.message;
						$scope.createAccount = false;
					} 
					else {
						Auth.getUserInfo().then(function(resp) {
							currentOrder = {
								username: resp.username,
								email: resp.email,
								phone_number: resp.phone_number,
								date: $scope.date,
								people: $scope.people,
								fleet: $scope.selectedFleet._id,
								service: $scope.selectedService._id,
								origin: $scope.origin,
								destination: $scope.destination,
								quote: $scope.quote,
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
			} 
			else if(user) {			
				currentOrder = {
					username: user.username,
					email: user.email,
					phone_number: user.phone_number,
					date: $scope.date,
					people: $scope.people,
					fleet: $scope.selectedFleet._id,
					service: $scope.selectedService._id,
					origin: $scope.origin,
					destination: $scope.destination,
					quote: $scope.quote,
					user: user._id,
				}
				Order.create(currentOrder).then(function(order) {
					$scope.sendEmail(order);
					$state.go('history');
				});
			} 
			else {
				currentOrder = {
					username: $scope.newUser.username,
					email: $scope.newUser.email,
					phone_number: $scope.newUser.phone_number,
					date: $scope.date,
					people: $scope.people,
					fleet: $scope.selectedFleet._id,
					service: $scope.selectedService._id,
					origin: $scope.origin,
					destination: $scope.destination,
					quote: $scope.quote,
				}
				Order.create(currentOrder).then(function(order) {
					$scope.sendEmail(order);
					$state.go('home');
				});
			}
			
		};

		// Send email
		$scope.sendEmail = function(order) {
			var currentFleet = order.fleet[0];
			var currentService = order.service[0];
	  		if($scope.tripType === "singleTrip"){
	  			var template = "<html><h3 style='color: #a1774f'>Thank you for choosing U E Limo Group</h3><br><h3>" +
							"Your Order # is : " + order._id + 
							"</h3><br><p><b>Customer Info: </b>" + 
							"</p><p>Name: " + order.username + 
							"</p><p>Email: " + order.email + 
							"</p><p>Phone #: " + order.phone_number + 
							"</p><br><p><b>Order Info: </b>" +
							"</p><p>Type: " + $scope.tripType +
							"</p><p>Fleet: " + currentFleet.brand + " " + currentFleet.type +
							"</p><p>Service: " + currentService.name + 
							"</p><p>People: " + order.people + 
							"</p><p>Date: " + $filter('date')(order.date, "yyyy-MM-dd HH:mm")+ 
							"</p><p>Origin: " + order.origin +
							"</p><p>Destination: " + order.destination +
							"</p><p>Quote: " + $filter('currency')(order.quote, "$", 2) +
							"</p></html>"
	  		} else if($scope.tripType ==  "wholeDay") {
	  			var template = "<html><h3 style='color: #a1774f'>Thank you for choosing U E Limo Group</h3><br><h3>" +
							"Your Order # is : " + order._id + 
							"</h3><br><p><b>Customer Info: </b>" + 
							"</p><p>Name: " + order.username + 
							"</p><p>Email: " + order.email + 
							"</p><p>Phone #: " + order.phone_number + 
							"</p><br><p><b>Order Info: </b>" +
							"</p><p>Type: " + $scope.tripType +
							"</p><p>Fleet: " + currentFleet.brand + " " + currentFleet.type +
							"</p><p>Service: " + currentService.name + 
							"</p><p>People: " + order.people + 
							"</p><p>Date: " + $filter('date')(order.date, "yyyy-MM-dd HH:mm")+ 
							"</p><p>Origin: " + order.origin +
							"</p><p>Destination: " + order.destination +
							"</p><p>Quote: " + currentFleet.price_day + "/Day, and " + currentFleet.price_day_out + "/Day and up if out of LA County or Orange County"
							"</p></html>"
	  		}
			
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