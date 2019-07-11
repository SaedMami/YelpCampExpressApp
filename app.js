var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategey = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');

mongoose
	.connect(
		process.env.DATABASEURL,
		{
			useNewUrlParser: true,
			useCreateIndex: true
		}
	)
	.then(() => {
		console.log('Connected to DB');
	})
	.catch(err => {
		console.log('Error:', err.message);
	});

var seedDB = require('./seeds');


//seedDB();

// configue express session
app.use(
	require('express-session')({
		secret: 'sldkjsldkfjl2345kjlsdkefjlkj54',
		resave: false,
		saveUninitialized: false
	})
);

app.use(methodOverride("_method"));

//flash messages
app.use(flash());

// configure passport
app.use(passport.initialize());
app.use(passport.session());

// configure passport-local and passport-local-mongoose
var User = require('./models/user');
passport.use(new localStrategey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
    res.locals.successFlashMessage = req.flash("success");
    res.locals.errorFlashMessage = req.flash("error");
	next();
});

app.use("/campgrounds", require("./routes/campgrounds"));
app.use("/campgrounds/:campground_id/comments", require("./routes/comments"));
app.use(require("./routes/index"));



app.listen(3000, () => {
	console.log('YelpCamp Server has started.');
});