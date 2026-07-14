const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  questionText: { type: String },
  selectedAnswer: { type: String },
  correctAnswer: { type: String },
  isCorrect: { type: Boolean }
});

const resultSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  classNumber: { type: Number, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answersLog: [submissionSchema] // Kept to display wrong answers to students and teachers later
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);