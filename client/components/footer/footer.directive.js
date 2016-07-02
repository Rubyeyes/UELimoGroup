angular.module('MyApp')
	.directive('footer', function() {
		return {
			templateUrl: '/components/footer/footer.html',
			restrict: 'E',
			controller: 'FooterCtrl'
		};
	});