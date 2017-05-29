var express = require('express'); // we want the express library
var morgan = require('morgan'); // logs all requests from users
var mongoose = require('mongoose'); // we want the mongoose library
var bodyParser = require('body-parser'); // body-parser is a piece of express middleware that reads a form's input and stores it as a javascript object accessible through req.body
var ejs = require('ejs'); // embedded javascript, templating engine for node
var engine = require('ejs-mate'); // ejs extension
var session = require('express-session'); // session ID is an encrypted signature, session management module designed to help you manage user sessions
var cookieParser = require('cookie-parser'); // Express uses a cookie to store a session ID, middleware which parses cookies attached to the client request object
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session); // MongoDB session store on server side, (session) is passing session object so app knows session is based on express session library
var passport = require('passport');

var secret = require('./config/secret');
var User = require('./models/user'); // getting the user.js file

var app = express(); // so we can use all the built in methods within express

mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

// Middleware
app.use(express.static(__dirname + '/public')); // serving static files from public folder
// This will tell Express to match any routes for files found in this folder and deliver the files directly to the browser.
// When we say "static files" we're talking about HTML, client-side JavaScript, CSS files and images
app.use(morgan('dev')); // HTTP request logger middleware
app.use(bodyParser.json() ); // Parses the text as JSON and exposes the resulting object on req.body
app.use(bodyParser.urlencoded( { extended: true })); // Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST) and exposes the resulting object (containing the keys and values) on req.body
app.use(cookieParser() );
app.use(session({
  resave: true, // forces the session to be save to session store
  saveUninitialized: true,
  secret: "secret.secretKey",
  store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(flash() );
app.engine('ejs', engine);
app.set('view engine', 'ejs'); // setting templating engine as ejs

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);




// check if server is running, if not it will error
app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is running on Port " + secret.port); // this line of code runs if server successfully runs
});
