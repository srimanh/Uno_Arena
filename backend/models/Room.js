const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  code: { type: String, required: true, unique: true },
  roomSize: { type: Number, required: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Room', roomSchema);
