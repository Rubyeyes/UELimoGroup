angular.module('MyApp')
	.controller('AdminSettingCtrl', ['$scope', 'Info', 'Fleet', 'Service', 'Upload', 'Image', 'Auth', '$state', function($scope, Info, Fleet, Service, Upload, Image, Auth, $state) {
		// Basic Info
		$scope.information = Info.info;
		$scope.updateInfo = {};
		$scope.editingInfo = false;

		$scope.logOut = function() {
			Auth.logOut()
			$state.go('home');
		}

		$scope.enableInfoEdit = function() {
			$scope.editingInfo = true;
			$scope.updateInfo = $scope.information;
		};

		$scope.disableInfoEdit = function() {
			$scope.editingInfo = false;
		};

		$scope.saveInfo = function(updateInfo) {
			Info.update(updateInfo);
			$scope.disableInfoEdit();
		};

		// Fleet Info
		$scope.fleets = Fleet.fleets;
		$scope.updateFleet = {};
		$scope.editingFleet = [];
		$scope.addingNewFleet = false;
		$scope.enableFleetAdd = function() {
			$scope.addingNewFleet = true;
		};
		$scope.disableFleetAdd = function() {
			$scope.addingNewFleet = false;
		};
		$scope.addFleet = function() {
			Fleet.create({
				brand: $scope.brand,
				type: $scope.type,
				initial_fee: $scope.initial_fee,
				price: $scope.price,
				price_mile: $scope.price_mile,
				price_day: $scope.price_day,
				price_day_out: $scope.price_day_out,
				description: $scope.description
			});
			$scope.brand = '';
			$scope.type = '';
			$scope.initial_fee = '';
			$scope.price = '';
			$scope.price_mile = '';
			$scope.price_day = '';
			$scope.price_day_out = '';
			$scope.description = '';
			$scope.disableFleetAdd();
		};
		$scope.enableFleetEdit = function(fleet, $index) {
			$scope.editingFleet[$index] = true;
			$scope.updateFleet = fleet;
		};
		$scope.disableFleetEdit = function($index) {
			$scope.editingFleet[$index] = false;
		};
		$scope.saveFleet = function(fleet, updateFleet, $index) {
			Fleet.update(fleet, updateFleet, $index);
			$scope.disableFleetEdit($index);
		};
		$scope.removeFleet = function(fleet, $index) {
			Fleet.delete(fleet, $index);
			$scope.fleets.splice($index, 1);
			$scope.disableFleetEdit($index);
		};


		// Service Info		
		$scope.services = Service.services;		
		$scope.updateService = {};
		$scope.editingService = [];
		$scope.addingNewService = false;
		$scope.enableServiceAdd = function() {
			$scope.addingNewService = true;
		};
		$scope.disableServiceAdd = function() {
			$scope.addingNewService = false;
		};
		$scope.addService = function() {
			Service.create({
				name: $scope.name,
				description: $scope.description,
				price: $scope.price
			});
			$scope.name = '';
			$scope.description = '';
			$scope.price = '';
			$scope.disableServiceAdd();
		};
		$scope.enableServiceEdit = function(service, $index) {
			$scope.editingService[$index] = true;
			$scope.updateService = service;
		};
		$scope.disableServiceEdit = function($index) {
			$scope.editingService[$index] = false;
		};
		$scope.saveService = function(service, updateService, $index) {
			Service.update(service, updateService, $index);
			$scope.disableServiceEdit($index);
		};
		$scope.removeService = function(service, $index) {
			Service.delete(service, $index);
			$scope.services.splice($index, 1);
			$scope.disableServiceEdit($index);
		};

		// Image uploader
		// upload later on form submit or something similar
	    $scope.submit = function(type, object) {
	      if ($scope.form.files.$valid && $scope.files) {
	        $scope.upload($scope.files, type, object).then(function(response) {
	        	object.images.push(response.data);
	        });
	      }
	    };

	    // upload on file select or drop
	    $scope.upload = function (files, type, object, index) {
	    	if(object.images[0]) {
	    		Image.delete(type, object);
	    	}
	    	Image.create(files, type, object);
        	$scope.disableServiceEdit(index);
        	$scope.disableFleetEdit(index);
			$scope.disableInfoEdit();
	    };

	    // remove a image
	    $scope.removeImage = function (type, object, index) {
	    	Image.delete(type, object);
        	$scope.disableServiceEdit(index);
        	$scope.disableFleetEdit(index);
			$scope.disableInfoEdit();
	    }
	}])