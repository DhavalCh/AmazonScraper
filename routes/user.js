let request = require('sync-request')
exports.loginGet = function(req,res) {
	try {
		var userId = req.session.userId;
		if(userId != null && userId != undefined){
			res.redirect('/home');
		} else {
			let type = (req.session.type == undefined ? '' : req.session.type)
			let message = (req.session.message == undefined ? '' : req.session.message)
			req.session.type = undefined;
			req.session.message = undefined;
			res.render('login.ejs',{
				type: type,
				message: message,
				pageName: 'login-info',
				needScript: 'false',
				insertScript: ''
			});
		}
	} catch(error) {
		console.log('loginGet function: '+error);
		res.redirect('/logout');
	}
}

exports.loginPost = function(req,res) {
	try {
		let email = req.body.user_name;
		let password = req.body.password;
		var userData = db.query("SELECT * FROM users WHERE email = '" + email +"'");
		if(userData.length > 0) {
			let tempHash = cryptoModule.createHmac('md5',cryptoSecret).update(password).digest('hex');
			console.log("email----->"+email);
			console.log("password----->"+password);
			console.log("hash----->"+tempHash);
			if(tempHash == userData[0].password) {
				req.session.userId = userData[0].User_ID;
				req.session.user = userData[0];
				res.redirect('/home')
			} else {
				req.session.message = 'Incorrect Credentials.';
				req.session.type = 'is-danger';
				res.redirect('/login');
			}
		} else {
			res.redirect('/logout');
		}
	} catch(error) {
		console.log(error)
		console.log('loginPost function: '+error);
		res.redirect('/logout');
	}
}

exports.logout = function (req,res){
	req.session.destroy();
	res.redirect("/login");
};

exports.fourohfourGet = function (req, res) {
	res.render('error.ejs', {
		code: 404,
		error: {},
		message: 'Page not found.',
		title: 'Page Not Found'
	});
};

exports.indexGet = function(req,res) {
	res.redirect('/home');
}