'use strict';

angular.module('MyApp')
	.controller('NavCtrl', ['$scope', '$location', '$state', 'Auth', function($scope, $location, $state, Auth) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.currentUser = Auth.currentUser;
		$scope.isCollapsed = true;

		$scope.isAdmin = function() {
			return Auth.currentRole() === 'admin';
		}

		$scope.logOut = function() {
			Auth.logOut()
			$state.go('home');
		}

		$scope.collaps = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.isActive = function(route) {     
			return route === $location.path();
		};

	}])