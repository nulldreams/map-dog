// Dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var database        = require('./config/database');
var passport 		= require('passport');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var express 		= require('express')
var flash    = require('connect-flash')
var expressLayouts 	= require('express-ejs-layouts')
var session      	= require('express-session')
var app             = express();

// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
mongoose.connect(database.mongolab.url);
require('./config/passport')(passport); // pass passport for configuration

// Logging and Parsing
app.set('view engine', 'ejs')

app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(expressLayouts)
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(flash())

// Routes
// ------------------------------------------------------
require('./app/routes.js')(app, passport)

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);
