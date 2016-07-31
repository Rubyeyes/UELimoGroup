angular.module('MyApp')
	.controller('FleetsCtrl', ['$scope', 'Fleet', 'Info', 'Share', '$state', function($scope, Fleet, Info, Share, $state) {
		$scope.fleets = Fleet.fleets;
		$scope.information = Info.info;

		$scope.reserve = function(fleet) {
			Share.setFleet(fleet._id);
			$state.go('reserve');
		}
	}])