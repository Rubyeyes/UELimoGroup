angular.module('MyApp')
	.factory('Posts', ['$http', 'Auth',  function($http, Auth){
			var o = {
				posts:[]
			};

			//get all posts
			o.getAll = function() {
				return $http.get('/api/posts', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					angular.copy(response.data, o.posts);
				});
			};
			//add new post
			o.create = function(post) {
				return $http.post('/api/posts', post, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					o.posts.push(response.data);
				});
			};
			//update a post
			o.update = function(post, updatePost, index) {
				return $http.put('/api/posts/' + post._id + '/edit', updatePost).then(function(response) {
					angular.copy(response.data, o.posts[index]);
				});
			};
			//remove a post
			o.delete = function(post, index) {
				return $http.delete('/api/posts/' + post._id + '/delete')
			}; 
			//upvote a post
			o.upvotePost = function(post) {
				return $http.get('/api/posts/' + post._id + '/upvote', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					post.upvotes += 1;
				});
			};
			//downvote a post
			o.downvotePost = function(post) {
				return $http.get('/api/posts/' + post._id + '/downvote', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					post.upvotes -= 1;
				});
			};
			//get a single post
			o.get = function(id) {
				return $http.get('/api/posts/' + id).then(function(res) {
					return res.data
				});
			};
			//add a comment to post
			o.addComment = function(id, comment) {
				return $http.post('/api/posts/' + id +'/comments', comment, {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				});
			};
			//upvote a comment
			o.upvoteComment = function(post, comment) {
				return $http.get('/api/posts/' + post._id + '/comments/' + comment._id + '/upvote', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					comment.upvotes += 1;
				});
			};
			//downvote a comment
			o.downvoteComment = function(post, comment) {
				return $http.get('/api/posts/' + post._id + '/comments/' + comment._id + '/downvote', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				}).then(function(response) {
					comment.upvotes -= 1;
				});
			};
			return o;
		}])
