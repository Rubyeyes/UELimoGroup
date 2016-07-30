var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var Fleet = mongoose.model('Fleet');
var Image = mongoose.model('Image');
var multer = require('multer');

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
	res.fleet.populate('orders')
			.populate('images')
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
	Fleet.findOne({_id: res.post._id}, function(err, fleet) {
		if(err) {return next(err)};
		fleet.remove();
	})
})

/* Upload img of fleet */
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
            })

/** API path that will upload the files */
router.post('/:fleet/image/upload', upload.single('file'), function(req, res) {

	var image = new Image();
	image.name = req.file.originalname;
	image.date = Date.now();
	image.url = '../../assets/image/fleet/' + req.file.filename;
	image.fleet = res.fleet;
	image.save(function(err, image) {
		if(err) {return next(err)};

		res.fleet.images.push(image);
		res.fleet.save(function(err, fleet) {
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

/* Remove img of a fleet */
router.delete('/:fleet/image/delete', function(req, res) { 
	console.log(res.fleet._id); 
	Fleet.findOne({_id: res.fleet._id})
		.populate('images')
		.exec(function(err, fleet) {
		console.log(fleet._id);
		if(err) {return next(err)};
		const fs = require('fs');
		var img_url = 'client' + fleet.images[0].url.replace('../..','') ;
		fs.unlink(img_url, (err) => {
		  if (err) throw err;
		  console.log('successfully deleted');
		});

		Image.findOne({_id: fleet.images[0]._id}, function(err, image) {
			if(err) {return next(err)};
			image.remove();
		})
	})
});

module.exports = router;
