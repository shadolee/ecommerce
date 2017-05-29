var passport = require('passport'); // authentication middleware for node.js
var localStrategy = require('passport-local').Strategy(); // if you are storing the username and password of a user in your own database, then a the module passport-local need to be installed together with passport

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// middleware


// Custom function to validate
