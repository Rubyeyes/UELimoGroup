var mongoose = require('mongoose');

//create a new schema
var OrderSchema = new mongoose.Schema({
	username: String,
	email: String,
	phone_number: Number,
	date: Date,
	people: Number,
	user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	service: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
	fleet: [{type: mongoose.Schema.Types.ObjectId, ref: 'Fleet'}],
});

mongoose.model('Order', OrderSchema);