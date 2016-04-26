

angular.module('FrEExApp')
	.directive('navbar', function() {
		return {
			templateUrl: '/components/navbar/navbar.html',
			restrict: 'E',
			controller: 'NavCtrl'
		};
	});

