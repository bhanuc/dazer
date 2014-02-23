/*jslint node:true*/
'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    crypto = require('crypto'),
    oAuthTypes = ['github', 'twitter', 'facebook', 'google', 'linkedin'];


var User_schema = new Schema({
    fname : { type: String, default: ''},
    lname : { type: String, default: ''},
    username : { type: String, default: ''},
    hashed_password : { type : String, default: ''},
    salt: { type : String, default: ''},
     authToken: { type: String, default: '' },
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    linkedin: {}
});

mongoose.model('User', User_schema);
var User = mongoose.model('User');

//Example of a virtual Schema

User_schema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makesalt();
        this.hashed_password = this.encryptpass;
    })
    .get(function() { return this._password; });

//custom Validations

var validater = function (value) {
    return value && value.length;
};

//local validations
// the below 5 validations only apply if you are signing up traditionally

User_Schema.path('name').validate(function (name) {
  if (this.doesNotRequireValidation()) return true
  return name.length
}, 'Name cannot be blank')

User_Schema.path('email').validate(function (email) {
  if (this.doesNotRequireValidation()) return true
  return email.length
}, 'Email cannot be blank')

User_Schema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User')
  if (this.doesNotRequireValidation()) fn(true)

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

User_Schema.path('username').validate(function (username) {
  if (this.doesNotRequireValidation()) return true
  return username.length
}, 'Username cannot be blank')

User_Schema.path('hashed_password').validate(function (hashed_password) {
  if (this.doesNotRequireValidation()) return true
  return hashed_password.length
}, 'Password cannot be blank')

//pre save hooks

User_schema.pre('save', function (next) {
    if(!this.isNew) return next();
    
    if(!validatePresenceOf(this.password)
       && !this.doesNotRequireValidation())
        next(new Error("Invalid Passwor"));
    else
        next() ;
             });

//Methods available to user
User_schema.methods = {
    
     /**
* Authenticate - check if the passwords are the same
*
* @param {String} plainText
* @return {Boolean}
* @api public
*/
    authenticate: function (plaintext) {
        return this.encryptPassword(plaintext) === this.hashed_password;
    },

  /**
* Make salt
*
* @return {String}
* @api public
*/
    
  makeSalt: function() {
      return Math.round((new Date().valueOf()*Math.random())) + ''
  },
    

  /**
* Encrypt password
*
* @param {String} password
* @return {String}
* @api public
*/

encryptPassword: function (password) {
    if(!password) return '';
    var encrypted;
    try {
        encrypted = crypto.createHmac('sha1',this.salt).update(password).digest('hex');
        return encrypted;
    } catch (err) {
        return '';
    }
},
    doesNotRequireValidation: function() {
        return ~oAuthTypes.indexOf(this.provider);
    }
}
    

exports.User = User;