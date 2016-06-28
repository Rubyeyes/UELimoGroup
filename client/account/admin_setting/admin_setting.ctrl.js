angular.module('MyApp')
	.controller('AdminSettingCtrl', ['$scope', 'Info', 'Fleet', function($scope, Info, Fleet) {
		// Basic Info
		$scope.information = Info.info;
		$scope.updateInfo = {};
		$scope.editingInfo = false;

		$scope.enableInfoEdit = function() {
			$scope.editing = true;
			$scope.updateInfo = $scope.information;
		};

		$scope.disableInfoEdit = function() {
			$scope.editing = false;
		};

		$scope.saveInfo = function(updateInfo) {
			Info.update(updateInfo);
			$scope.disableInfoEdit();
		};

		// Fleet Info
		$scope.fleets = Fleet.fleets;		
		$scope.updateFleet = {};
		$scope.editingFleet = [];
		$scope.addingFleet = false;
		$scope.enableFleetAdd = function() {
			$scope.addingFleet = true
		};
		$scope.disableFleetAdd = function() {
			$scope.addingFleet = false
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
	}])