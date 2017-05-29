var passport = require('passport'); // authentication middleware for node.js
var LocalStrategy = require('passport-local').Strategy; // if you are storing the username and password of a user in your own database, then a the module passport-local need to be installed together with passport
var User = require('../models/user');

// serialize and deserialize

// serialization is process of translating user object state into a data structure that can be stored
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// middleware

passport.use('local-login', new LocalStrategy({ // create a new instance
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({ email: email }, function(err, user) { // try to find specifi email in database
    if (err) return done(err); // done is a callback function like next

    if (!user) { // if user does not exist show this message
      return done(null, false, req.flash('loginMessage', 'No user has been found'));
    }

    if (!user.comparePassword(password)) { // compare password typed in to database password to check if matches, if not show message
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password entered'));
    }
    return done(null, user);
  });
}));

// Custom function to validate

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated() ) {
    return next(); // if authenticated grant access
  } // if not authenticated redirect to login page
  res.redirect('/login');
}
