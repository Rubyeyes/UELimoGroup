angular.module('MyApp')
	.factory('Fleet', ['$http', 'Auth',  function($http, Auth){
			var o = {
				fleets: []
			};

			//add new fleet
			o.create = function(fleet) {
				return $http.post('/api/fleets', fleet, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					o.fleets.push(response.data);
				});
			};
			//get all fleets
			o.getAll = function() {
				return $http.get('/api/fleets', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					angular.copy(response.data, o.fleets);
				});
			};
			//update a fleet
			o.update = function(fleet, updateFleet, index) {
				return $http.put('/api/fleets/' + fleet._id + '/edit', updateFleet, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				})
			};
			//remove a fleet
			o.delete = function(fleet, index) {
				return $http.delete('/api/fleets/' + fleet._id + '/delete', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				})
			}; 
			//get a single fleet
			o.get = function(id) {
				return $http.get('/api/fleets/' + id).then(function(res) {
					return res.data;
				});
			};

			return o;
		}])
