import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[#2b2b2b] text-slate-300 border-t border-slate-800 font-sans mt-auto">
      {/* Reduced padding from py-12/16 to py-8, reduced gaps to make it compact */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="space-y-4">
            <div className="bg-white p-1.5 inline-block rounded-sm">
              <img src="/logo.webp" alt="School Logo" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vidyasagar Gurukul English School,<br />
              Zakalwadi Road, Lakhala, Washim
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><span className="text-rose-500">📞</span> +91 7030363535</li>
              <li className="flex items-center gap-2"><span className="text-rose-500">✉️</span> gurukulschoolwashim@gmail.com</li>
              <li className="flex items-center gap-2"><span className="text-rose-500">🌍</span> www.vidyasagargurukulwashim.in</li>
            </ul>
          </div>

          {/* Col 2: Useful Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-xs">
              {['Home', 'About Us', 'Admissions', 'Gallery', 'Contact Us'].map((link) => (
                <li key={link} className="border-b border-dashed border-zinc-700 pb-2 hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Call Us Now */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Call Us Now</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>+91 7030363535</li>
              <li>+91 7600400429</li>
              <li>+91 9552573625</li>
            </ul>
          </div>

          {/* Col 4: Opening Hours */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between border-b border-dashed border-zinc-700 pb-2">
                <span>Mon - Tues :</span> <span>8.00 am - 6.00 pm</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-zinc-700 pb-2">
                <span>Wednes - Thurs :</span> <span>8.00 am - 6.00 pm</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-zinc-700 pb-2">
                <span>Fri - Sat:</span> <span>8.00 am - 6.00 pm</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-zinc-700 pb-2">
                <span>Sun :</span> <span>Closed</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar & Supercharged 4Bytez Badge */}
      <div className="bg-[#1f1f1f] py-3 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            Copyright ©2024 Vidyasagar. All Rights Reserved
          </p>
          
          {/* Framer Motion Animated Badge */}
          <motion.a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: ["0px 0px 4px #3b82f6", "0px 0px 15px #8b5cf6", "0px 0px 4px #3b82f6"] 
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden bg-slate-900 border border-slate-700 px-5 py-2 rounded-xl flex items-center gap-2 group"
          >
            {/* Continuous Sweeping Light Effect */}
            <motion.div 
              animate={{ left: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            
            <span className="text-[10px] text-slate-400 font-medium tracking-wide z-10 relative">Platform Engineered by</span>
            <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 z-10 relative">
              4Bytez.Dev
            </span>
          </motion.a>

        </div>
      </div>
    </footer>
  );
}