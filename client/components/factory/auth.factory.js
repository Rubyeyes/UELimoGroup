angular.module('MyApp')
	.factory('Auth', ['$http', '$window', '$q', function($http, $window, $q) {
			var auth = {};

			auth.saveToken = function(token) {
				$window.localStorage['ma-fancy-token'] = token;
			};

			auth.getToken = function() {
				return $window.localStorage['ma-fancy-token'];
			};

			auth.isLoggedIn = function() {
				var token = auth.getToken();

				if(token) {
					var payload = JSON.parse($window.atob(token.split('.')[1]));

					return payload.exp > Date.now() / 1000;
				} else {
					return false;
				}
			};

			auth.register = function(user) {
				return $http.post('/api/users/register', user).then(function(response) {
					auth.saveToken(response.data.token);
				});
			};

			auth.logIn = function(user) {
				return $http.post('/api/users/login', user).then(function(response) {
					auth.saveToken(response.data.token);
				}, function(err) {
					return err.data;
				})
			};

			auth.logOut = function() {
				$window.localStorage.removeItem('ma-fancy-token');
			};

			auth.currentUser = function() {
				var token = auth.getToken();

				if(token) {
					var payload = JSON.parse($window.atob(token.split('.')[1]));
					return payload.username;
				} else {
					return false;
				}
			};

			auth.currentRole = function() {
				var token = auth.getToken();

				if(token) {
					var payload = JSON.parse($window.atob(token.split('.')[1]));
					return payload.role;
				} else {
					return false;
				}
			};

			auth.getUserInfo = function() {
				var token = auth.getToken();

				if(token) {
					var payload = JSON.parse($window.atob(token.split('.')[1]));
					var id = payload._id
					return $http.get('/api/users/' + id).then(function(response) {
						return	response.data;
					})
				} else {
					return false;
				}
			};

			auth.getUsersNameEmail = function() {
				return $http.get('/api/users/usersnameemail').then(function(response) {
					return response.data;
				})
			};

			auth.resetPassword = function(email) {
				return $http.post('/api/users/forget', email).then(function(err, response) {
					if(err) {
						console.log(err);
						return err;
					}
					return response.data;
				})
			}

			return auth;
		}])