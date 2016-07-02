angular.module('MyApp')
	.controller('ContactCtrl', ['$scope', 'Info', function($scope, Info) {
		$scope.information = Info.info;
	}])