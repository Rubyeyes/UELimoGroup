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
/* Add a fleet. */
router.post('/', auth, function(req, res, next) {
	var fleet = new Fleet(req.body);

	fleet.save(function(err, fleet) {
		if(err){return next(err);}
		res.json(fleet);
	});
});

/* GET fleets page. */
router.get('/', auth, function(req, res, next) {
	Fleet.find(function(err, fleets) {
		if(err){return next(err);}
		res.json(fleets);
	})
});

/* Preload fleet object */
router.param('fleet', function(req, res, next, id){
	var query = Fleet.findById(id);
	
	query.exec(function(err, fleet){
		if(err) {return next(err);}
		if(!fleet) {return next(new Error('Can\'t find fleet'));}

		res.fleet = fleet;
		return next();
	});
});

/* Get one fleet*/
router.get('/:fleet', auth, function(req, res){
	res.fleet.populate('order', function(err, fleet) {
		if(err) {return next(err);}
		
		res.json(fleet);
	})
});

/* Update a fleet */
router.put('/:fleet/edit', auth, function(req, res) {
	Fleet.findOneAndUpdate({_id: res.fleet._id}, req.body, {new:true}, function(err, fleet) {
		if (err) {return next(err);}
		res.json(fleet)
	});
});

/* Delete a fleet */
router.delete('/:fleet/delete', auth, function(req, res) {
	Fleet.findOne({_id: res.post._id}, function(err, fleet) {
		if(err) {return next(err)};
		fleet.remove();
	})
})

module.exports = router;
