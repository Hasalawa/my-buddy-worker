import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Users, Briefcase, DollarSign, Activity, LayoutDashboard, 
  Settings, LogOut, UserPlus, ShieldAlert, 
  FileText, MessageSquareWarning
} from "lucide-react";
import logo from "../assets/images/logo.png";

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  const NavItem = ({ icon: Icon, label, path, textClass = "", badge }: any) => {
    const active = location.pathname === path;
    return (
      <div
        onClick={() => navigate(path)}
        className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all group ${
          active ? "bg-brand-green/10 text-brand-green" : "text-gray-400 hover:bg-gray-800 hover:text-white"
        } ${textClass}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={active ? "text-brand-green" : "text-gray-500 group-hover:text-gray-300"} />
          <span className="font-medium text-sm whitespace-nowrap">{label}</span>
        </div>
        {badge && (
          <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ x: sidebarOpen ? 0 : -300, width: sidebarOpen ? "280px" : "0px" }}
      transition={{ duration: 0.3, type: "tween" }}
      className="h-full bg-[#111111] border-r border-gray-800/50 flex flex-col z-20 relative overflow-hidden shrink-0"
    >
      <div className="p-6 flex items-center gap-4 min-w-[280px]">
        <img src={logo} alt="My Buddy Worker" className="h-10 object-contain drop-shadow-lg" />
        <span className="font-bold text-xl tracking-tight text-white">
          Admin<span className="text-brand-green">Portal</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto min-w-[280px] custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2 mt-2">Overview</p>
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <NavItem icon={Activity} label="Analytics & Reports" path="/analytics" />

        <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2 mt-6">Management</p>
        <NavItem icon={Users} label="User Management" path="/users" badge="12" /> {/* Verification queue badge */}
        <NavItem icon={Briefcase} label="Job Management" path="/jobs" />
        <NavItem icon={DollarSign} label="Payments & Finance" path="/finance" />
        
        <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2 mt-6">Moderation</p>
        <NavItem icon={MessageSquareWarning} label="Disputes & Support" path="/support" badge="3" />
        <NavItem icon={ShieldAlert} label="Flagged Content" path="/flagged" />

        <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2 mt-6">System</p>
        <NavItem icon={UserPlus} label="Administrators" path="/admins" />
        <NavItem icon={FileText} label="Audit Logs" path="/audit-logs" />
      </nav>

      <div className="p-4 border-t border-gray-800/50 min-w-[280px]">
        <NavItem icon={Settings} label="Settings" path="/settings" />
        <NavItem icon={LogOut} label="Logout" path="/" textClass="text-red-400 hover:text-red-300" />
      </div>
    </motion.aside>
  );
}