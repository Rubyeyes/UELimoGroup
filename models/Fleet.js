var mongoose = require('mongoose');

//create a new schema
var FleetSchema = new mongoose.Schema({
	brand: String,
	type: String,
	description: String,
	price: Number,
	order: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
});

mongoose.model('Fleet', FleetSchema);