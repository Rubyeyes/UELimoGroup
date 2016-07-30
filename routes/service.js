var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Service = mongoose.model('Service');
var Image = mongoose.model('Image');
var multer = require('multer');

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
router.get('/', function(req, res, next) {
	Service.find({})
		.populate('images')
		.populate('orders')
		.exec(function(err, services) {
			if(err){return next(err);}
			res.json(services);}
		);
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
router.get('/:service', function(req, res){
	
	res.service.populate('orders')
			.populate('images')
			.exec(function(err, service) {
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

/* Upload img of service */
//multers disk storage settings
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, './client/assets/image/service/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage
            })

/** API path that will upload the files */
router.post('/:service/image/upload', upload.single('file'), function(req, res) {

	var image = new Image();
	image.name = req.file.originalname;
	image.date = Date.now();
	image.url = '../../assets/image/service/' + req.file.filename;
	image.service = res.service;
	image.save(function(err, image) {
		if(err) {return next(err)};

		res.service.images.push(image);
		res.service.save(function(err, service) {
			if(err) {return next(err)};	
		})
	}) 

    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json(image);
    })   

});

/* Remove img of a service */
router.delete('/:service/image/delete', function(req, res) { 
	console.log(res.service._id); 
	Fleet.findOne({_id: res.service._id})
		.populate('images')
		.exec(function(err, service) {
		console.log(service._id);
		if(err) {return next(err)};
		const fs = require('fs');
		var img_url = 'client' + service.images[0].url.replace('../..','') ;
		fs.unlink(img_url, (err) => {
		  if (err) throw err;
		  console.log('successfully deleted');
		});

		Image.findOne({_id: service.images[0]._id}, function(err, image) {
			if(err) {return next(err)};
			image.remove();
		})
	})
});

module.exports = router;
