import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PerformanceView() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Catch the real result data passed from ActiveQuiz.jsx
  const result = location.state?.result;

  // 2. Security Check: If they navigate here directly without taking a quiz, kick them back
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-slate-200">
          <span className="text-5xl">📭</span>
          <h2 className="text-2xl font-bold text-slate-700 mt-4 mb-4">No test results found!</h2>
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 3. Calculate dynamic feedback text based on their score
  const percentage = (result.score / result.totalQuestions) * 100;
  let feedback = "Keep Practicing!";
  if (percentage >= 80) feedback = "Outstanding Work!";
  else if (percentage >= 50) feedback = "Well Done!";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center font-sans">
      <div className="max-w-2xl w-full space-y-10">
        
        {/* Dynamic Score Card */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#3B4DFF] rounded-[2rem] p-12 text-center text-white shadow-xl shadow-blue-600/20"
        >
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-3xl font-extrabold mb-4">{feedback}</h1>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-7xl font-black">{result.score}</span>
            <span className="text-3xl font-bold text-blue-200">/ {result.totalQuestions}</span>
          </div>
          <p className="text-blue-100 font-medium">Quiz completed successfully.</p>
        </motion.div>

        {/* Dynamic Answers Log */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 mb-6">Let's review your answers:</h2>
          
          <div className="space-y-4">
            {result.answersLog.map((log, index) => {
              const isCorrect = log.isCorrect;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isCorrect 
                      ? 'bg-green-50/50 border-green-100' 
                      : 'bg-red-50/50 border-red-100'
                  }`}
                >
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    {index + 1}. {log.questionText}
                  </h3>
                  
                  <div className="flex flex-wrap gap-3">
                    {/* User's Answer Badge */}
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                      isCorrect 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span>{isCorrect ? '✔️' : '❌'}</span>
                      Your Answer: {log.selectedAnswer} {isCorrect && '(Correct)'}
                    </div>
                    
                    {/* Correct Answer Badge (Only shows if they got it wrong) */}
                    {!isCorrect && (
                      <div className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 flex items-center gap-2">
                        <span>💡</span>
                        Correct Answer: {log.correctAnswer}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-center pt-6 pb-12">
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="px-8 py-3 bg-[#131B33] text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}