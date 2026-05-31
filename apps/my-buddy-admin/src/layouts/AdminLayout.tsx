import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, Menu, ChevronDown, Sun, Moon, AlertCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Preloader from "../components/Preloader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // --- Session Admin Data State ---
  const [adminName, setAdminName] = useState("Loading...");
  const [adminRole, setAdminRole] = useState("...");

  useEffect(() => {
    // sessionStorage එකෙන් adminUser data එක අරගෙන state එකට දානවා
    const storedAdminData = sessionStorage.getItem("adminUser");
    if (storedAdminData) {
      try {
        const adminObj = JSON.parse(storedAdminData);
        if (adminObj.name) setAdminName(adminObj.name);
        if (adminObj.role) setAdminRole(adminObj.role);
      } catch (error) {
        console.error("Failed to parse admin data", error);
      }
    }
  }, []);
  // -----------------------------

  // --- Session Timeout Logic ---
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = () => {
    sessionStorage.removeItem('adminUser');
    setIsSessionExpired(true);
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // විනාඩි 5කට (මිලි තත්පර 300,000) ටයිමරය සකසන්න
    timeoutRef.current = setTimeout(handleLogout, 300000);
  };

  useEffect(() => {
    // පළමු වතාවට Timer එක පටන් ගන්නවා
    resetTimer();

    // User ගේ ක්‍රියාකාරකම් (Mouse move, Key press, etc.) අඳුරගන්න Events
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      // Session එක දැනටමත් expire වෙලා නම් ආයෙත් timer reset කරන්නේ නෑ
      if (!isSessionExpired) {
        resetTimer();
      }
    };

    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [isSessionExpired]);
  // -----------------------------

  // --- Theme Management Logic ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  // ------------------------------

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isPageLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {/* --- Session Expired Modal --- */}
      <AnimatePresence>
        {isSessionExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-sm bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-center transition-colors duration-300"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4"
              >
                <AlertCircle size={32} />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Session Expired</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                You have been inactive for 5 minutes. For your security, you have been logged out.
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold shadow-md"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Layout (Theme Classes Added) */}
      <div className="h-screen w-full flex bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans overflow-hidden selection:bg-brand-green/30 transition-colors duration-300">
        <Sidebar sidebarOpen={sidebarOpen} />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Ambient Background Glows */}
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[150px] pointer-events-none" />

          {/* Header */}
          <header className="h-20 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 transition-colors">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
                <input type="text" placeholder="Search users, jobs..." className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-gray-500 dark:placeholder:text-gray-600 text-black dark:text-white" />
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">

              {/* --- Theme Toggle Button --- */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="relative text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-green rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
              </button>

              <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200 dark:border-gray-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-green to-emerald-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,204,68,0.2)]">
                  {/* නමේ මුල් අකුර පෙන්වන්න */}
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{adminName}</p>
                  <p className="text-xs text-brand-green font-medium">{adminRole}</p>
                </div>
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-green transition-all z-10">
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}