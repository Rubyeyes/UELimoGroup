'use strict';

angular.module('MyApp')
	.controller('FooterCtrl', ['$scope', 'Info', '$location', function($scope, Info, $location) {
		Info.getAll().then(function(res) {
			$scope.information = res;
		});

		$scope.$on('$stateChangeSuccess',function(){
	        var path = $location.path();
			if(path == '/home') {
				$scope.colorFooter = {color: 'white'};
				$scope.footPosition = {			
				    position: 'fixed',
				    bottom: 0,
				    width: '100%'
				}		
			} else if(path == '/login' || '/register') {				
				$scope.colorFooter = {color: 'black'};	
			} else {
				$scope.colorFooter = {color: 'black'};
				$scope.footPosition = {			
				    position: 'relative'
				}
			};
	    });

	}])