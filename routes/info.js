var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Info = mongoose.model('Info');
var Image = mongoose.model('Image');
var multer = require('multer');
var Datauri = require('datauri');
var cloudinary = require('cloudinary');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var config = require('../config/environment/development');
config.cloudinaryConfig();

/* ========================================================== 
Info API
============================================================ */
/* GET info. */
router.get('/', function(req, res, next) {
	Info.findOne({'type': 'info'})
		.populate('images')
		.exec(function(err, info) {
			if(err){return next(err);}
			res.json(info);
		});
});

router.put('/', function(req, res) {
	var oldInfo = Info.update({'type': 'info'}, req.body, function(err) {
		if(err) {return next(err);}
	});
});

/* Preload info object */
router.param('info', function(req, res, next, id, file){
	var query = Info.findById(id);
	
	query.exec(function(err, info){
		if(err) {return next(err);}
		if(!info) {return next(new Error('Can\'t find info'));}

		res.info = info;
		return next();
	});
});

/* Upload img of info */
if(config.mode === 'dev') {

	//multers disk storage settings
	var storage = multer.diskStorage({ 
	    destination: function (req, file, cb) {
	        cb(null, './client/assets/image/info/')
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
	 limits: {fileSize: 5000000, files: 1}
	}).single('file');

}

/** API path that will upload the files */
router.post('/:info/image/upload', upload, function(req, res, next) {	
	var image = new Image();
	if(config.mode === 'dev') {
		image.url = '../../assets/image/info/' + req.file.filename;
		image.name = req.file.originalname;
		image.date = Date.now();
		image.info = res.info;
		image.save(function(err, image) {
			if(err) {return next(err)};

			res.info.images.push(image);
			res.info.save(function(err, info) {
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
			image.info = res.info;
			image.save(function(err, image) {
				if(err) {return next(err)};

				res.info.images.push(image);
				res.info.save(function(err, info) {
					if(err) {return next(err)};	
				})
			}) 
		});
	}

    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json(image);
    })   

});


/* Remove img of a info */
router.delete('/:info/image/delete', function(req, res) { 
	Info.findOne({_id: res.info._id})
		.populate('images')
		.exec(function(err, info) {
			if(err) {return next(err)};
			const fs = require('fs');
			if(config.mode === 'dev') {	
				var img_url = 'client' + info.images[0].url.replace('../..','') ;
				fs.unlink(img_url, (err) => {
				  console.log('successfully deleted');
				});
			} else if( config.mode === 'product') {
				var img_id = info.images[0].public_id;
				cloudinary.uploader.destroy(img_id, function(result) { console.log(result) });
			}

			Image.findOne({_id: info.images[0]._id}, function(err, image) {
				if(err) {return next(err)};
				image.remove();
			})
		})
});

module.exports = router;
