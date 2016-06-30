var mongoose = require('mongoose');

var User = mongoose.model('User');
var Info = mongoose.model('Info');
var Fleet = mongoose.model('Fleet');
var Service = mongoose.model('Service');

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

Info.remove({}, function(err) {
	if (err) {
		console.log(err);
	} else {
		var info = new Info();	
	    info.instagram = "instagram12345678";
	    info.google_plus = "google12345678";
	    info.facebook = "facebook12345678";
	    info.weibo = "weibo12345678";
	    info.qq = "qq12345678";
	    info.wechat = "12345678abc";
	    info.email = "test@example.com";
	    info.address = "123 abc st. city, ca 12345";
	    info.phone_number = 1234567890;
	    info.company_info = "This is a test info";
	    info.company_name = "UE Limo Group";
	    info.save(function(err) {
	    	if(err){return next(err);}
	    })
	}
});

Fleet.remove({}, function(err) {
	if(err) {
		console.log(err);
	} else {
		var fleet = new Fleet();		
		fleet.brand = "Toyota" ;
		fleet.type = "Camry" ;
		fleet.description = "Nice fancy car" ;
		fleet.price = 12;
		fleet.save(function(err) {
			if(err) {return next(err);}
		}) 

		var fleet2 = new Fleet();		
		fleet2.brand = "Honda" ;
		fleet2.type = "Accord" ;
		fleet2.description = "Cheap car" ;
		fleet2.price = 9;
		fleet2.save(function(err) {
			if(err) {return next(err);}
		}) 
	}
});

Service.remove({}, function(err) {
	if(err) {
		console.log(err);
	} else {
		var service = new Service();		
		service.name = "Transfer to airport";
		service.description = "Help to pickup and drop off to LAX";
		service.price = 200;
		service.save(function(err) {
			if(err) {return next(err);}
		})
	}
})
