var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Fleet = mongoose.model('Fleet');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* ========================================================== 
fleet api
============================================================ */

/* GET posts page. */
router.get('/', function(req, res, next) {
	Fleet.find(function(err, fleets) {
		if(err){return next(err);}
		res.json(fleets);
	})
});

module.exports = router;
