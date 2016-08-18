/*jslint node:true*/
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pass_schema = new Schema({
    email : { type: String, default: ''},
	madeon : { type : Date, default: Date.now },
});

mongoose.model('Pass', Pass_schema);
var Pass = mongoose.model('Pass');

exports.Pass = Pass;