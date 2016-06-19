var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* ========================================================== 
post api
============================================================ */
//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

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
	console.log(res.post);
	Post.remove({_id: res.post._id}, function(err) {
		if(err) {return next(err);}
	})
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
	console.log(res.comment);
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

/* ========================================================== 
User API
============================================================ */
/* Preload comment object */
router.param('user', function(req, res, next, id) {
	var query = User.findById(id);

	query.exec(function(err, user) {
		if(err) {return next(err);}
		if(!user) {return next(new Error('Can\'t find user'));}

		res.user = user;
		return next();
	});
});

/* User register */
router.post('/api/register', function(req, res, next) {
	if(!req.body.username || !req.body.password || !req.body.email) {
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();

	user.username = req.body.username;

	user.setPassword(req.body.password);

	user.email = req.body.email;

	user.save(function(err) {
		if(err){return next(err);}

		return res.json({token: user.generateJWT()})
	});
});

/* User login */
router.post('/api/login', function(req, res, next) {	
  if(!req.body.email || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }; 

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/* Get user info*/
router.get('/api/users/:user', function(req, res, next) {
	res.json(res.user);
});

router.get('/api/usersnameemail', function(req, res) {
	User.find({}, function(err, users) {
		var usersNameEmail = [];
		var i = 0;

		users.forEach(function(user) { 
			usersNameEmail[i] = {
				"username": user.username,
				"email": user.email
			}
			i += 1;
		});

		res.json(usersNameEmail);
	});
});

module.exports = router;