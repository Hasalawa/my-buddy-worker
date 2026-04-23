import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  DollarSign,
  Activity,
  LayoutDashboard,
  Settings,
  LogOut,
  GraduationCap,
  UserPlus, // Add Admin අයිකන් එක
} from "lucide-react";
import logo from "../assets/images/logo.png";

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Reusable NavItem (Click කරාම Route මාරු වෙනවා)
  const NavItem = ({ icon: Icon, label, path, textClass = "" }: any) => {
    const active = location.pathname === path;
    
    return (
      <div
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group ${
          active ? "bg-brand-green/10 text-brand-green" : "text-gray-400 hover:bg-gray-800 hover:text-white"
        } ${textClass}`}
      >
        <Icon size={20} className={active ? "text-brand-green" : "text-gray-500 group-hover:text-gray-300"} />
        <span className="font-medium text-sm whitespace-nowrap">{label}</span>
      </div>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ x: sidebarOpen ? 0 : -300, width: sidebarOpen ? "280px" : "0px" }}
      transition={{ duration: 0.3, type: "tween" }}
      className="h-full bg-[#111111] border-r border-gray-800/50 flex flex-col z-20 relative overflow-hidden"
    >
      <div className="p-6 flex items-center gap-4 min-w-[280px]">
        <img src={logo} alt="My Buddy Worker" className="h-10 object-contain drop-shadow-lg" />
        <span className="font-bold text-xl tracking-tight text-white">
          Admin<span className="text-brand-green">Portal</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-w-[280px] custom-scrollbar">
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <NavItem icon={GraduationCap} label="Students (Workers)" path="/students" />
        <NavItem icon={Briefcase} label="Buyers (Employers)" path="/buyers" />
        <NavItem icon={Activity} label="Job Listings" path="/jobs" />
        <NavItem icon={DollarSign} label="Payments" path="/payments" />
        
        {/* අලුත් Add Admin ලින්ක් එක */}
        <div className="pt-4 mt-4 border-t border-gray-800/50">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">System</p>
          <NavItem icon={UserPlus} label="Add Administrator" path="/add-admin" />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800/50 min-w-[280px]">
        <NavItem icon={Settings} label="Settings" path="/settings" />
        <NavItem icon={LogOut} label="Logout" path="/" textClass="text-red-400 hover:text-red-300" />
      </div>
    </motion.aside>
  );
}