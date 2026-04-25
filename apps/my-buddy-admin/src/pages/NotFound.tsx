import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-brand-green/30">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-green/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Particles for extra premium feel */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-brand-green/40 rounded-full blur-[1px]"
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl"
      >
        {/* Floating Warning Icon */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 p-4 rounded-3xl bg-brand-green/10 border border-brand-green/20 text-brand-green shadow-[0_0_30px_rgba(0,204,68,0.15)]"
        >
          <AlertTriangle size={64} strokeWidth={1.5} />
        </motion.div>

        {/* 404 Text */}
        <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
          System Route Not Found
        </h2>
        
        <p className="text-gray-400 text-sm sm:text-base mb-10 leading-relaxed">
          The administrative module you are looking for does not exist, has been restricted, or temporarily moved. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)} // කලින් හිටපු පිටුවට යනවා
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')} // Dashboard එකට යනවා
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-green text-black font-bold shadow-[0_0_20px_rgba(0,204,68,0.2)] hover:shadow-[0_0_30px_rgba(0,204,68,0.4)] transition-all text-sm"
          >
            <LayoutDashboard size={18} />
            Return to Dashboard
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
}