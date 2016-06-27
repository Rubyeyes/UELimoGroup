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
					return response.data;
				});
			};

			return o;
		}])
