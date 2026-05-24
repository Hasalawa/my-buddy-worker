import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Bell, Search, Menu, ChevronDown, Sun, Moon } from "lucide-react"; // Sun, Moon අලුතින් ගත්තා
import Sidebar from "../components/Sidebar";
import Preloader from "../components/Preloader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();

  // --- Theme Management Logic ---
  // LocalStorage එකේ තියෙන Theme එක ගන්නවා. නැත්නම් Default 'dark' විදියට ගන්නවා.
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    // Theme එක මාරු වෙනකොට HTML tag එකට 'dark' class එක දානවා/අයින් කරනවා
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // LocalStorage එකේ Save කරනවා
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
                  K
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Kehan Hasalaka</p>
                  <p className="text-xs text-brand-green font-medium">Super Admin</p>
                </div>
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-green transition-all z-10">            <div className="p-6 lg:p-8">
            <Outlet />
          </div>
          </div>
        </main>
      </div>
    </>
  );
}