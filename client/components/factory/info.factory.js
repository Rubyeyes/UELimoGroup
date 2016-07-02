angular.module('MyApp')
	.factory('Info', ['$http', 'Auth',  function($http, Auth){
			var o = {
				info: {}
			};

			//get all info
			o.getAll = function() {
				return $http.get('/api/info', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					angular.copy(response.data, o.info);
					return response.data;
				});
			};

			//update a post
			o.update = function(updateInfo) {
				return $http.put('/api/info/', updateInfo).then(function(response) {
					angular.copy(response.data, o.info);
				});
			};

			return o;
		}])
