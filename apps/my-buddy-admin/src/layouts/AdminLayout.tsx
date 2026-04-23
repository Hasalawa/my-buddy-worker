import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Preloader from "../components/Preloader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();

  // Route එක මාරු වෙන හැම වෙලාවෙම Preloader එක පෙන්නන්න
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1200); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* 1. Preloader එක දැන් සම්පූර්ණ පිටුවටම උඩින් (Full Screen) දාලා තියෙන්නේ */}
      <AnimatePresence mode="wait">
        {isPageLoading && <Preloader key="preloader" />}
      </AnimatePresence>

      {/* 2. Main Dashboard Layout එක */}
      <div className="h-screen w-full flex bg-[#0a0a0a] text-white font-sans overflow-hidden selection:bg-brand-green/30">
        <Sidebar sidebarOpen={sidebarOpen} />

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Ambient Background Glows */}
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[150px] pointer-events-none" />

          {/* Header */}
          <header className="h-20 border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-full px-4 py-2">
                <Search size={18} className="text-gray-500" />
                <input type="text" placeholder="Search users, jobs..." className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-gray-600" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative text-gray-400 hover:text-white transition-colors">
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-green rounded-full border-2 border-[#0a0a0a]"></span>
              </button>
              <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-green to-emerald-600 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(0,204,68,0.2)]">
                  K
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold">Kehan Hasalaka</p>
                  <p className="text-xs text-brand-green font-medium">Super Admin</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto relative custom-scrollbar z-10">
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}