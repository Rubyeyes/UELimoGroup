var mongoose = require('mongoose');

//create a new schema
var FleetSchema = new mongoose.Schema({
	brand: String,
	type: String,
	description: String,
	price: Number,
	price_day: Number,
	price_day_out: Number,
	price_mile: Number,
	initial_fee: Number,
	orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
	images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}]
});

mongoose.model('Fleet', FleetSchema);