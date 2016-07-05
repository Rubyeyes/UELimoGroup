var mongoose = require('mongoose');
var Fleet = mongoose.model('Fleet');
var Service = mongoose.model('Service');

//create a new schema
var ImageSchema = new mongoose.Schema({
	name: String,
	date: Date,
	url: String,
	fleet: [{type: mongoose.Schema.Types.ObjectId, ref: 'Fleet'}],
	service: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}]
});

ImageSchema.pre('remove', function(next) {
	if (this.fleet[0]) {
		Fleet.update(
				{_id: this.fleet[0]._id},
				{$pull: {"images": {_id: this._id}}}
			);
	}

	if (this.service[0]) {
		Service.update(
				{_id: this.service[0]._id},
				{$pull: {"services": {_id: this._id}}}
			);
	}

	next();
});

mongoose.model('Image', ImageSchema);