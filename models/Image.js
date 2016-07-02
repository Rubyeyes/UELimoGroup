var mongoose = require('mongoose');

//create a new schema
var ImageSchema = new mongoose.Schema({
	name: String,
	date: Date,
	url: String,
	fleet: [{type: mongoose.Schema.Types.ObjectId, ref: 'Fleet'}],
	service: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}]
});

mongoose.model('Image', ImageSchema);