'use strict';

angular.module('MyApp')
	.controller('FooterCtrl', ['$scope', 'Info', '$location', function($scope, Info, $location) {
		Info.getAll().then(function(res) {
			$scope.information = res;
		});

		$scope.$on('$stateChangeSuccess',function(){
	        var path = $location.path();
			if(path === '/home' || path === '/login' || path ==='/register' || path === '/profile' || path === "/about" || path === "/contact") {
				if (path == '/home') {
					$scope.colorFooter = {color: 'white'};
				} else {
					$scope.colorFooter = {color: 'black'};
				}
				$scope.footPosition = {			
				    position: 'fixed',
				    bottom: 0,
				    width: '100%'
				}		
			} else {
				$scope.colorFooter = {color: 'black'};
				$scope.footPosition = {			
				    position: 'relative'
				}
			};
	    });

	}])