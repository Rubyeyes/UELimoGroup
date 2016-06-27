var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Info = mongoose.model('Info');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* ========================================================== 
Info API
============================================================ */
/* GET info. */
router.get('/', function(req, res, next) {
	Info.find(function(err, info) {
		if(err){return next(err);}
		res.json(info);
	})
});

module.exports = router;
