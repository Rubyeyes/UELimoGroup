var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Info = mongoose.model('Info');
var Image = mongoose.model('Image');
var multer = require('multer');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

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
		console.log(err);
		if(err) {return next(err);}
		if(!info) {return next(new Error('Can\'t find info'));}

		res.info = info;
		return next();
	});
});

/* Upload img of info */
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
            })

/** API path that will upload the files */
router.post('/:info/image/upload', upload.single('file'), function(req, res) {

	var image = new Image();
	image.name = req.file.originalname;
	image.date = Date.now();
	image.url = '../../assets/image/info/' + req.file.filename;
	image.info = res.info;
	image.save(function(err, image) {
		if(err) {return next(err)};

		res.info.images.push(image);
		res.info.save(function(err, info) {
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

/* Remove img of a info */
router.delete('/:info/image/delete', function(req, res) { 
	Info.findOne({_id: res.info._id})
		.populate('images')
		.exec(function(err, info) {
			console.log(info._id);
			if(err) {return next(err)};
			const fs = require('fs');
			var img_url = 'client' + info.images[0].url.replace('../..','') ;
			fs.unlink(img_url, (err) => {
			  if (err) throw err;
			  console.log('successfully deleted');
		});

		Image.findOne({_id: info.images[0]._id}, function(err, image) {
			if(err) {return next(err)};
			image.remove();
		})
	})
});

module.exports = router;
