angular.module('MyApp')
	.controller('AdminSettingCtrl', ['$scope', 'Info', 'Fleet', 'Service', 'Upload', function($scope, Info, Fleet, Service, Upload) {
		// Basic Info
		$scope.information = Info.info;
		$scope.updateInfo = {};
		$scope.editingInfo = false;

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
				price: $scope.price,
				description: $scope.description
			});
			$scope.brand = '';
			$scope.type = '';
			$scope.price = '';
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

		$scope.fleetOrder = 'brand';

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
	    $scope.upload = function (files, type, object) {
	    	for (var i = 0; i < files.length; i++) {
	    		Upload.upload({
		            url: '/api/' + type + '/' + object._id + '/upload',
		            data: {file: files[i], 'username': $scope.username}
		        }).then(function (resp) {
		            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
		        }, function (resp) {
		            console.log('Error status: ' + resp.status);
		        }, function (evt) {
		            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		            $scope.progress = 'progress: ' + progressPercentage + '% ';
		            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
		        });
	    	}
	    };
	}])