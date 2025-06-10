exports.homeGet = function(req,res) {
	try {
		res.render('home.ejs',{
			pageName: 'home-info',
			needScript: 'true',
			insertScript: '/js/home-page.js'
		});
	} catch(error) {
		console.log("homeGet function: "+error);
		// res.redirect('/home');
	}
}

exports.homePost = function(req,res) {
	try {
		let UsersList = db.query('SELECT * FROM items')
		console.log(UsersList)
		res.send(UsersList)
	} catch(error) {
		console.log('homePost function: '+ error)
		res.send();
	}
}