const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher'); // Ensure you have the Teacher model created
const auth = require('../middleware/auth');

// POST: Login Teacher
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    const payload = { teacher: { id: teacher.id } };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '5h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ success: true, token, teacher: { name: teacher.name, email: teacher.email } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST: Register Teacher (You can secure this later or use it to seed the DB now)
router.post('/register', async (req, res) => {
  const { name, email, password, subject } = req.body;

  try {
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ success: false, message: 'Teacher already exists' });
    }

    teacher = new Teacher({ name, email, password, subject });
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(password, salt);
    await teacher.save();

    res.status(201).json({ success: true, message: 'Teacher registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;