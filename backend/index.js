const express = require('express');
const cors = require('cors');
const connectDB = require('./db/database');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Correct path for auth routes
const routes = require('./routes/auth'); // Ensure this is the correct path for your routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Ensure this matches your frontend URL
  credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Session Middleware for persistent login
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Google Auth Configuration
require('./auth/googleAuth');

// API Routes
app.use('/api/auth', authRoutes); // Ensure this is correctly mounted
app.use('/api', routes); // Ensure this is correctly mounted

// Root route
app.get('/', (req, res) => {
  res.send('UNO Backend is running!');
});

// Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
