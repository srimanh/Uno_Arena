const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  roomSize: { type: Number, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});


module.exports = mongoose.model('Room', RoomSchema);
