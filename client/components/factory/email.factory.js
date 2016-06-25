angular.module('FrEExApp')
	.factory('Email', ['$http', 'Auth', function($http, Auth){
			var email = {};

			//send an email
			email.sendEmail = function(email) {
				return $http.post('/api/email', email, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					// console.log(response);
				});
			};

			return email;
		}])