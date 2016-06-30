angular.module('MyApp')
	.factory('Service', ['$http', 'Auth',  function($http, Auth){
			var o = {
				services: []
			};

			//add new service
			o.create = function(service) {
				return $http.post('/api/services', service, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					o.services.push(response.data);
				});
			};
			//get all services
			o.getAll = function() {
				return $http.get('/api/services', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					angular.copy(response.data, o.services);
				});
			};
			//update a service
			o.update = function(service, updateService, index) {
				return $http.put('/api/services/' + service._id + '/edit', updateService, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				})
			};
			//remove a service
			o.delete = function(service, index) {
				return $http.delete('/api/services/' + service._id + '/delete', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				})
			}; 

			return o;
		}])
