var mongoose = require('mongoose');

var Comment = mongoose.model('Comment');

//create a new schema
var PostSchema = new mongoose.Schema({
	title: String,
	link: String,
	upvotes: {type: Number, default: 0},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.pre('remove', function(next) {
	Comment.remove({post: this._id}).exec();
	next();
});

//setup method
PostSchema.methods.upvote = function(cb) {
	this.upvotes += 1;
	this.save(cb);
};

PostSchema.methods.downvote = function(cb) {
	this.upvotes -= 1;
	this.save(cb);
};

mongoose.model('Post', PostSchema);