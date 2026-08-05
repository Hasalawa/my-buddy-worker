import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Users, Briefcase, DollarSign, Activity, LayoutDashboard,
  Settings, LogOut, UserPlus, ShieldAlert,
  FileText, MessageSquareWarning,
  Smartphone
} from "lucide-react";
import logo from "../assets/images/logo.png";
import logoLight from '../assets/images/logo_lightMode.png';

// --- Firebase Imports අලුතින් එකතු කළා ---
import { db } from '../config/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Logout Modal State ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- Logout Function එක Async කරලා Firebase Update එක දැම්මා ---
  const confirmLogout = async () => {
    try {
      // Session storage එකෙන් දැනට ඉන්න admin ගේ විස්තර ගන්නවා
      const storedAdminStr = sessionStorage.getItem('adminUser');
      if (storedAdminStr) {
        const adminObj = JSON.parse(storedAdminStr);
        const adminId = adminObj.id || adminObj.uid; // ID එක ගන්නවා

        if (adminId) {
          // Firestore එකේ status එකයි logoutTime එකයි update කරනවා
          await updateDoc(doc(db, 'admins', adminId), {
            status: "Offline",
            logoutTime: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error("Error updating logout status:", error);
    } finally {
      // අන්තිමට Session එක අයින් කරලා ලොගින් එකට යනවා
      sessionStorage.removeItem('adminUser');
      setShowLogoutModal(false);
      navigate('/');
    }
  };

  // NavItem එකට onClickOverride එකක් දැම්මා custom clicks අල්ලගන්න
  const NavItem = ({ icon: Icon, label, path, textClass = "", badge, onClickOverride }: any) => {
    const active = location.pathname === path && !onClickOverride;
    return (
      <div
        onClick={() => {
          if (onClickOverride) {
            onClickOverride();
          } else {
            navigate(path);
          }
        }}
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group ${active
          ? "bg-brand-green/10 text-brand-green"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          } ${textClass}`}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={20}
            className={active ? "text-brand-green" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}
          />
          <span className="font-medium text-sm whitespace-nowrap">{label}</span>
        </div>
        {badge && (
          <span className="bg-red-500/10 dark:bg-red-500/20 text-red-500 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300, width: sidebarOpen ? "280px" : "0px" }}
        transition={{ duration: 0.3, type: "tween" }}
        // මෙතන Background එක සහ Border එක Light/Dark දෙකටම හැදුවා
        className="h-full bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-gray-800/50 flex flex-col z-20 relative overflow-hidden shrink-0 transition-colors duration-300"
      >
        <div className="p-6 flex items-center gap-4 min-w-[280px]">
          <img src={logo} alt="My Buddy Worker" className="hidden dark:block h-10 object-contain drop-shadow-lg" />
          <img src={logoLight} alt="My Buddy Worker" className="block dark:hidden h-10 object-contain drop-shadow-lg" />
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
            Admin<span className="text-brand-green">Portal</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto min-w-[280px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-green transition-all">
          <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 mt-2 transition-colors duration-300">Overview</p>
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
          <NavItem icon={Activity} label="Analytics & Reports" path="/analytics" />

          <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 mt-6 transition-colors duration-300">Management</p>
          <NavItem icon={Users} label="User Management" path="/users" badge="12" />
          <NavItem icon={Briefcase} label="Job Management" path="/jobs" />
          <NavItem icon={DollarSign} label="Payments & Finance" path="/finance" />

          <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 mt-6 transition-colors duration-300">Moderation</p>
          <NavItem icon={MessageSquareWarning} label="Disputes & Support" path="/support" badge="3" />
          <NavItem icon={ShieldAlert} label="Flagged Content" path="/flagged" />
          <NavItem icon={Smartphone} label="App Complaints" path="/app-complaints" />

          <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 mt-6 transition-colors duration-300">System</p>
          <NavItem icon={UserPlus} label="Administrators" path="/admins" />
          <NavItem icon={FileText} label="Audit Logs" path="/audit-logs" />
        </nav>

        {/* මෙතන Border Top එක Light/Dark දෙකටම හැදුවා */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800/50 min-w-[280px] transition-colors duration-300">
          <NavItem icon={Settings} label="Settings" path="/settings" />
          {/* Logout බොත්තමේ රතු පාටත් Light Mode එකේදී පැහැදිලිව පේන්න හැදුවා */}
          <NavItem
            icon={LogOut}
            label="Logout"
            path="/"
            textClass="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
            onClickOverride={() => setShowLogoutModal(true)} // custom click event එක
          />
        </div>
      </motion.aside>

      {/* --- Logout Confirmation Modal --- */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-sm bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-center transition-colors duration-300"
            >
              <motion.div
                animate={{ x: [0, 5, 0] }} // ලස්සනට එළියට යනවා වගේ animate වෙනවා
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4"
              >
                <LogOut size={32} className="ml-1" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Do you really want to log out of the Admin Portal?
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold shadow-md"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}