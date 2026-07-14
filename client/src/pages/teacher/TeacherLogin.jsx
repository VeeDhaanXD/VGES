import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
export default function TeacherLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  

  const handleLogin = async (e) => {
   e.preventDefault();
    try {
      // 2. Hit your backend login route
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/teacher/login`, formData);
      
      if (res.data.success) {
        // 3. Save the token to local storage
        localStorage.setItem('teacherToken', res.data.token);
        // 4. Redirect to dashboard
        navigate('/teacher/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
  };
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full p-8 bg-white rounded-[2rem] shadow-2xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="bg-slate-900 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20">
            <span className="text-3xl text-white">👩‍🏫</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">Teacher Portal</h2>
          <p className="text-slate-500 font-medium mt-2">Sign in to manage your classes.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:shadow-xl transition-all">
            Secure Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}   