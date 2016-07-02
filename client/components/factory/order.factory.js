angular.module('MyApp')
	.factory('Order', ['$http', 'Auth',  function($http, Auth){
			var o = {
				orders: []
			};

			//add new order
			o.create = function(order) {
				return $http.post('/api/orders', order, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					o.orders.push(response.data);
				});
			};
			//get all orders
			o.getAll = function() {
				return $http.get('/api/orders', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					angular.copy(response.data, o.orders);
				});
			};

			//get all orders of an user
			o.getAll = function(user) {
				return $http.get('/api/orders/' + user._id, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					angular.copy(response.data, o.orders);
				});
			};

			//update a order
			o.update = function(order, updateFleet, index) {
				return $http.put('/api/orders/' + order._id + '/edit', updateFleet, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				})
			};
			//remove a order
			o.delete = function(order, index) {
				return $http.delete('/api/orders/' + order._id + '/delete', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				})
			}; 

			return o;
		}])
