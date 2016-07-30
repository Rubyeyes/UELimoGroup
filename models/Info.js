var mongoose = require('mongoose');

//create a new schema
var InfoSchema = new mongoose.Schema({
	company_info: String,
	phone_number: String,
	address: String,
	email: String,
	wechat: String,
	qq: String,
	weibo: String,
	facebook: String,
	google_plus: String,
	instagram: String,

	sales:String,
	daily:String,
	images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],

	type:String	
});

mongoose.model('Info', InfoSchema);