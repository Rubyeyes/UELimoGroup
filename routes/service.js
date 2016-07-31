var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Service = mongoose.model('Service');
var Image = mongoose.model('Image');
var multer = require('multer');
var Datauri = require('datauri');
var cloudinary = require('cloudinary');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var config = require('../config/environment/development');
config.cloudinaryConfig();


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
if(config.mode === 'dev') {

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
	            }).single('file')

} else if(config.mode === "product") {
	//multers memory storage settings
	var memoryStorage = multer.memoryStorage();
	var upload = multer({
	 storage: memoryStorage,
	 limits: {fileSize: 500000, files: 1}
	}).single('file');

}

/** API path that will upload the files */
router.post('/:service/image/upload', upload, function(req, res, next) {	
	var image = new Image();
	if(config.mode === 'dev') {
		image.url = '../../assets/image/service/' + req.file.filename;
		image.name = req.file.originalname;
		image.date = Date.now();
		image.service = res.service;
		image.save(function(err, image) {
			if(err) {return next(err)};

			res.service.images.push(image);
			res.service.save(function(err, service) {
				if(err) {return next(err)};	
			})
		}) 
	} else if(config.mode === 'product') {
		var dUri = new Datauri();

		dUri.format(req.file.originalname,req.file.buffer);
		cloudinary.uploader.upload(dUri.content, function (result) {
			image.public_id = result.public_id;
			image.url = result.url;
			image.name = req.file.originalname;
			image.date = Date.now();
			image.service = res.service;
			image.save(function(err, image) {
				if(err) {return next(err)};

				res.service.images.push(image);
				res.service.save(function(err, service) {
					if(err) {return next(err)};	
				})
			}) 
		});
	}
	console.log(image.url);

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
	Service.findOne({_id: res.service._id})
		.populate('images')
		.exec(function(err, service) {
			if(err) {return next(err)};
			const fs = require('fs');
			if(config.mode === 'dev') {	
				var img_url = 'client' + service.images[0].url.replace('../..','') ;
				fs.unlink(img_url, (err) => {
				  console.log('successfully deleted');
				});
			} else if( config.mode === 'product') {
				var img_id = service.images[0].public_id;
				cloudinary.uploader.destroy(img_id, function(result) { console.log(result) });
			}

			Image.findOne({_id: service.images[0]._id}, function(err, image) {
				if(err) {return next(err)};
				image.remove();
			})
		})
});

module.exports = router;
