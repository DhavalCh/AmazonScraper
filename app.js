const express = require('express'),
home = require('./routes/home'),
user = require('./routes/user'),
path = require('path');
const session = require('express-session');

const app = express();

app.set('env', 'production');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

app.use(session({
	secret: 'SpaceMomLoreSanta $ARetirement$',
	resave: false,
	saveUninitialized: false,
	cookie: {
		// secure: true,
		secure: false,
		httpOnly: true,
		expires: expiryDate,
		maxAge: 24 * 60 * 60 * 1000,
		sameSite: true
	}
})
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));

const mysql = require('sync-mysql');
const connection = new mysql({
	user: 'root',
	password: '123',
	host: 'localhost',
	// port: '3306',
	database: 'amazon_scraper'
});

// let mysql = require("mysql");
// let conn = mysql.createConnection({host: "localhost", user: "root",
//   password: "9714",port: '3306', database: "amazon_scraper"});

global.db = connection;
// global.db = conn
global.cryptoSecret = 'SpaceMomLore' ;
global.cryptoModule = require('crypto');
global.secretKey = '6LfSLfoZAAAAAJqouZxgnTADRlBUua4cg806YUG9';

function isAuthenticated(req, res, next) {
	console.log('as')
	if (req.session.userId != null && req.session.userId != undefined) {
		return next();
	}
	res.redirect('/logout');
}

app.get('/',user.indexGet)

app.get('/login',user.loginGet);
app.post('/login',user.loginPost);
app.get('/logout',user.logout);


app.get('/home',isAuthenticated,home.homeGet)
app.get('/get_data',isAuthenticated,home.homePost)
app.get('/404',isAuthenticated,user.fourohfourGet);
app.get('*',isAuthenticated,user.fourohfourGet);

let fs = require('fs')

app.listen(8000);


