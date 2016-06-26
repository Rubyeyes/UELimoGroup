angular.module('MyApp')
	.controller('PostsCtrl', ['$scope', 'Posts', 'post', 'Auth', function($scope, Posts, post, Auth){
			$scope.post = post;

			$scope.isLoggedIn = Auth.isLoggedIn;

			$scope.addComment = function(){
				if($scope.body === '') {return};
				Posts.addComment(post._id, {
					body: $scope.body,
					author: 'user',
					upvotes: 0
				}).then(function(response) {
					console.log(response.data);
					$scope.post.comments.push(response.data);
				});
				$scope.body ='';
			};

			$scope.increaseUpvotes = function(comment) {
				Posts.upvoteComment(post, comment);
			};
			$scope.decreaseUpvotes = function(comment) {
				Posts.downvoteComment(post, comment);
			};
		}])
