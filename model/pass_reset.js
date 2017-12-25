
const mongoose = require('mongoose');

const passSchema = mongoose.Schema({
  email: { type: String, default: '' },
  madeon: { type: Date, default: Date.now },
});

mongoose.model('Pass', passSchema);
const Pass = mongoose.model('Pass');

exports.Pass = Pass;
