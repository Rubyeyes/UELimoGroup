angular.module('FrEExApp')
	.factory('Auth', ['$http', '$window', function($http, $window) {
			var auth = {};

			auth.saveToken = function(token) {
				$window.localStorage['flapper-news-token'] = token;
			};

			auth.getToken = function() {
				return $window.localStorage['flapper-news-token'];
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
				return $http.post('/api/register', user).then(function(response) {
					auth.saveToken(response.data.token);
				});
			};

			auth.logIn = function(user) {
				return $http.post('/api/login', user).then(function(response) {
					auth.saveToken(response.data.token);
				}, function(err) {
					return err.data;
				})
			};

			auth.logOut = function() {
				$window.localStorage.removeItem('flapper-news-token');
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
				return $http.get('/api/usersnameemail').then(function(response) {
					return response.data;
				})
			};

			return auth;
		}])