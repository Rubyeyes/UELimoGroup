'use strict';

angular.module('MyApp')
	.controller('FooterCtrl', ['$scope', 'Info', function($scope, Info) {
		Info.getAll().then(function(res) {
			$scope.information = res;
		});
	}])