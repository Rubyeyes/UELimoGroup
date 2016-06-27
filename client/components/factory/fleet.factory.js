angular.module('MyApp')
	.factory('Fleet', ['$http', 'Auth',  function($http, Auth){
			var o = {
				fleets:[]
			};

			//get all posts
			o.getAll = function() {
				return $http.get('/api/fleets', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					angular.copy(response.data, o.fleets);
				});
			};

			return o;
		}])
