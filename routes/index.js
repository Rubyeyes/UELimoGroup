var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* ========================================================== 
email api
============================================================ */
router.post('/api/email', auth, function(req, res, next) {
	var helper = require('sendgrid').mail
	from_email = new helper.Email(process.env.WEB_ADDRESS)
	to_email = new helper.Email("catian315@gmail.com")
	subject = req.body.subject
	content = new helper.Content("text/plain", req.body.content)
	mail = new helper.Mail(from_email, subject, to_email, content)

	var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
	var requestBody = mail.toJSON()
	var request = sg.emptyRequest()
	request.method = 'POST'
	request.path = '/v3/mail/send'
	request.body = requestBody
	sg.API(request, function (response) {
		// console.log(response.statusCode)
		// console.log(response.body)
		// console.log(response.headers)
		if(response.body) {
			return next(response.body);
		}
		res.json(response.statusCode);
	})

});

/* ========================================================== 
post api
============================================================ */

/* Add a post. */
router.post('/api/posts', auth, function(req, res, next) {
	var post = new Post(req.body);
	post.author = req.payload.username;

	post.save(function(err, post) {
		if(err){return next(err);}
		res.json(post);
	});
});

/* GET posts page. */
router.get('/api/posts', function(req, res, next) {
	Post.find(function(err, posts) {
		if(err){return next(err);}
		res.json(posts);
	})
});

/* Preload post object */
router.param('post', function(req, res, next, id){
	var query = Post.findById(id);
	
	query.exec(function(err, post){
		if(err) {return next(err);}
		if(!post) {return next(new Error('Can\'t find post'));}

		res.post = post;
		return next();
	});
});

/* Get one post*/
router.get('/api/posts/:post', function(req, res){
	res.post.populate('comments', function(err, post) {
		if(err) {return next(err);}
		
		res.json(post);
	})
});

/* Update a post */
router.put('/api/posts/:post/edit', function(req, res) {
	var newPost = req.body;

	res.post.title = newPost.title;
	res.post.link = newPost.link;

	res.post.save(function(err, post) {
		if (err) {return next(err);}

		res.json(post);
	});
});

/* Delete a post */
router.delete('/api/posts/:post/delete', function(req, res) {
	Post.findOne({_id: res.post._id}, function(err, post) {
		if(err) {return next(err)};
		post.remove();
	})
	// Post.remove({_id: res.post._id}, function(err) {
	// 	if(err) {return next(err);}
	// })
})

/* Upvote the post */
router.get('/api/posts/:post/upvote', auth, function(req, res) {
	res.post.upvote(function(err, post) {
		if (err) {return next(err);}

		res.json(post);
	});
});

/* Downvote the post */
router.get('/api/posts/:post/downvote', auth, function(req, res) {
	res.post.downvote(function(err, post) {
		if (err) {return next(err);}

		res.json(post);
	});
});

/* ========================================================== 
Comment API
============================================================ */
/* Add a comment for a post */
router.post('/api/posts/:post/comments', auth, function(req, res) {
	var comment = new Comment(req.body);
	comment.post = res.post;
	comment.author = req.payload.username;

	comment.save(function(err, comment) {
		if(err) {return next(err);}

		res.post.comments.push(comment);
		res.post.save(function(err, post) {
			if(err) {return next(err);}

			res.json(comment);
		});
	});
});

/* Preload comment object */
router.param('comment', function(req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function(err, comment) {
		if(err) {return next(err);}
		if(!comment) {return next(new Error('Can\'t find comment'));}

		res.comment = comment;
		return next();
	});
});

/* Upvote the comment */
router.get('/api/posts/:post/comments/:comment/upvote', auth, function(req, res) {
	res.comment.upvote(function(err, comment) {
		if(err) {return next(err);}

		res.json(comment);
	});
});

/* Downvote the comment */
router.get('/api/posts/:post/comments/:comment/downvote', auth, function(req, res) {
	res.comment.downvote(function(err, comment) {
		if(err) {return next(err);}

		res.json(comment);
	});
});


module.exports = router;
