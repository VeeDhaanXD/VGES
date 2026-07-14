const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// POST: Grade the quiz and save the result
router.post('/submit', async (req, res) => {
  try {
    const { studentName, rollNumber, classNumber, quizId, answers } = req.body;

    // 1. Fetch the absolute truth from the DB
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    let score = 0;
    const answersLog = [];

    // 2. Cross-reference student answers with correct answers
    quiz.questions.forEach((question, index) => {
      // The frontend sends an object like { "0": "Option A", "1": "Option C" }
      const studentAnswer = answers[index]; 
      const isCorrect = studentAnswer === question.correctAnswer;
      
      if (isCorrect) score += 1;

      answersLog.push({
        questionId: question._id,
        questionText: question.questionText,
        selectedAnswer: studentAnswer || "Not Attempted",
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    });

    // 3. Save the immutable record
    const newResult = new Result({
      studentName,
      rollNumber,
      classNumber,
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      answersLog
    });

    await newResult.save();

    // 4. Send the graded paper back to the frontend
    res.status(200).json({ success: true, result: newResult });

  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// GET: Fetch all student results for a specific quiz
router.get('/quiz/:quizId', async (req, res) => {
  try {
    // Fetches results and sorts them by highest score first!
    const results = await Result.find({ quizId: req.params.quizId }).sort({ score: -1 });
    res.status(200).json({ success: true, results });
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}); 

module.exports = router;