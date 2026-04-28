import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png'; 
import logoLight from '../assets/images/logo_lightMode.png';

export default function Preloader() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] transition-colors duration-300"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-green/20 dark:bg-brand-green/10 rounded-full blur-[100px] transition-colors duration-300" />

      <motion.img
        src={logo}
        alt="Loading..."
        className="hidden dark:block h-28 object-contain mb-10 relative z-10"
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={logoLight}
        alt="Loading..."
        className=" block dark:hidden h-28 object-contain mb-10 relative z-10"
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative z-10 transition-colors duration-300">
        <motion.div
          className="h-full bg-brand-green shadow-[0_0_10px_rgba(0,204,68,0.5)] dark:shadow-[0_0_10px_rgba(0,204,68,0.8)] transition-shadow duration-300"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-brand-green/80 dark:text-brand-green/60 text-xs font-semibold uppercase tracking-widest mt-6 relative z-10 transition-colors duration-300"
      >
        Initializing Workspace...
      </motion.p>
    </motion.div>
  );
}