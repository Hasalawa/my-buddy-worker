import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { UserPlus, Shield, Mail, Key, ShieldCheck, ArrowLeft, Check, AlertCircle, IdCard, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Animations ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AddAdmin() {
  const navigate = useNavigate(); // Back button එක වැඩ කරන්න මේක ගත්තා
  
  const [selectedRole, setSelectedRole] = useState('Moderator');
  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageJobs: true,
    viewFinancials: false,
    systemSettings: false,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    // overflow-x-clip එකෙන් horizontal scroll වෙන එක සම්පූර්ණයෙන්ම නවත්තනවා
    <div className="w-full relative overflow-x-clip pb-10">
      
      {/* Background Ambient Glow - Responsive Size & Safely Positioned */}
      <div className="absolute top-0 right-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-[90px] md:blur-[120px] pointer-events-none -z-10 translate-x-1/4 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto w-full">
        
        {/* Header Section (Responsive flex-col on mobile) */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} // කලින් පිටුවට යන Function එක දැම්මා
            className="w-10 h-10 flex items-center justify-center shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-brand-green dark:hover:border-brand-green transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex flex-wrap items-center gap-2 sm:gap-3 transition-colors duration-300">
              Add Administrator
              <span className="px-2.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                System
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs sm:text-sm transition-colors duration-300">Create a new admin user and configure their access levels.</p>
          </div>
        </motion.div>

        {/* Main Grid changes to 1 column on mobile, 3 columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* LEFT SIDE: Form Inputs */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 w-full">
            <div className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-sm shadow-xl w-full transition-colors duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
                <UserPlus className="text-brand-green" size={20} />
                User Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Full Name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="e.g. Kehan Hasalawa" 
                      className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 sm:py-3 pl-4 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-brand-green transition-colors" />
                    <input 
                      type="email" 
                      placeholder="admin@company.com" 
                      className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* අලුතින් එකතු කරපු NIC Field එක */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">NIC Number</label>
                  <div className="relative group">
                    <IdCard className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-brand-green transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. 199912345678" 
                      className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* අලුතින් එකතු කරපු Mobile Number Field එක */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-brand-green transition-colors" />
                    <input 
                      type="tel" 
                      placeholder="e.g. +94770000000" 
                      className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Temporary Password</label>
                  <div className="relative group">
                    <Key className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-brand-green transition-colors" />
                    <input 
                      type="text" 
                      value="Auto-generated upon creation" 
                      disabled
                      className="w-full bg-gray-100 dark:bg-gray-900/30 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800/50 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none cursor-not-allowed text-sm sm:text-base transition-colors duration-300"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1.5 mt-2 transition-colors duration-300">
                    <AlertCircle size={14} className="shrink-0" />
                    A secure password link will be emailed to the user.
                  </p>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-sm shadow-xl w-full transition-colors duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
                <Shield className="text-brand-green" size={20} />
                Access Role
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RoleCard 
                  title="Super Admin" 
                  desc="Full access to all system features." 
                  selected={selectedRole === 'Super Admin'} 
                  onClick={() => setSelectedRole('Super Admin')}
                />
                <RoleCard 
                  title="Moderator" 
                  desc="Can manage jobs and users only." 
                  selected={selectedRole === 'Moderator'} 
                  onClick={() => setSelectedRole('Moderator')}
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Permissions & Submit */}
          <motion.div variants={itemVariants} className="space-y-6 w-full">
            <div className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl w-full transition-colors duration-300">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">Specific Permissions</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed transition-colors duration-300">Fine-tune what this user can do. Overrides default role settings.</p>

              <div className="space-y-5 sm:space-y-4">
                <PermissionToggle label="Manage Users" active={permissions.manageUsers} onClick={() => togglePermission('manageUsers')} />
                <PermissionToggle label="Manage Job Listings" active={permissions.manageJobs} onClick={() => togglePermission('manageJobs')} />
                <PermissionToggle label="View Financial Data" active={permissions.viewFinancials} onClick={() => togglePermission('viewFinancials')} />
                <PermissionToggle label="System Settings" active={permissions.systemSettings} onClick={() => togglePermission('systemSettings')} />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-green text-black font-bold py-3.5 sm:py-4 rounded-xl shadow-[0_0_20px_rgba(0,204,68,0.2)] hover:shadow-[0_0_30px_rgba(0,204,68,0.4)] flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
            >
              <ShieldCheck size={18} />
              Create Administrator
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

// --- Reusable UI Components ---

function RoleCard({ title, desc, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-300 w-full ${
        selected 
          ? 'bg-brand-green/10 border-brand-green' 
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${selected ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>{title}</h4>
        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${selected ? 'border-brand-green bg-brand-green' : 'border-gray-300 dark:border-gray-600'}`}>
          {selected && <Check size={12} className="text-black" />}
        </div>
      </div>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{desc}</p>
    </div>
  );
}

function PermissionToggle({ label, active, onClick }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onClick}>
      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">{label}</span>
      <div className={`flex items-center w-10 h-5 sm:w-11 sm:h-6 rounded-full px-1 transition-colors duration-300 shrink-0 ${active ? 'bg-brand-green justify-end' : 'bg-gray-200 dark:bg-gray-800 justify-start'}`}>
        <motion.div 
          layout
          className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-sm"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
}