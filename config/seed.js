var mongoose = require('mongoose');

var User = mongoose.model('User');

User.remove({}, function(err) {
	if (err) {
		console.log(err);
	} else {
		var user1 = new User();
		user1.username = 'Test User';
		user1.email = 'test@example.com';
		user1.role = 'user';
		user1.setPassword('test');
		user1.save(function(err) {
			if(err){return next(err);}
		});

		var admin = new User();
		admin.username =  'Admin';
		admin.email = 'admin@example.com';
		admin.role = 'admin';
		admin.setPassword('admin');
		admin.save(function(err) {
			if(err){return next(err);}
		});
	}
});