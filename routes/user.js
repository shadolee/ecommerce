var router = require('express').Router(); // create modular, mountable route handlers
var User = require('../models/user'); // so we can use user.js here


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
