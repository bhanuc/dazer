var mongoose = require('mongoose');
var Schema = mongoose.Schema, 
    ObjectId = Schema.ObjectId;


var User = new Schema({
    fname : string,
    lname : String,
    username : String,
    password : String
});

mongoose.model('User', User);
var User = mongoose.model('User');


UserProvider = function(){};

//Find all Users
UserProvider.prototype.findAll = function(callback) {
  User.find({}, function (err, Users) {
    callback( null, Users )
  });
};

//Find User by ID
UserProvider.prototype.findById = function(id, callback) {
  User.findById(id, function (err, User) {
    if (!err) {
callback(null, User);
}
  });
};



exports.UserProvider = UserProvider;