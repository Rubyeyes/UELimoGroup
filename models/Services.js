var mongoose = require('mongoose');

//create a new schema
var ServiceSchema = new mongoose.Schema({
	name: String,
	description: String,
	price: Number,
	order: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
});

mongoose.model('Service', ServiceSchema);