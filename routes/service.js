var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Service = mongoose.model('Service');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* ========================================================== 
service api
============================================================ */
/* Add a service. */
router.post('/', auth, function(req, res, next) {
	var service = new Service(req.body);

	service.save(function(err, service) {
		if(err){return next(err);}
		res.json(service);
	});
});

/* GET services page. */
router.get('/', auth, function(req, res, next) {
	Service.find(function(err, services) {
		if(err){return next(err);}
		res.json(services);
	})
});

/* Preload service object */
router.param('service', function(req, res, next, id){
	var query = Service.findById(id);
	
	query.exec(function(err, service){
		if(err) {return next(err);}
		if(!service) {return next(new Error('Can\'t find service'));}

		res.service = service;
		return next();
	});
});

/* Get one service*/
router.get('/:service', auth, function(req, res){
	res.service.populate('order', function(err, service) {
		if(err) {return next(err);}
		
		res.json(service);
	})
});

/* Update a service */
router.put('/:service/edit', auth, function(req, res) {
	Service.findOneAndUpdate({_id: res.service._id}, req.body, {new:true}, function(err, service) {
		if (err) {return next(err);}
		res.json(service)
	});
});

/* Delete a service */
router.delete('/:service/delete', auth, function(req, res) {
	Service.findOne({_id: res.service._id}, function(err, service) {
		if(err) {return next(err)};
		service.remove();
	})
})

module.exports = router;
