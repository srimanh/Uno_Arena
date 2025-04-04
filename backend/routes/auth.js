const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, password, googleAuth } = req.body;

        if (googleAuth) {
            const { email, name, profileImage } = req.body;
            let user = await User.findOne({ username: email });

            if (user) return res.status(400).json({ msg: 'User already exists' });

            user = new User({ username: email, profileImage: profileImage || '', password: '' });

            await user.save();

            const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(201).json({ token, user: { username: user.username } });
        }

        let user = await User.findOne({ username });

        if (user) return res.status(400).json({ msg: 'Username already taken' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword });

        await user.save();

        // ✅ Generate and return token here
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { username: user.username } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

const token = jwt.sign({ userId: user._id , username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

res.json({ token, user: { username: user.username } });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout Route (Frontend clears token)
router.post('/logout', (req, res) => {
    res.json({ msg: 'Logged out successfully' });
});

module.exports = router;
