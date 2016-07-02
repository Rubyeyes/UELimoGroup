'use strict';

angular.module('MyApp')
	.controller('FooterCtrl', ['$scope', 'Info', '$location' function($scope, Info, $location) {
		Info.getAll().then(function(res) {
			$scope.information = res;
		});

		var path = $location.path();
		if(path === '/home') {
			$scope.colorFooter = {color: 'white'};
		} else {
			$scope.colorFooter = {color: 'Black'};
		};
	}])