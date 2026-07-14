import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ActiveQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz; // Read the quiz data passed from the dashboard
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback if someone tries to navigate here directly without selecting a quiz
  if (!quiz) {
    return <div className="p-10 text-center font-bold">Quiz not found. Go back to Dashboard.</div>;
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIdx];
  const progressPercentage = ((currentIdx + 1) / totalQuestions) * 100;

  const handleOptionSelect = (opt) => {
    // Save the answer to an object mapping { questionIndex: "Selected String" }
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: opt });
  };

  const handleNext = async () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // It's the last question! Time to submit.
      setIsSubmitting(true);
      const student = JSON.parse(localStorage.getItem('vges_student'));
      
      const payload = {
        studentName: student.name,
        rollNumber: student.roll,
        classNumber: student.class,
        quizId: quiz._id,
        answers: selectedAnswers
      };

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.post(`${API_URL}/api/results/submit`, payload);
        // Pass the graded result to the performance view
        navigate('/student/performance', { state: { result: res.data.result } });
      } catch (err) {
        console.error("Submission failed:", err);
        alert("Failed to submit quiz. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-10">
      <div className="max-w-2xl w-full">
        
        {/* Progress Header */}
        <div className="mb-8 px-2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Question {currentIdx + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative min-h-[400px] flex flex-col">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-10 flex-grow flex flex-col"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-snug">
                {currentQuestion.questionText}
              </h2>
              
              <div className="space-y-4 flex-grow">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentIdx] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(opt)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md scale-[1.01]' 
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
                          {isSelected && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                        </div>
                        <span className="font-semibold text-lg">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Footer */}
          <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex justify-end">
            <button
              disabled={!selectedAnswers[currentIdx] || isSubmitting}
              onClick={handleNext}
              className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                (!selectedAnswers[currentIdx] || isSubmitting)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {isSubmitting ? 'Grading...' : currentIdx === totalQuestions - 1 ? 'Submit Exam' : 'Next Question'}
              {!selectedAnswers[currentIdx] ? null : <span>→</span>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}