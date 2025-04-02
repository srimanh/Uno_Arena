const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Google Login Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/signup' }),
    (req, res) => {
      const token = req.user.token;  
      console.log("Generated token:", token);  
  
      if (token) {
        res.redirect(`http://localhost:5173/auth-success?token=${token}`);  
      } else {
        res.redirect('http://localhost:5173/signup');  
      }
    }
  );
  

// Logout Route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('http://localhost:5173');
  });
});

// Protected User Route (Requires JWT)
router.get('/user', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ userId: decoded.userId, username: decoded.username });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });
  

module.exports = router;
