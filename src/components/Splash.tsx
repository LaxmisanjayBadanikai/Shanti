import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600); // Small pause at 100%
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div id="splash-screen" className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-between py-16 px-6 text-white z-50 select-none">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 relative"
        >
          <Shield className="w-12 h-12 text-white" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 border-2 border-dashed border-blue-400/40 rounded-full"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl font-sans font-bold tracking-wider text-white"
        >
          Peace<span className="text-blue-400">OS</span>
        </motion.h1>

        {/* Theme Slogan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sm font-mono tracking-widest text-blue-200 mt-2 flex items-center gap-1 uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> SHANTI • शांति • शांतिः <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xs text-slate-400 max-w-xs text-center mt-3 leading-relaxed"
        >
          Peace, Pluralism & Human Dignity • AI-Powered Crisis & Community Coordination System
        </motion.p>
      </div>

      {/* Loading Progress */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-xs text-slate-500 font-mono">
          <span>COHESION ENGINE</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500 font-mono tracking-wider">DISTRICT COGNITIVE PORTAL v3.1</p>
      </div>
    </div>
  );
}
