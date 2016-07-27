'use strict';

angular.module('MyApp')
	.controller('NavCtrl', ['$scope', '$location', '$state', 'Auth', 'tmhDynamicLocale', '$translate', 
					function($scope, $location, $state, Auth, tmhDynamicLocale, $translate) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.currentUser = Auth.currentUser;
		$scope.isCollapsed = true;

		$scope.isAdmin = function() {
			return Auth.currentRole() === 'admin';
		}

		$scope.logOut = function() {
			Auth.logOut()
			$state.go('home');
		}

		$scope.collaps = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.isActive = function(route) {     
			return route === $location.path();
		};

		$scope.locales = [
			{name: 'English', id: 'en'},
			{name: '简体中文', id: 'zh-cn'}
		];

		$scope.locale = 'en';

		// STORING CURRENT LOCALE
	    var currentLocale = $translate.proposedLanguage();// because of async loading
	    
		$scope.updateLocale = function(locale) {
			tmhDynamicLocale.set(locale);
			currentLocale = locale;// updating current locale

			// asking angular-translate to load and apply proper translations
			$translate.use(locale);
		};

	    

	}])