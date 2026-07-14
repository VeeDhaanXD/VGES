const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const auth = require('../middleware/auth');

// POST: Create a new Quiz (Protected Route)
router.post('/create', auth, async (req, res) => {
  try {
    const { title, classNumber, questions } = req.body;
    
    const newQuiz = new Quiz({
      title,
      classNumber,
      teacherId: req.teacher.id,
      questions
    });

    const quiz = await newQuiz.save();
    res.json({ success: true, quiz });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET: Fetch all quizzes created by the logged-in teacher (Protected Route)
router.get('/my-quizzes', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ teacherId: req.teacher.id }).sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;