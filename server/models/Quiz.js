const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true } // Stores the exact text string of the correct option
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  classNumber: { type: Number, required: true, min: 1, max: 10 },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);