var mongoose = require('mongoose');

//create a new schema
var OrderSchema = new mongoose.Schema({
	time: Date,
	user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	service: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
	fleet: [{type: mongoose.Schema.Types.ObjectId, ref: 'Fleet'}],
});

mongoose.model('Order', OrderSchema);