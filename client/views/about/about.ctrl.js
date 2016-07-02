angular.module('MyApp')
	.controller('AboutCtrl', ['$scope', 'Info', function($scope, Info) {
		$scope.information = Info.info;
	}])