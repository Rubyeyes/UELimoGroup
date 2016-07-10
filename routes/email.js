var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');

//middleware to authenticate jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* ========================================================== 
email api
============================================================ */
router.post('/', function(req, res, next) {
	// var helper = require('sendgrid').mail
	// from_email = new helper.Email(process.env.WEB_ADDRESS)
	// to_email = new helper.Email(req.body.email)
	// subject = req.body.subject
	// content = new helper.Content("text/html", req.body.content)
	// mail = new helper.Mail(from_email, subject, to_email, content)


	var mail = {
		"from": {
		    "email": process.env.WEB_ADDRESS,
		    "name": "U E Limo Group"
		},
		"content": [
		    {
		        "type": "text/html",
		        "value": req.body.content
		    }
		],
		"personalizations": [
		    {
			    "cc": [
			        {
			            "email": req.body.cc,
			        }
			    ],
			    "subject": req.body.subject,
			    "to": [
			        {
			            "email": req.body.email,
			        }
			    ]
		    }
		],
  		"subject": req.body.subject,
	};

	var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
	var request = sg.emptyRequest()
	request.method = 'POST'
	request.path = '/v3/mail/send'
	request.body = mail
	sg.API(request, function (response) {
		if(response.body) {
			return next(response.body);
		}
		res.json(response.statusCode);
	})

});

module.exports = router;