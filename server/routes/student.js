  const router = require('express').Router();
  const ClassConfig = require('../models/ClassConfig');
  const Quiz = require('../models/Quiz');
  const express = require('express');
  // const router = express.Router();
  // 1. Verify Class Code
  router.post('/verify-class', async (req, res) => {
    const { classNumber, classCode } = req.body;
    try {
      const config = await ClassConfig.findOne({ classNumber, classCode });
      if (!config) {
        return res.status(401).json({ success: false, message: "Invalid Class Code. Access Denied." });
      }
      return res.status(200).json({ success: true, message: "Access Granted." });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 2. Fetch Quizzes for verified class
  router.get('/quizzes/:classNumber', async (req, res) => {
    try {
      const quizzes = await Quiz.find({ classNumber: req.params.classNumber }).select('-questions.correctAnswer'); 
      // Stripping out answers so smart students can't inspect the network tab!
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  module.exports = router;