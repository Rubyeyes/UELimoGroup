angular.module('MyApp')
	.factory('Share', function(){

		var savedFleet = {}
		function setFleet(dataFleet) {
			savedFleet = dataFleet;
		}

		function getFleet() {
			return savedFleet;
		}

		var savedService = {}
		function setService(dataService) {
			savedService = dataService;
		}

		function getService() {
			return savedService;
		}

		return {
			setFleet: setFleet,
			getFleet: getFleet,
			setService: setService,
			getService: getService
		}	

	})