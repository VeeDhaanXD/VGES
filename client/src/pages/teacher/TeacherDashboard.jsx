import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', or 'results'
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Tracks which quiz to view results for
  
  const handleViewResults = (quiz) => {
    setSelectedQuiz(quiz);
    setActiveTab('results');
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">👩‍🏫</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">Teacher Control Panel</h2>
              <p className="text-sm font-medium text-slate-500">Manage your classes and quizzes.</p>
            </div>
          </div>
          
          {/* Hide tabs if we are in the results view */}
          {activeTab !== 'results' && (
            <div className="flex gap-2 mt-4 md:mt-0 bg-slate-100 p-1.5 rounded-xl">
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                My Quizzes
              </button>
              <button 
                onClick={() => setActiveTab('create')}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                + Create Quiz
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Content Area */}
        {activeTab === 'create' && <QuizBuilder />}
        {activeTab === 'list' && <QuizList onSelectQuiz={handleViewResults} />}
        {activeTab === 'results' && <AnalyticsView quiz={selectedQuiz} onBack={() => setActiveTab('list')} />}

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: The Step-by-Step Quiz Builder ---
function QuizBuilder() {
  const [step, setStep] = useState(0); // 0 = Setup, 1-10 = Questions, 11 = Review
  
  // Initialize state for 10 empty questions
  const emptyQuestions = Array.from({ length: 10 }, () => ({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: null // Will store the index of the correct option (0-3)
  }));

  const [quizData, setQuizData] = useState({
    title: '',
    classNumber: '',
    questions: emptyQuestions
  });

  const handleNext = () => {
    // In a real app, add validation here to ensure fields aren't empty
    setStep(prev => Math.min(prev + 1, 11));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const updateQuestion = (qIndex, field, value) => {
    const updated = [...quizData.questions];
    updated[qIndex][field] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...quizData.questions];
    updated[qIndex].options[optIndex] = value;
    setQuizData({ ...quizData, questions: updated });
  };

 const handleSubmit = async () => {
    try {
      // 1. Basic Validation
      if (!quizData.title || !quizData.classNumber) {
        alert("Please provide a Quiz Title and select a Target Class before publishing.");
        return;
      }

      // 2. Format the payload to match your MongoDB schema
      const formattedQuestions = quizData.questions.map((q) => {
        return {
          questionText: q.text,
          options: q.options,
          // Convert the index (0-3) back into the actual text string
          correctAnswer: q.options[q.correctAnswer] 
        };
      });

      const payload = {
        title: quizData.title,
        classNumber: parseInt(quizData.classNumber),
        questions: formattedQuestions
      };

      // 3. Retrieve the teacher's JWT token
      const token = localStorage.getItem('teacherToken');

      // 4. Send the POST request to Node.js
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post('${API_URL}/api/quiz/create', payload, {
        headers: {
          'Authorization': `Bearer ${token}` // Secure the route
        }
      });

      if (res.data.success) {
        alert("Success! Quiz has been published to the database. 🚀");
        // Reset the form back to step 0 or send them to the "My Quizzes" list
        window.location.reload(); 
      }

    } catch (err) {
      console.error("Submission Error:", err);
      alert(err.response?.data?.message || "Failed to create quiz. Is the server running?");
    }
  };


  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 relative overflow-hidden min-h-[500px] flex flex-col">
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>{step === 0 ? 'Quiz Setup' : step === 11 ? 'Review & Publish' : `Question ${step} of 10`}</span>
          <span className="text-blue-600">{Math.round((step / 11) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${(step / 11) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: Configuration */}
          {step === 0 && (
            <motion.div key="setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Let's set up a new quiz</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quiz Title</label>
                  <input 
                    type="text" placeholder="e.g., Science Mid-Term"
                    value={quizData.title}
                    onChange={(e) => setQuizData({...quizData, title: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Target Class</label>
                  <select 
                    value={quizData.classNumber}
                    onChange={(e) => setQuizData({...quizData, classNumber: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium text-lg"
                  >
                    <option value="" disabled>Select Class (1-10)</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>Class {num}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEPS 1-10: The Question Builder */}
          {step > 0 && step <= 10 && (
            <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Question {step}</h3>
              
              <textarea 
                placeholder="Type your question here..."
                value={quizData.questions[step - 1].text}
                onChange={(e) => updateQuestion(step - 1, 'text', e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium mb-6 resize-none min-h-[100px]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map(optIdx => (
                  <div key={optIdx} className="relative">
                    <input 
                      type="text" 
                      placeholder={`Option ${optIdx + 1}`}
                      value={quizData.questions[step - 1].options[optIdx]}
                      onChange={(e) => updateOption(step - 1, optIdx, e.target.value)}
                      className={`w-full pl-5 pr-12 py-4 rounded-2xl border-2 outline-none transition-all font-medium ${
                        quizData.questions[step - 1].correctAnswer === optIdx
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : 'border-slate-200 bg-slate-50 focus:border-blue-500'
                      }`}
                    />
                    {/* Mark as correct button */}
                    <button 
                      onClick={() => updateQuestion(step - 1, 'correctAnswer', optIdx)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        quizData.questions[step - 1].correctAnswer === optIdx
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                      }`}
                      title="Mark as correct answer"
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center font-medium">Click the checkmark to select the correct answer.</p>
            </motion.div>
          )}

          {/* STEP 11: Review */}
          {step === 11 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Publish!</h3>
              <p className="text-slate-500 font-medium mb-6">
                You are about to publish <strong>{quizData.title || 'Untitled Quiz'}</strong> for Class <strong>{quizData.classNumber || '-'}</strong> containing 10 questions.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
        <button 
          onClick={handlePrev} 
          disabled={step === 0}
          className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
        >
          ← Back
        </button>
        
        {step < 11 ? (
          <button 
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            Next Step →
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all active:scale-95"
          >
            Publish Quiz 🚀
          </button>
        )}
      </div>

    </div>
  );
}

// --- SUB-COMPONENT: Simple list view for existing quizzes ---
// --- SUB-COMPONENT: Live list view for existing quizzes ---
function QuizList({ onSelectQuiz }) {
  const [myQuizzes, setMyQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const token = localStorage.getItem('teacherToken');
        const res = await axios.get('http://localhost:5000/api/quiz/my-quizzes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMyQuizzes(res.data.quizzes);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyQuizzes();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500 font-bold animate-pulse">Loading your quizzes...</div>;

  if (myQuizzes.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <span className="text-5xl mb-4 opacity-50">📂</span>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No Quizzes Found</h3>
        <p className="text-slate-500">You haven't created any quizzes yet. Click "Create Quiz" to get started.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {myQuizzes.map(quiz => (
        <motion.div key={quiz._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Class {quiz.classNumber}</span>
              <span className="text-xs text-slate-400 font-medium">{new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{quiz.title}</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">{quiz.questions.length} Questions</p>
          </div>
          
          <button 
            onClick={() => onSelectQuiz(quiz)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-md flex justify-center items-center gap-2"
          >
            📊 View Student Results
          </button>
        </motion.div>
      ))}
    </div>
  );
}

// --- SUB-COMPONENT: The Analytics Gradebook ---
// --- SUB-COMPONENT: The Analytics Gradebook & Detailed Report ---
function AnalyticsView({ quiz, onBack }) {
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSubmission, setSelectedSubmission] = React.useState(null); // Tracks if viewing a specific student

  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/results/quiz/${quiz._id}`);
        setResults(res.data.results);
      } catch (err) {
        console.error("Failed to fetch results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quiz._id]);

  // If a specific student's submission is selected, show their detailed report
  if (selectedSubmission) {
    const percentage = (selectedSubmission.score / selectedSubmission.totalQuestions) * 100;
    
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
        
        {/* Student Report Header */}
        <div className="bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b-4 border-blue-500">
          <div>
            <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-white text-sm font-bold mb-2 transition-colors flex items-center gap-1">
              ← Back to Class Overview
            </button>
            <h3 className="text-2xl font-bold text-white">{selectedSubmission.studentName}'s Report</h3>
            <p className="text-slate-400 font-medium text-sm">Roll No: {selectedSubmission.rollNumber} • Submitted: {new Date(selectedSubmission.createdAt).toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
            <p className={`text-2xl font-extrabold ${percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-blue-400' : 'text-red-400'}`}>
              {selectedSubmission.score} <span className="text-lg text-slate-500">/ {selectedSubmission.totalQuestions}</span>
            </p>
          </div>
        </div>

        {/* Detailed Answers Log */}
        <div className="p-6 md:p-8 bg-slate-50">
          <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>📝</span> Question-by-Question Breakdown
          </h4>
          
          <div className="space-y-4">
            {selectedSubmission.answersLog.map((log, index) => (
              <div key={index} className={`p-5 rounded-2xl border ${log.isCorrect ? 'bg-white border-green-200 shadow-sm' : 'bg-red-50/50 border-red-200'}`}>
                <h5 className="font-bold text-slate-800 mb-4">{index + 1}. {log.questionText}</h5>
                
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Student's Answer */}
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${log.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <span>{log.isCorrect ? '✅' : '❌'}</span>
                    Student Answer: {log.selectedAnswer}
                  </div>
                  
                  {/* Show Correct Answer if they got it wrong */}
                  {!log.isCorrect && (
                    <div className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-200 text-slate-700 flex items-center gap-2">
                      <span>💡</span>
                      Correct Answer: {log.correctAnswer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Otherwise, show the main Class Summary Table
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
      
      {/* Header Bar */}
      <div className="bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <button onClick={onBack} className="text-slate-400 hover:text-white text-sm font-bold mb-2 transition-colors flex items-center gap-1">
            ← Back to Quizzes
          </button>
          <h3 className="text-2xl font-bold text-white">{quiz.title} - Results</h3>
          <p className="text-slate-400 font-medium text-sm">Class {quiz.classNumber} • {results.length} Submissions</p>
        </div>
        <div className="bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Average Score</p>
          <p className="text-2xl font-extrabold text-blue-400">
            {results.length > 0 ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) : 0} 
            <span className="text-lg text-slate-500"> / {quiz.questions.length}</span>
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-5">Student Name</th>
              <th className="p-5">Roll No.</th>
              <th className="p-5">Submitted At</th>
              <th className="p-5 text-center">Final Score</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-10 text-slate-500 font-bold animate-pulse">Loading grades...</td></tr>
            ) : results.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-10 text-slate-500 font-medium">No students have taken this quiz yet.</td></tr>
            ) : (
              results.map((result, idx) => {
                const percentage = (result.score / result.totalQuestions) * 100;
                return (
                  <tr key={result._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-5 font-bold text-slate-800">{result.studentName}</td>
                    <td className="p-5 text-slate-600 font-medium">#{result.rollNumber}</td>
                    <td className="p-5 text-slate-500 text-sm">{new Date(result.createdAt).toLocaleString()}</td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl font-bold text-sm ${
                        percentage >= 80 ? 'bg-green-100 text-green-700' : percentage >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {result.score} / {result.totalQuestions}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => setSelectedSubmission(result)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}