const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');

// ✅ Create Room
router.post('/create-room', async (req, res) => {
  try {
    const { code, roomSize, playerIds } = req.body;

    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return res.status(400).json({ msg: 'At least one player ID is required' });
    }

    const validPlayers = await User.find({ _id: { $in: playerIds } });
    if (validPlayers.length !== playerIds.length) {
      return res.status(400).json({ msg: 'One or more player IDs are invalid' });
    }

    const newRoom = new Room({
      code,
      roomSize,
      players: playerIds,
    });

    await newRoom.save();
    console.log('✅ Room created with ID:', newRoom._id);

    res.status(201).json({ msg: 'Room created successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Join Room
router.post('/join-room', async (req, res) => {
  try {
    const { userId, roomCode } = req.body;

    if (!userId || !roomCode) return res.status(400).json({ error: 'Missing required fields' });

    const room = await Room.findOne({ code: roomCode });

    if (!room) return res.status(404).json({ error: 'Room not found' });

    if (room.players.some(player => player.toString() === userId)) {
      return res.status(400).json({ error: 'User already in the room' });
    }
    

    if (room.players.length >= room.roomSize) {
      return res.status(400).json({ error: 'Room is full' });
    }

    room.players.push(userId);
    await room.save();

    res.json({ success: true, message: 'Joined room successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error joining room' });
  }
});

// ✅ Get player details in a room
router.get('/room-players/:code', async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code }).populate('players' , 'username profileImage');

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    const playersData = room.players.map(player => ({
      username: player.username,
      profileImage: player.profileImage,
    }));

    res.json({ players: playersData });

  } catch (err) {
    console.error('⚠️ Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
