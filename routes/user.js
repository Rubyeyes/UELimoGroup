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
User API
============================================================ */
/* Preload user object */
router.param('user', function(req, res, next, id) {
	User.findById(id)
		.populate({
			path: 'orders',
			populate: {path: 'fleet'}
		})
		.populate({
			path: 'orders',
			populate: {path: 'service'}
		})
		.exec(function(err, user) {
		if(err) {return next(err);}
		if(!user) {return next(new Error('Can\'t find user'));}

		res.user = user;
		return next();
	});
});

/* Preload user by email */
router.param('user_by_email', function(req, res, next, email) {
	User.findOne({'email': email}, function(err, user_by_email) {
		if(err) {return next(err);}
		if(!user_by_email) {return next(new Error('Can\'t find user'));}

		res.user_by_email = user_by_email;
		return next();
	});
});

/* User register */
router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password || !req.body.email) {
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();

	user.username = req.body.username;
	user.setPassword(req.body.password);
	user.email = req.body.email;
	user.phone_number = req.body.phone_number;

	user.save(function(err) {
		if(err){return next(err);}

		return res.json({token: user.generateJWT()})
	});
});

/* User login */
router.post('/login', function(req, res, next) {	
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
router.get('/:user', function(req, res, next) {
	res.json(res.user);
});

router.get('/usersnameemail', function(req, res) {
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


/* Get user info by email */
router.post('/forget', function(req, res, next) {
	User.findOne({'email': req.body.email}, function(err, user) {
		if(err) {return next(err);}
		if(!user) {
			res.json({message: "Cannot find user"})
			return next();
		}

		var token = user.generateForgetPasswordToken();


        user.resetPasswordToken = token;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        user.save(function(err, user) {
        	if (err) { return next(err)}
        	console.log(user);
        });
	});
});



module.exports = router;
