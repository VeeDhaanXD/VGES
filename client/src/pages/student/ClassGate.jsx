import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios'; // <-- Added Axios

export default function ClassGate() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const upperCode = code.toUpperCase();

    // 1. Basic format check
    if (!upperCode.startsWith('VGES-')) {
      setError("Oops! That code doesn't look right. It should start with VGES-");
      return;
    }

    // 2. Extract the class number from the code (e.g., "VGES-05" -> 5)
    const classNum = parseInt(upperCode.split('-')[1]);

    if (isNaN(classNum)) {
      setError("Invalid code format. Example: VGES-05");
      return;
    }

    // 3. Ask the Database if this code actually exists
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/student/verify-class`, {
        classNumber: classNum,
        classCode: upperCode
      });

      if (res.data.success) {
        // The database confirmed it! Let them through.
        navigate('/student/register');
      }
    } catch (err) {
      // The database rejected it (e.g., VGES-11)
      console.error(err);
      setError(err.response?.data?.message || 'Access Denied. Invalid Code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50/50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 text-center"
      >
        <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">🔑</span>
        </div>
        <h2 className="text-3xl font-extrabold mb-2 text-slate-800">Welcome to Class!</h2>
        <p className="text-slate-500 mb-8 font-medium">Please enter your magic class code provided by your teacher.</p>
        
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. VGES-05" 
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none uppercase text-lg text-center font-bold tracking-widest transition-all"
              required
            />
            {error && <p className="text-red-500 text-sm mt-3 font-bold">{error}</p>}
          </div>
          <button 
            type="submit" 
            disabled={loading || !code}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? 'Checking Vault...' : 'Unlock My Class'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}