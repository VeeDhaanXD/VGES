import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function StudentRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', roll: '', class: '' });

 // Find your handleSubmit function and replace it with this:
const handleSubmit = (e) => {
  e.preventDefault();
  // Save the student's details to local storage
  localStorage.setItem('vges_student', JSON.stringify(formData));
  navigate('/student/dashboard');
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50/50 p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl border border-blue-100"
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-2">👋</span>
          <h2 className="text-2xl font-bold text-slate-800">Hello there!</h2>
          <p className="text-slate-500 font-medium">Let's get to know you before we start.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Your Full Name" required
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium transition-all"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="text" placeholder="Roll Number" required
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium transition-all"
            onChange={(e) => setFormData({...formData, roll: e.target.value})}
          />
          <input 
            type="number" placeholder="Class (e.g., 5)" min="1" max="200" required
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium transition-all"
            onChange={(e) => setFormData({...formData, class: e.target.value})}
          />
          <button type="submit" className="w-full py-4 mt-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition-all">
            Let's Go! 🚀
          </button>
        </form>
      </motion.div>
    </div>
  );
}