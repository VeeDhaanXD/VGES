const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/student');
const resultRoutes = require('./routes/result');

const app = express();

// 1. LIVE LOGGER: This will print every incoming request to your Render terminal!
app.use((req, res, next) => {
  console.log(`📡 Incoming Request: [${req.method}] ${req.url}`);
  next();
});

// 2. THE PERFECT CORS SETUP (No extra app.options needed)
app.use(cors({
  origin: ["https://vges.vercel.app", "http://localhost:5173"], 
  credentials: true
}));

// 3. MIDDLEWARE
app.use(express.json());

// 4. ROUTES
app.use('/api/student', studentRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/teacher', require('./routes/teacher')); 
app.use('/api/quiz', require('./routes/quiz'));

// 5. PING TEST ROUTE
app.get('/', (req, res) => {
  res.send('Quiz API is running!');
});

// 6. DATABASE & SERVER
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch((err) => console.log('❌ DB Connection Error: ', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});