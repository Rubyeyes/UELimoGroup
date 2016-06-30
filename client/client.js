angular.module('MyApp', [
			'ui.router',
			'ui.bootstrap',
			'validation.match',
			'ngFileUpload'
		])
		.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: '/home/home.html',
					controller: 'MainCtrl',
					resolve: {
						postPromise: ['Posts', function(Posts) {
							return Posts.getAll();
						}]
					}
				})
				.state('posts', {
					url: '/posts/{id}',
					templateUrl: '/home/posts.html',
					controller: 'PostsCtrl',
					resolve: {
						post: ['Posts', '$stateParams', function(Posts, $stateParams) {
							return Posts.get($stateParams.id);
						}]
					}	
				})
				.state('login', {
					url: '/login',
					templateUrl: '/account/auth/login.html',
					controller: 'AuthCtrl',
					onEnter: ['$state', 'Auth', function($state, Auth) {
						if(Auth.isLoggedIn()) {
							$state.go('home');
						}
					}]
				})
				.state('register', {
					url: '/register',
					templateUrl: '/account/auth/register.html',
					controller: 'AuthCtrl',
					onEnter: ['$state', 'Auth', function($state, Auth) {
						if(Auth.isLoggedIn()) {
							$state.go('home');
						}
					}]
				})
				.state('profile', {
					url: '/profile',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavSecondCtrl',
							resolve: {
								user: ['Auth', function(Auth) {
									return Auth.getUserInfo();
								}]
							}
						},
						"": {
							templateUrl: '/account/profile/profile.html',
							controller: 'ProfileCtrl',
							resolve: {
								user: ['Auth', function(Auth) {
									return Auth.getUserInfo();
								}]
							}		
						}
					},
				    onEnter: ['$state', 'Auth',function($state, Auth){
				    	Auth.getUserInfo().then(function(response) {
				       		if (response.role === 'admin') {
				       			$state.transitionTo('admin_setting');	
				       		}
				    	})
				    }]
				})
				.state('dashboard', {
					url: '/dashboard',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavSecondCtrl',
							resolve: {
								user: ['Auth', function(Auth) {
									return Auth.getUserInfo();
								}]
							}	
						},
						"": {
							templateUrl: '/account/dashboard/dashboard.html'	
						}
					},
				    onEnter: ['$state', 'Auth',function($state, Auth){
				    	Auth.getUserInfo().then(function(response) {
				       		if (response.role === 'admin') {
				       			$state.transitionTo('admin_setting');	
				       		}
				    	})
				    }]
				})
				.state('history', {
					url: '/history',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavSecondCtrl',
							resolve: {
								user: ['Auth', function(Auth) {
									return Auth.getUserInfo();
								}]
							}	
						},
						"": {
							templateUrl: '/account/history/history.html',
						}
					},
				    onEnter: ['$state', 'Auth',function($state, Auth){
				    	Auth.getUserInfo().then(function(response) {
				       		if (response.role === 'admin') {
				       			$state.transitionTo('admin_setting');	
				       		}
				    	})
				    }]
				})
				.state('admin_setting', {
					url: '/admin_setting',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavSecondCtrl',
							resolve: {
								user: ['Auth', function(Auth) {
									return Auth.getUserInfo();
								}]
							}	
						},
						"": {
							templateUrl: '/account/admin_setting/admin_setting.html',
							controller: 'AdminSettingCtrl',
							resolve: {
								infoPromise: ['Info', function(Info) {
									return Info.getAll();
								}],
								fleetPromise: ['Fleet', function(Fleet) {
									return Fleet.getAll();
								}],
								servicePromise: ['Service', function(Service) {
									return Service.getAll();
								}]
							}		
						},
					},
				    onEnter: ['$state', 'Auth',function($state, Auth){
				    	Auth.getUserInfo().then(function(response) {
				       		if (response.role === 'user') {
				       			$state.transitionTo('profile');	
				       		}
				    	})
				    }]
				})
				.state('admin_data', {
					url: '/admin_data',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavSecondCtrl',
							resolve: {
								user: ['Auth', function(Auth) {
									return Auth.getUserInfo();
								}]
							}	
						},
						"": {
							templateUrl: '/account/admin_data/admin_data.html'	
						}
					},
				    onEnter: ['$state', 'Auth',function($state, Auth){
				    	Auth.getUserInfo().then(function(response) {
				       		if (response.role === 'user') {
				       			$state.transitionTo('profile');	
				       		}
				    	})
				    }]
				});

			$urlRouterProvider.otherwise('home');
		    //user html5 route mode
		    $locationProvider.html5Mode(true);
		}])
		
		
		