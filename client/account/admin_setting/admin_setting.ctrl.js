angular.module('MyApp')
	.controller('AdminSettingCtrl', ['$scope', 'Info', function($scope, Info) {
		$scope.information = Info.info;

		$scope.updateInfo = {};
		$scope.editing = false;

		$scope.enableInfoEdit = function() {
			$scope.editing = true;
			$scope.updateInfo = $scope.information;
		};

		$scope.disableInfoEdit = function() {
			$scope.editing = false;
		};

		$scope.saveInfo = function(updateInfo) {
			Info.update(updateInfo);
			$scope.disableInfoEdit();
		};
	}])