var mongoose = require('mongoose');

//create a new schema
var InfoSchema = new mongoose.Schema({
	company_info: String,
	phone_number: Number,
	address: String,
	email: String,
	wechat: String,
	qq: String,
	weibo: String,
	facebook: String,
	google_plus: String,
	instagram: String,
});

mongoose.model('Info', InfoSchema);