var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Fleet = mongoose.model('Fleet');
var Image = mongoose.model('Image');
var multer = require('multer');
var Datauri = require('datauri');
var cloudinary = require('cloudinary');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
// import environment configuration
var config = require('../config/environment/development');
config.cloudinaryConfig();


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
router.get('/', function(req, res, next) {
	Fleet.find({})
		.populate('images')
		.populate('orders')
		.exec(function(err, fleets) {
			if(err){return next(err);}
			res.json(fleets);}
		);
});

/* Preload fleet object */
router.param('fleet', function(req, res, next, id, file){
	var query = Fleet.findById(id);
	
	query.exec(function(err, fleet){
		if(err) {return next(err);}
		if(!fleet) {return next(new Error('Can\'t find fleet'));}

		res.fleet = fleet;
		return next();
	});
});

/* Get one fleet*/
router.get('/:fleet', function(req, res){
	Fleet.findById(res.fleet._id)
			.populate('images')
			.populate('orders')
			.exec(function(err, fleet) {
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
	Fleet.findOne({_id: res.fleet._id}, function(err, fleet) {
		if(err) {return next(err)};
		fleet.remove();
	})
})

/* Upload img of fleet */
if(config.mode === 'dev') {

	//multers disk storage settings
	var storage = multer.diskStorage({ 
	    destination: function (req, file, cb) {
	        cb(null, './client/assets/image/fleet/')
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
router.post('/:fleet/image/upload', upload, function(req, res, next) {	
	var image = new Image();
	if(config.mode === 'dev') {
		image.url = '../../assets/image/fleet/' + req.file.filename;
		image.name = req.file.originalname;
		image.date = Date.now();
		image.fleet = res.fleet;
		image.save(function(err, image) {
			if(err) {return next(err)};

			res.fleet.images.push(image);
			res.fleet.save(function(err, fleet) {
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
			image.fleet = res.fleet;
			image.save(function(err, image) {
				if(err) {return next(err)};

				res.fleet.images.push(image);
				res.fleet.save(function(err, fleet) {
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


/* Remove img of a fleet */
router.delete('/:fleet/image/delete', function(req, res) { 
	Fleet.findOne({_id: res.fleet._id})
		.populate('images')
		.exec(function(err, fleet) {
			if(err) {return next(err)};
			const fs = require('fs');
			if(config.mode === 'dev') {	
				var img_url = 'client' + fleet.images[0].url.replace('../..','') ;
				fs.unlink(img_url, (err) => {
				  console.log('successfully deleted');
				});
			} else if( config.mode === 'product') {
				var img_id = fleet.images[0].public_id;
				cloudinary.uploader.destroy(img_id, function(result) { console.log(result) });
			}

			Image.findOne({_id: fleet.images[0]._id}, function(err, image) {
				if(err) {return next(err)};
				image.remove();
			})
		})
});

module.exports = router;
