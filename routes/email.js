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
router.post('/', auth, function(req, res, next) {
	console.log(req.body);
	var helper = require('sendgrid').mail
	from_email = new helper.Email(process.env.WEB_ADDRESS)
	to_email = new helper.Email(req.body.cc)
	subject = req.body.subject
	content = new helper.Content("text/html", req.body.content)
	mail = new helper.Mail(from_email, subject, to_email, content)
	console.log(mail);

	var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
	var requestBody = mail.toJSON()
	console.log(requestBody);
	var request = sg.emptyRequest()
	request.method = 'POST'
	request.path = '/v3/mail/send'
	request.body = requestBody
	sg.API(request, function (response) {
		// console.log(response.statusCode)
		// console.log(response.body)
		// console.log(response.headers)
		if(response.body) {
			return next(response.body);
		}
		res.json(response.statusCode);
	})

});

module.exports = router;