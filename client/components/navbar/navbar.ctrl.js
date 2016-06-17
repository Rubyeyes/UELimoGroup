'use strict';

angular.module('FrEExApp')
	.controller('NavCtrl', ['$scope', '$location', '$state', 'Auth', function($scope, $location, $state, Auth) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.currentUser = Auth.currentUser;
		$scope.isCollapsed = true;
		$scope.isSecondCollapsed = true;

		$scope.logOut = function() {
			Auth.logOut()
			$state.go('home');
		}

		$scope.collaps = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		$scope.secondCollaps = function() {
			$scope.isSecondCollapsed = !$scope.isSecondCollapsed;
		};

		$scope.isActive = function(route) {     
			return route === $location.path();
		};

	}])