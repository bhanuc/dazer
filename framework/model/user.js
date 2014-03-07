/*jslint node:true*/
'use strict';
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    crypto = require('crypto'),
    oAuthTypes = ['github', 'twitter', 'facebook', 'google', 'linkedin'];

var User_schema = new Schema({
    fname : { type: String, default: ''},
    lname : { type: String, default: ''},
    email : { type: String, default: ''},
    hash : { type : String, default: ''},
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

//pre save hooks

User_schema.pre('save', function (next) {
  //some pre hooks
    next();
});


exports.User = User;