import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, ShieldCheck, Zap, LayoutDashboard, 
  Smartphone, RefreshCw, Sun, Moon, ArrowLeft, 
  CheckCircle, XCircle, AlertCircle, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import logo from '../assets/images/logo.png'; 
import logoLight from '../assets/images/logo_lightMode.png';
import { sendDiscordLog } from '../utils/discord';

// Firebase imports 
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Firestore වලින් දත්ත ගන්න මේක එකතු කළා
import { auth, db } from '../config/firebase'; // db එකත් import කළා

// --- Framer Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// --- Custom Toast Type ---
type ToastType = {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
};

export default function AuthPage() {
  const navigate = useNavigate();
  
  // --- Theme Management ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // --- Form & Flow States ---
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Firebase SMS OTP Confirmation Object Save කරගන්න State එක
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // 2FA එකට ආවම පළවෙනි input එකට auto-focus කරන්න
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 500); // Animation එකට යන වෙලාව නිසා 300 වෙනුවට 500ක් දුන්නා
    }
  }, [step]);

  // --- Custom Toast State & Logic ---
  const [toast, setToast] = useState<ToastType>({ show: false, message: '', type: 'success' });
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // --- Handlers ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) return showToast("Please fill in all fields.", "warning");
    if (!isValidEmail(email)) return showToast("Invalid email format.", "error");
    if (password.length < 6) return showToast("Password must be at least 6 characters.", "warning");

    setIsLoading(true);
    try {
      // 1. Firebase Email/Password Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendDiscordLog(`🟢 Admin Login Success: ${email}`);
      
      // 2. Database එකෙන් බලනවා මෙයාට 2FA Enable කරලාද තියෙන්නේ කියලා
      const adminRef = doc(db, 'admins', user.uid);
      const adminSnap = await getDoc(adminRef);
      const adminData = adminSnap.exists() ? adminSnap.data() : null;

      // 2FA On කරලා නම් විතරක් SMS යවනවා
      if (adminData && adminData.twoFactorEnabled === true) {
        showToast("Authentication successful! Sending SMS OTP...", "success");

        if (!(window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
            (window as any).recaptchaVerifier = null;
          } catch (error) {
            console.error("Recaptcha clear error", error);
          }
        }

        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
        const appVerifier = (window as any).recaptchaVerifier;

        // Database එකේ තියෙන ෆෝන් නම්බර් එක ගන්නවා. නැත්නම් hardcode කරපු එක ගන්නවා
        const adminPhoneNumber = adminData.mobile ? (adminData.mobile.startsWith('+') ? adminData.mobile : `+94${adminData.mobile.substring(1)}`) : "+94770000078"; 

        const confirmation = await signInWithPhoneNumber(auth, adminPhoneNumber, appVerifier);
        setConfirmationResult(confirmation); 

        setTimeout(() => setStep(2), 1000); 

      } else {
        // 2FA Off කරලා නම් කෙලින්ම Dashboard එකට යවනවා
        showToast("Authentication successful! Welcome back.", "success");
        sessionStorage.setItem('is2FAVerified', 'true'); // Bypass the ProtectedRoute check
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        showToast("Invalid email or password.", "error");
      } else if (error.code === 'auth/too-many-requests') {
        showToast("Too many attempts. Please try again later.", "warning");
      } else {
        showToast(error.message || "An error occurred during login.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length < 6) return showToast("Please enter the complete 6-digit code.", "warning");

    setIsLoading(true);
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otpCode);
      }
      
      showToast("Security verified! Welcome back.", "success");
      sessionStorage.setItem('is2FAVerified', 'true');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error("OTP Error:", error);
      showToast("Invalid verification code. Try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return showToast("Please enter your email address.", "warning");
    if (!isValidEmail(email)) return showToast("Invalid email format.", "error");

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      await sendDiscordLog(`🟡 Password Reset Request: ${email}`);
      showToast("Password reset link sent to your email.", "success");
      setTimeout(() => setStep(1), 2000);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        showToast("No account found with this email.", "error");
      } else {
        showToast("Failed to send reset link. Try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; 
    if (value.length > 1) value = value[0]; 
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="h-screen w-full flex bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-300 relative">
      
      {/* Firebase SMS යවන්න ඕන කරන අදෘශ්‍යමාන ReCaptcha Container එක */}
      <div id="recaptcha-container"></div>

      {/* ================= CUSTOM TOAST NOTIFICATION ================= */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] min-w-[320px]"
          >
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
              toast.type === 'success' ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' :
              'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
            }`}>
              {toast.type === 'success' && <CheckCircle size={24} className="animate-pulse" />}
              {toast.type === 'error' && <XCircle size={24} />}
              {toast.type === 'warning' && <AlertCircle size={24} />}
              <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                {toast.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Theme Toggle Button --- */}
      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 p-3 rounded-full bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand-green dark:hover:text-brand-green transition-colors backdrop-blur-md shadow-sm"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* ---------------- LEFT SIDE: Branding & Visuals ---------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 dark:bg-[#0d0d0d] border-r border-gray-200 dark:border-gray-800/50 flex-col justify-center p-12 lg:p-20 overflow-hidden transition-colors duration-300">
        <motion.div animate={{ y: [0, -40, 0], scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-green/20 rounded-full blur-[150px] pointer-events-none" />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        {[...Array(6)].map((_, i) => (
          <motion.div key={`particle-${i}`} className="absolute w-1.5 h-1.5 bg-brand-green/30 rounded-full blur-[1px]" animate={{ y: [0, -100, 0], x: [0, Math.random() * 60 - 30, 0], opacity: [0.1, 0.6, 0.1], scale: [1, 1.5, 1] }} transition={{ duration: Math.random() * 5 + 7, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 3 }} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
        ))}
        
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-start gap-10">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }}>
            <motion.img src={logo} alt="My Buddy Worker" className="hidden dark:block h-32 lg:h-40 object-contain drop-shadow-2xl" animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            <motion.img src={logoLight} alt="My Buddy Worker" className="block dark:hidden h-32 lg:h-40 object-contain drop-shadow-2xl" animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full">
            <motion.h1 variants={itemVariants} className="text-5xl xl:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight mb-4">
              System <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-400">
                Administration.
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-500 dark:text-gray-400 text-lg font-light mb-10 transition-colors duration-300">
              Access the centralized control panel to manage users and monitor operations.
            </motion.p>
            
            <div className="space-y-5">
              {[
                { icon: ShieldCheck, text: "Enterprise-grade security" },
                { icon: Zap, text: "Lightning fast performance" },
                { icon: LayoutDashboard, text: "Intuitive dashboard" }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} className="flex items-center gap-4 text-gray-600 dark:text-gray-300 group cursor-default transition-colors duration-300">
                  <div className="relative p-3 bg-brand-green/10 rounded-xl text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                    <feature.icon size={22} />
                    <motion.div className="absolute inset-0 border border-brand-green rounded-xl" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }} />
                  </div>
                  <span className="text-md font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---------------- RIGHT SIDE: Forms Area ---------------- */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-colors duration-300">
        
        <motion.div className="absolute top-8 left-8 lg:hidden" animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <img src={logo} alt="Logo" className="hidden dark:block h-20 object-contain" />
          <img src={logoLight} alt="Logo" className="block dark:hidden h-20 object-contain" />
        </motion.div>

        <motion.div className="w-full max-w-md relative">
          <motion.div className="absolute -inset-4 bg-brand-green/5 rounded-[2rem] blur-xl z-0" animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.98, 1.02, 0.98] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

          <div className="relative z-10 overflow-hidden px-1">
            
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(0,204,68,0.15)]">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                {step === 1 ? 'Admin Portal' : step === 2 ? 'Security Check' : 'Account Recovery'}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              
              {/* ================= STEP 1: LOGIN FORM ================= */}
              {step === 1 && (
                <motion.div key="login-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div className="mb-8">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Secure Login</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base transition-colors duration-300">Enter your administrative credentials to continue.</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleLoginSubmit} noValidate>
                    <div className="group relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-green transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@mybuddyworker.com" 
                        disabled={isLoading}
                        className="w-full bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner disabled:opacity-50" 
                      />
                    </div>

                    <div className="group relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-green transition-colors" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        disabled={isLoading}
                        className="w-full bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner disabled:opacity-50" 
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-300">
                        <input type="checkbox" className="accent-brand-green rounded border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-green focus:ring-brand-green/50 w-4 h-4 cursor-pointer transition-colors duration-300" />
                        Remember me
                      </label>
                      <button type="button" onClick={() => setStep(3)} className="text-sm font-medium text-brand-green hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                        Forgot password?
                      </button>
                    </div>

                    <motion.button disabled={isLoading} whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}} type="submit" className="w-full relative group overflow-hidden bg-brand-green text-black font-bold py-4 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(0,204,68,0.2)] hover:shadow-[0_0_30px_rgba(0,204,68,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
                      {!isLoading && <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />}
                      <span className="relative flex items-center justify-center gap-2 text-lg">
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                          <>Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* ================= STEP 2: TWO-FACTOR AUTH (2FA) ================= */}
              {step === 2 && (
                <motion.div key="2fa-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-brand-green/10 border border-brand-green/20 rounded-2xl flex items-center justify-center mb-6 text-brand-green">
                      <Smartphone size={24} />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Two-Step Verification</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed transition-colors duration-300">
                      We've sent a 6-digit verification code to your registered mobile device.
                    </p>
                  </div>

                  <form className="space-y-8" onSubmit={handle2FASubmit}>
                    <div className="flex justify-between gap-2 sm:gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { inputRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          disabled={isLoading}
                          autoFocus={index === 0} 
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-10 h-12 sm:w-12 sm:h-14 lg:w-14 lg:h-16 text-center text-xl sm:text-2xl font-bold bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all shadow-inner disabled:opacity-50"
                        />
                      ))}
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                      <motion.button disabled={isLoading} whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}} type="submit" className="w-full relative group overflow-hidden bg-brand-green text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,204,68,0.2)] hover:shadow-[0_0_30px_rgba(0,204,68,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
                        {!isLoading && <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />}
                        <span className="relative flex items-center justify-center gap-2 text-lg">
                          {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                            <><ShieldCheck size={20} /> Verify & Access Dashboard</>
                          )}
                        </span>
                      </motion.button>
                      
                      <button type="button" disabled={isLoading} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Didn't receive the code? Resend
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ================= STEP 3: FORGOT PASSWORD ================= */}
              {step === 3 && (
                <motion.div key="forgot-password-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div className="mb-8">
                    <button type="button" onClick={() => setStep(1)} className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">
                      <ArrowLeft size={16} /> Back to Login
                    </button>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Reset Password</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base transition-colors duration-300">Enter your email address and we'll send you a link to reset your password.</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleForgotPasswordSubmit} noValidate>
                    <div className="group relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-brand-green transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@mybuddyworker.com" 
                        disabled={isLoading}
                        className="w-full bg-white dark:bg-gray-900/60 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner disabled:opacity-50" 
                      />
                    </div>

                    <motion.button disabled={isLoading} whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}} type="submit" className="w-full relative group overflow-hidden bg-brand-green text-black font-bold py-4 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(0,204,68,0.2)] hover:shadow-[0_0_30px_rgba(0,204,68,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
                      {!isLoading && <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />}
                      <span className="relative flex items-center justify-center gap-2 text-lg">
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                          <>Send Reset Link <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}