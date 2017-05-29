var router = require('express').Router(); // create modular, mountable route handlers
var User = require('../models/user'); // so we can use user.js here
var passport = require('passport');
var passportConf = require('../config/passport');


router.get('/login', function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('accounts/login', { message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/profile', function(req, res) {
  res.render('accounts/profile');
})

router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.post('/signup', function(req, res) {
  var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  User.findOne({ email: req.body.email }, function(err, existingUser) {
// check if user signup data already on database or not, if not create new user
    if(existingUser) {
      req.flash('errors', 'Account with that email address already exists');
      return res.redirect('/signup');
    } else {
      user.save(function(err, user) {
        if (err) return next(err);

        return res.redirect('/'); // redirect to home page once submitted
      });
    }
  });
});

module.exports = router; // so we can use this file in other files
