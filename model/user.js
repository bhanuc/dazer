/*jslint node:true*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    oAuthTypes = ['github', 'twitter', 'facebook', 'google', 'linkedin'];

var User_schema = new Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    hash: {
        type: String,
        default: ''
    },
    salt: {
        type: String,
        default: ''
    },
    authToken: {
        type: String,
        default: ''
    },
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    linkedin: {}
});

mongoose.model('User', User_schema);
var User = mongoose.model('User');


User_schema.pre('save', function(next) {
    //Place to add some pre save hook
    next();
});


exports.User = User;