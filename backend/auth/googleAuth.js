const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ username: profile.emails[0].value });
          
          if (!user) {
            user = new User({
              username: profile.emails[0].value,
              profileImage: profile.photos[0].value,
            });
            await user.save();
          }
  
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
          );
  
          return done(null, { user, token }); 
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
