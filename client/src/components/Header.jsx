import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <motion.img 
              whileHover={{ rotate: -5, scale: 1.05 }}
              src="/logo.webp" 
              alt="Vidyasagar Gurukul Logo" 
              className="h-14 w-auto object-contain bg-white rounded-full p-1 shadow-sm border border-slate-100"
              onError={(e) => e.target.style.display = 'none'} 
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                Vidyasagar Gurukul
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                English School
              </p>
            </div>
          </Link>

          {/* Quick Actions / Navigation */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/student/gate" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors hidden md:block">
              Student Portal
            </Link>
            
            <Link to="/teacher/login" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md hidden sm:block">
              Teacher Login
            </Link>

            <div className="h-6 w-px bg-slate-300 hidden md:block"></div>

            {/* Personalized Veedhaan & 4Bytez Badge */}
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 group shadow-sm cursor-pointer"
            >
              {/* Sweeping Light Effect */}
              <motion.div 
                animate={{ left: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              
              {/* Developer Name Details */}
              <span className="text-[10px] text-slate-400 font-medium tracking-wide z-10 relative hidden lg:block">Built by</span>
              <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  4Bytez
                </span> 
                <span className="text-[10px] text-blue-500 font-black">.Dev</span>
                <span className="text-slate-600 text-[10px] z-10 relative hidden md:block">|</span>
              <span className="text-[11px] font-bold text-slate-100 z-10 relative hidden md:block tracking-wide">Veedhaan Dere</span>
              
              {/* Divider */}
              
              
              {/* 4Bytez Logo Text */}
              <div className="flex items-center z-10 relative">
                
                
              </div>
            </motion.a>
          </div>

        </div>
      </div>
    </motion.header>
  );
}