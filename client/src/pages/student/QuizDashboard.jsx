import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function QuizDashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get student data from local storage
  const student = JSON.parse(localStorage.getItem('vges_student') || '{}');

  useEffect(() => {
    if (!student.class) {
      navigate('/student/register'); // Kick them back if they skipped registration
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/student/quizzes/${student.class}`);
        setQuizzes(res.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [student.class, navigate]);

  // Animation variants
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Dashboard Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10 flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-1">Your Learning Hub</h2>
            <p className="text-slate-500 font-medium">Select a quiz below to begin.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-2xl">
            <span className="text-2xl">👨‍🎓</span>
            <div>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">{student.name}</p>
              <p className="text-blue-900 font-bold">Class {student.class} • Roll: {student.roll}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Quiz Grid */}
        {loading ? (
          <p className="text-center text-slate-500 font-bold animate-pulse">Loading your quizzes...</p>
        ) : quizzes.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-3xl border border-slate-200">
            <span className="text-4xl">📭</span>
            <h3 className="text-xl font-bold text-slate-700 mt-4">No Quizzes Available</h3>
            <p className="text-slate-500">Your teacher hasn't assigned any quizzes for Class {student.class} yet.</p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <motion.div key={quiz._id} variants={item} whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col justify-between group transition-shadow hover:shadow-xl hover:shadow-blue-900/5">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700">Assessment</span>
                    <span className="text-3xl bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">📝</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2">{quiz.title}</h3>
                  <p className="text-slate-500 text-sm font-medium">{quiz.questions.length} Questions</p>
                </div>
                
                <button 
                  // We pass the actual quiz data directly to the next page so we don't have to fetch it twice!
                  onClick={() => navigate(`/student/quiz/${quiz._id}`, { state: { quiz } })}
                  className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-slate-900/20"
                >
                  Start Challenge 🚀
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}