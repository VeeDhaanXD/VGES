import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Student Pages ---
import ClassGate from './pages/student/ClassGate';
import StudentRegister from './pages/student/StudentRegister';
import QuizDashboard from './pages/student/QuizDashboard';
import ActiveQuiz from './pages/student/ActiveQuiz';
import PerformanceView from './pages/student/PerformanceView';
import Header from './components/Header';
import Footer from './components/Footer';

import TeacherLogin from './pages/teacher/TeacherLogin';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
export default function App() {
  return (
    <Router> 
      <Header></Header>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
        
        {/* Main Content Area */}
        <main className="h-full">
          <Routes>
            
            {/* Landing Page Route with Background Image */}
            <Route path="/" element={
              <div 
                className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
                style={{ backgroundImage: "url('/bg.webp')" }}
              >
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-blue-950/70 backdrop-blur-sm"></div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl"
                >
                  {/* School Logo */}
                  <img 
                    src="/logo.png" 
                    alt="Vidhyasagar Gurukul Logo" 
                    className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6 drop-shadow-2xl bg-white rounded-full p-2"
                    onError={(e) => e.target.style.display = 'none'} // Hides if logo.png name is wrong
                  />
                  
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight">
                    VIDHYASAGAR GURUKUL <br className="hidden md:block" />
                    <span className="text-blue-300">ENGLISH SCHOOL</span>
                  </h1>
                  
                  <p className="text-xl text-blue-100 max-w-2xl mb-12 drop-shadow-md">
                    Welcome to our interactive student portal! Embark on your learning journey, test your knowledge, and track your success.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/student/gate" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-500 hover:scale-105 transition-all duration-300">
                      👨‍🎓 Student Portal
                    </Link>
                    <Link to="/teacher/login" className="px-8 py-4 bg-white/10 text-white border-2 border-white/30 backdrop-blur-md rounded-2xl font-bold text-lg shadow-xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
                      👩‍🏫 Teacher Access
                    </Link>
                  </div>
                </motion.div>
              </div>
            } />

            {/* Student Flow Routes */}
            <Route path="/student/gate" element={<ClassGate />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/dashboard" element={<QuizDashboard />} />
            <Route path="/student/quiz/:quizId" element={<ActiveQuiz />} />
            <Route path="/student/performance" element={<PerformanceView />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

          </Routes>
        </main>
        <Footer></Footer>
      </div>
    </Router>
  );
}