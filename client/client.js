angular.module('FrEExApp', [
			'ui.router',
			'ui.bootstrap',
			'validation.match'
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
							controller: 'NavCtrl',
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
					}
				})
				.state('career', {
					url: '/career',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavCtrl',
						},
						"": {
							templateUrl: '/account/career/career.html'	
						}
					}
				})
				.state('dashboard', {
					url: '/dashboard',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavCtrl',
						},
						"": {
							templateUrl: '/account/dashboard/dashboard.html'	
						}
					}
				})
				.state('data', {
					url: '/data',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavCtrl',
						},
						"": {
							templateUrl: '/account/data/data.html'	
						}
					}
				})
				.state('inbox', {
					url: '/inbox',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavCtrl',
						},
						"": {
							templateUrl: '/account/inbox/inbox.html'	
						}
					}
				})
				.state('missions', {
					url: '/missions',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavCtrl',
						},
						"": {
							templateUrl: '/account/missions/missions.html'	
						}
					}
				})
				.state('setting', {
					url: '/setting',
					views: {
						"navsecond": {
							templateUrl: 'components/navbar/navbarSecond.html',
							controller: 'NavCtrl',
						},
						"": {
							templateUrl: '/account/setting/setting.html'	
						}
					}
				});

			$urlRouterProvider.otherwise('home');
		    //user html5 route mode
		    $locationProvider.html5Mode(true);
		}])
		
		
		