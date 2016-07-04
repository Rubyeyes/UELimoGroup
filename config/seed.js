var mongoose = require('mongoose');

var User = mongoose.model('User');
var Info = mongoose.model('Info');
var Fleet = mongoose.model('Fleet');
var Service = mongoose.model('Service');
var Image = mongoose.model('Image');
var Order = mongoose.model('Order');

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

		var user2 = new User();
		user2.username = 'Alan';
		user2.email = 'catian315@gmail.com';
		user2.role = 'user';
		user2.setPassword('test');
		user2.save(function(err) {
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
	    info.instagram = "http://www.instagram.com";
	    info.google_plus = "https://plus.google.com/";
	    info.facebook = "http://www.facebook.com";
	    info.weibo = "http://www.weibo.com";
	    info.qq = "http://w.qq.com/";
	    info.wechat = "https://web.wechat.com/";
	    info.email = "test@example.com";
	    info.address = "123 abc st. city, ca 12345";
	    info.phone_number = "+1-234-567-8901";
	    info.company_info = "The 2016 Escalade and Escalade ESV are a perfect combination of sophistication, functionality and technology. At home on all roads, they deliver powerful performance when you need it. Created with craftsmanship not seen in other SUVs, the refined lines and features make one thing immediately apparent – it is first and foremost a Cadillac.";
	    info.company_name = "UE Limo Group";
	    info.save(function(err) {
	    	if(err) {return next(err);}
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
		fleet.price_day = 120;
		fleet.save(function(err) {
			if(err) {return next(err);}
		}) 

		var fleet2 = new Fleet();		
		fleet2.brand = "Honda" ;
		fleet2.type = "Accord" ;
		fleet2.description = "Cheap car" ;
		fleet2.price = 9;
		fleet2.price_day = 90;
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

Image.remove({}, function(err) {
	if(err) {return next(err);}
})

Order.remove({}, function(err) {
	if(err) {return next(err);}
})
