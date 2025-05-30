const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  profileImage: { 
    type: String, 
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
  }
});

module.exports = mongoose.model('User', UserSchema);
