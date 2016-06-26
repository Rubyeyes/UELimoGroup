var mongoose = require('mongoose');
//create a new schema
var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	upvotes: {type: Number, default: 0},
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

//setup method
CommentSchema.methods.upvote = function(cb) {
	this.upvotes += 1;
	this.save(cb);
}

CommentSchema.methods.downvote = function(cb) {
	this.upvotes -= 1;
	this.save(cb);
}

mongoose.model('Comment', CommentSchema);