angular.module('MyApp')
	.directive('navbar', function() {
		return {
			templateUrl: '/components/navbar/navbar.html',
			restrict: 'E',
			controller: 'NavCtrl'
		};
	});

