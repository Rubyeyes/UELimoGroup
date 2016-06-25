angular.module('FrEExApp')
	.controller('MainCtrl',  ['$scope', 'Posts', 'Email', 'Auth', function($scope, Posts, Email, Auth) {
			$scope.test = 'Hello World!';

			$scope.posts = Posts.posts;

			$scope.isLoggedIn = Auth.isLoggedIn;

			$scope.addPost = function() {
				if(!$scope.title || $scope.title === ''){return};
				Posts.create({
					title: $scope.title,
					link: $scope.link,
				});
				$scope.title = '';
				$scope.link = '';
			};

			$scope.increaseUpvotes = function(post) {
				Posts.upvotePost(post);
			};
			$scope.decreaseUpvotes = function(post) {
				Posts.downvotePost(post);
			};

			//Post edit
			$scope.updatePost = {};
			$scope.editing = []; 
			$scope.enablePostEdit = function(post, $index) {
				$scope.editing[$index] = true;
				$scope.updatePost.title = post.title;
				$scope.updatePost.link = post.link;
			};
			$scope.disablePostEdit = function($index) {
				$scope.editing[$index] = false;
			};
			$scope.savePost = function(post, updatePost, $index) {
				Posts.update(post, updatePost, $index);
				$scope.disablePostEdit($index);
			};
			$scope.removePost = function(post, $index) {
				Posts.delete(post, $index);
				$scope.posts.splice($index, 1);
				$scope.disablePostEdit($index);
			};

			//Send email
			$scope.sendEmail = function() {
				Email.sendEmail({	
					subject: $scope.subject,
					content: $scope.content
				});	
				$scope.subject = '';
				$scope.content = '';
			}
		}])
