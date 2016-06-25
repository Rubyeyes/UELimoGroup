/* 
	Middleware help to 
	complex validation
	removing dependent documents
	(removing a user removes all his blogposts)
	asynchronous defaults
	asynchronous tasks that a certain action triggers
	triggering custom events
	notifications
*/

var mongoose = require('mongoose');
var Post = require('./Posts');
var Comment = require('./Comments');

console.log(PostSchema);

Post.pre('remove', function() {
	Comment.remove({post: this._id}).exec();
	next();
});