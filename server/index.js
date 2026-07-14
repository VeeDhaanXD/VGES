const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

require('dotenv').config();

const studentRoutes = require('./routes/student');
const resultRoutes = require('./routes/result');
const app = express();


// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development, your production URL, and any Vercel preview generated URLs
    if (!origin || origin.endsWith('.vercel.app') || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Violation'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use('/api/student', studentRoutes);
app.use('/api/results', resultRoutes);
// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Quiz API is running!');
});


app.use('/api/teacher', require('./routes/teacher')); 
app.use('/api/quiz', require('./routes/quiz'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch((err) => console.log('DB Connection Error: ', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});