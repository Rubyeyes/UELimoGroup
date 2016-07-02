var mongoose = require('mongoose');

//create a new schema
var ServiceSchema = new mongoose.Schema({
	name: String,
	description: String,
	price: Number,
	orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
	images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],
});

mongoose.model('Service', ServiceSchema);