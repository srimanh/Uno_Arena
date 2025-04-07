const express = require('express');
const cors = require('cors');
const connectDB = require('./db/database');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Google OAuth Routes
const routes = require('./routes/auth');           // Local signup/login routes
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true
}));

// Proper JSON & URL-Encoded body limit to handle large payloads
app.use(express.json({ limit: '55mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Session Middleware for persistent login
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: true,
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
require('./auth/googleAuth'); // Google OAuth strategy

// Routes
app.use('/api/auth', authRoutes); // Google Auth Routes
app.use('/api', routes);          // Local Signup/Login Routes

// Room Routes
const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('UNO Backend is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
