/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
 
var cloudinary = require('cloudinary');

var cloudinaryConfig = function() {
	cloudinary.config({ 
	  cloud_name: 'hnfdsuzvw', 
	  api_key: '681557681273417', 
	  api_secret: '-TGwkPeb_jukrpuaox9Pi7f8Yjs' 
	});
}

module.exports = {
	seedDB: false,
	mode: 'product',
	cloudinaryConfig
}

