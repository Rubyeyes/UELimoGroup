angular.module('MyApp')
	.directive('usersnameemail', function($q, $timeout, Auth) {
		return {
			require: 'ngModel',
			link: function(scope, elem, sttrs, ngModel) {
				Auth.getUsersNameEmail().then(function(response) {
					var usernames = [];
					var emails =[];
					var i = 0;

					angular.forEach(response, function(value, key) {
						usernames[i] = value.username;
						emails[i] = value.email;
						i += 1;
					});

					ngModel.$asyncValidators.username = function(modeValue, viewValue) {
						if(ngModel.$isEmpty(modeValue)) {
							return $q.when();
						}

						var def = $q.defer();

						$timeout(function() {
							if(usernames.indexOf(modeValue) === -1) {
								def.resolve();
							} else {
								def.reject();
							}
						}, 2000);

						return def.promise;
					};

					ngModel.$asyncValidators.email = function(modeValue, viewValue) {
						if(ngModel.$isEmpty(modeValue)) {
							return $q.when();
						}

						var def = $q.defer();

						$timeout(function() {
							if(emails.indexOf(modeValue) === -1) {
								def.resolve();
							} else {
								def.reject();
							}
						}, 2000);

						return def.promise;
					};
				});
			}
		};
	});
