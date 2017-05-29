var mongoose = require('mongoose'); // require mongoose library
var bcrypt = require('bcrypt-nodejs'); // require bcrypt library to hash password before it saves to database
// hashing passwords id for security, hashing algorithm changes password in data store
var Schema = mongoose.Schema; // with mongoose, everything is derived from a schema


/* The user schema attributes/characteristics/fields */
var UserSchema = new mongoose.Schema({ // mongoose helps model app data
  email: { type: String, unique: true, lowercase: true },
  password: String,

  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  history: [{
    data: Date,
    paid: { type: Number, default: 0},
    //item: { type: Schema.Types.ObjectId, ref: ''}

  }]
});

/* Hash the password before we save it to the database */
UserSchema.pre('save', function(next) { // 'pre' is a mongoose method, where you pre-save before saving, to do something to it, before saving it to the database
  var user = this; // 'this' refers to UserSchema
  if (!user.isModified('password')) return next(); // check if password has been changed, if not, return next
  bcrypt.genSalt(10, function(err, salt) { // = Generating salt = making random data for 10 spaces // salt is result of bcrypt which = 10 random data
    if (err) return next(err); // callback if error
    bcrypt.hash(user.password, salt, null, function(err, hash) { // pass in password, salt, null means progress of hashing method, null as we don't need to see, otherwise could use console.log
      if (err) return next(err);
      user.password = hash; // hash is the password data produced
    });
  });
});

/* Compare password in database to the one the user types in */
UserSchema.methods.comparePassword = function(password) {
  // 'methods' as we are creating a custom method, whereas 'pre' above is built in mongoose
  // password in the function is the password you type in
  return bcrypt.compareSync(password, this.password); // compare password in Schema to one user types in
  // 'compareSync' is a boolean and just returns true/false
}

module.exports = mongoose.model('User', UserSchema); // so we can use this schema in other files
