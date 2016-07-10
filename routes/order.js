var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Fleet = mongoose.model('Fleet');
var Service = mongoose.model('Service');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* ========================================================== 
order api
============================================================ */
/* Add a order. */
router.post('/', function(req, res, next) {
	var order = new Order(req.body);

	order.save(function(err, order) {
		if(err){return next(err);}

		if(order.user[0]) {			
			user = User.findById(order.user[0]).exec(function(err, user) {
				user.orders.push(order);
				user.save(function(err) {
					if(err) {return next(err);}
				});
			});
		}

		res.json(order);
	});
});

/* GET all orders page. */
router.get('/', function(req, res, next) {
	Order.find({})
		.populate('fleet')
		.populate('service')
		.exec(function(err, orders) {
			if(err){return next(err);}
			res.json(orders);}
		);
});


/* Preload order object */
router.param('order', function(req, res, next, id, file){
	var query = Order.findById(id);
	
	query.exec(function(err, order){
		if(err) {return next(err);}
		if(!order) {return next(new Error('Can\'t find order'));}

		res.order = order;
		return next();
	});
});

/* Get one order*/
router.get('/:order', function(req, res){
	res.order
		.populate('fleet')
		.populate('service')
		.exec(function(err, order) {
			if(err){return next(err);}
			res.json(order);}
		);
});

/* Update a order */
router.put('/:order/edit', auth, function(req, res) {
	Order.findOneAndUpdate({_id: res.order._id}, req.body, {new:true}, function(err, order) {
		if (err) {return next(err);}
		res.json(order)
	});
});

/* Delete a order */
router.delete('/:order/delete', auth, function(req, res) {
	Order.findOne({_id: res.post._id}, function(err, order) {
		if(err) {return next(err)};
		order.remove();
	})
})


module.exports = router;
