const express = require('express');
const cors = require('cors');
const connectDB = require('./db/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('UNO Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
