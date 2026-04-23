import { motion, type Variants } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, LayoutDashboard } from 'lucide-react';
import logo from '../assets/images/logo.png'; 

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function AuthPage() {
  return (
    <div className="h-screen w-full flex bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* ---------------- LEFT SIDE: Branding & Visuals ---------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0d0d0d] border-r border-gray-800/50 flex-col justify-center p-12 lg:p-20 overflow-hidden">
        
        {/* Continuous Background Animations: Glowing Orbs */}
        <motion.div 
          animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-green/20 rounded-full blur-[150px] pointer-events-none" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" 
        />

        {/* Continuous Background Animations: Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 bg-brand-green/30 rounded-full blur-[1px]"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 60 - 30, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-start gap-10">
          
          {/* Logo - Continuous floating effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.img 
              src={logo} 
              alt="My Buddy Worker" 
              className="h-32 lg:h-40 object-contain drop-shadow-2xl"
              animate={{ y: [-8, 8, -8] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Hero Typography & Feature List */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full">
            <motion.h1 variants={itemVariants} className="text-5xl xl:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-4">
              System <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">
                Administration.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-gray-400 text-lg font-light mb-10">
              Access the centralized control panel to manage users and monitor operations.
            </motion.p>
            
            <div className="space-y-5">
              {[
                { icon: ShieldCheck, text: "Enterprise-grade security" },
                { icon: Zap, text: "Lightning fast performance" },
                { icon: LayoutDashboard, text: "Intuitive dashboard" }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} className="flex items-center gap-4 text-gray-300 group cursor-default">
                  <div className="relative p-3 bg-brand-green/10 rounded-xl text-brand-green group-hover:bg-brand-green group-hover:text-black transition-all duration-300">
                    <feature.icon size={22} />
                    {/* Tiny continuous pulse on icons */}
                    <motion.div 
                      className="absolute inset-0 border border-brand-green rounded-xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                    />
                  </div>
                  <span className="text-md font-medium group-hover:text-white transition-colors">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Footer Text Fixed to Bottom Left */}
        <div className="absolute bottom-8 left-12 lg:left-20 z-10 text-sm text-gray-600 font-medium">
          © {new Date().getFullYear()} My Buddy Worker.
        </div>
      </div>


      {/* ---------------- RIGHT SIDE: Clean Login Form ---------------- */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-black/40 backdrop-blur-xl">
        
        {/* Mobile Logo (Floating) */}
        <motion.div 
          className="absolute top-8 left-8 lg:hidden"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={logo} alt="Logo" className="h-20 object-contain" />
        </motion.div>

        {/* Form Container with Continuous Ambient Glow */}
        <motion.div className="w-full max-w-md relative">
          <motion.div 
            className="absolute -inset-4 bg-brand-green/5 rounded-[2rem] blur-xl z-0"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(0,204,68,0.15)]">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                Admin Portal
              </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="show">
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
                  Secure Login
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  Enter your administrative credentials to continue.
                </p>
              </motion.div>

              <form className="space-y-5">
                <motion.div variants={itemVariants} className="group relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-focus-within:text-brand-green transition-colors" />
                  <input 
                    type="email" 
                    placeholder="admin@mybuddyworker.com" 
                    className="w-full bg-gray-900/60 text-white border border-gray-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-600 shadow-inner"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="group relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-500 group-focus-within:text-brand-green transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-gray-900/60 text-white border border-gray-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-600 shadow-inner"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                    <input type="checkbox" className="accent-brand-green rounded border-gray-800 bg-gray-900 text-brand-green focus:ring-brand-green/50 w-4 h-4 cursor-pointer" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-medium text-brand-green hover:text-emerald-400 transition-colors">
                    Forgot password?
                  </a>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden bg-brand-green text-black font-bold py-4 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(0,204,68,0.2)] hover:shadow-[0_0_30px_rgba(0,204,68,0.4)]"
                >
                  <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <span className="relative flex items-center justify-center gap-2 text-lg">
                    Access Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}