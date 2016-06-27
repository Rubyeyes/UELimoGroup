angular.module('MyApp')
	.controller('AdminSettingCtrl', ['$scope','info', function($scope, info) {
		$scope.info = info;
	}])