'use strict';

angular.module('FrEExApp')
	.controller('NavCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.currentUser = Auth.currentUser;
		$scope.logOut = Auth.logOut;
		$scope.isCollapsed = true;
		$scope.isSecondCollapsed = true;

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