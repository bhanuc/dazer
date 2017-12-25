
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  hash: {
    type: String,
    default: '',
  },
  salt: {
    type: String,
    default: '',
  },
  authToken: {
    type: String,
    default: '',
  },
  facebook: mongoose.Schema.Types.Mixed,
});

mongoose.model('User', userSchema);
const User = mongoose.model('User');


userSchema.pre('save', (next) => {
  // Place to add some pre save hook
  next();
});


exports.User = User;
