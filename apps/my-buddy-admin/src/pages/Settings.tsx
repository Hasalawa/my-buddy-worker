import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  User, Shield, Sliders, Bell, Save, 
  Smartphone, Key, Mail, Building 
} from 'lucide-react';

// updateDoc වෙනුවට setDoc import කරගත්තා
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'system' | 'notifications'>('profile');

  // Toggle States
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Settings පිටුවට එද්දී Database එකේ තියෙන ඇත්ත 2FA තත්ත්වය අරන් Toggle එකට දානවා
  useEffect(() => {
    const fetchAdminSettings = async () => {
      if (auth.currentUser) {
        try {
          const adminRef = doc(db, 'admins', auth.currentUser.uid);
          const docSnap = await getDoc(adminRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Database එකේ true කියලා තිබ්බොත් විතරක් On කරනවා
            if (data.twoFactorEnabled === true) {
              setTwoFactor(true);
            } else {
              setTwoFactor(false);
            }
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
    };

    fetchAdminSettings();
  }, []);

  // 2FA Firebase එකට Update කරන Function එක
  const handle2FAToggle = async () => {
    const newValue = !twoFactor;
    setTwoFactor(newValue); // මුලින්ම UI එක Update කරනවා

    try {
      if (auth.currentUser) {
        const adminRef = doc(db, 'admins', auth.currentUser.uid);
        
        // අලුත් ඒව හැදෙන්නෙ නැති වෙන්න, පරණ එකම Update වෙන්න setDoc with merge:true පාවිච්චි කරනවා
        await setDoc(adminRef, {
          twoFactorEnabled: newValue
        }, { merge: true });
        
        console.log(`✅ 2FA Status updated to: ${newValue}`);
      } else {
        console.warn("User not authenticated.");
        setTwoFactor(!newValue);
      }
    } catch (error) {
      console.error("❌ Error updating 2FA settings:", error);
      setTwoFactor(!newValue); // Error එකක් ආවොත් කලින් තිබ්බ විදියටම හදනවා
    }
  };

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Background Glow */}
      <div className="absolute top-0 left-[-5%] w-[400px] h-[400px] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-800/50 pb-6 transition-colors duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">System Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-300">Manage your account and platform configurations.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-500 text-black px-5 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-[0_0_15px_rgba(0,204,68,0.2)]">
            <Save size={18} />
            Save Changes
          </button>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Vertical Sidebar Tabs */}
          <motion.div variants={itemVariants} className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="My Profile" />
            <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Security & 2FA" />
            <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={Sliders} label="Platform Settings" />
            <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Notifications" />
          </motion.div>

          {/* Settings Content Area */}
          <motion.div variants={itemVariants} className="flex-1 bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl min-h-[500px] transition-colors duration-300">
            <AnimatePresence mode="wait">
              
              {/* ---------------- PROFILE SETTINGS ---------------- */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/50 pb-4 transition-colors duration-300">Personal Information</h3>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center text-3xl font-bold border border-brand-green/30">
                      K
                    </div>
                    <div>
                      <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300 font-medium border border-gray-200 dark:border-gray-700">Change Avatar</button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField label="Full Name" defaultValue="Kehan Hasalawa" icon={User} />
                    <InputField label="Email Address" defaultValue="admin@mybuddyworker.com" icon={Mail} />
                    <InputField label="Role" defaultValue="Super Admin" icon={Shield} disabled />
                    <InputField label="Department" defaultValue="Core Development" icon={Building} />
                  </div>
                </motion.div>
              )}

              {/* ---------------- SECURITY SETTINGS ---------------- */}
              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/50 pb-4 mb-6 transition-colors duration-300">Change Password</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InputField label="Current Password" type="password" placeholder="••••••••" icon={Key} />
                      <div className="hidden sm:block"></div>
                      <InputField label="New Password" type="password" placeholder="••••••••" icon={Key} />
                      <InputField label="Confirm New Password" type="password" placeholder="••••••••" icon={Key} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/50 pb-4 mb-6 transition-colors duration-300">Two-Factor Authentication (2FA)</h3>
                    <div className="flex items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30 transition-colors duration-300">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg hidden sm:block">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <h4 className="text-gray-900 dark:text-white font-medium mb-1 transition-colors duration-300">Require 2FA for Login</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Adds an extra layer of security using a mobile OTP.</p>
                        </div>
                      </div>
                      <ToggleSwitch enabled={twoFactor} onToggle={handle2FAToggle} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ---------------- PLATFORM SETTINGS ---------------- */}
              {activeTab === 'system' && (
                <motion.div key="system" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/50 pb-4 mb-6 transition-colors duration-300">Financial Configuration</h3>
                    <div className="max-w-md">
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block transition-colors duration-300">Platform Commission Rate (%)</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          defaultValue="10" 
                          className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-4 pr-4 outline-none focus:border-brand-green transition-colors duration-300 text-lg font-bold"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">The percentage taken from every successful job transaction.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/50 pb-4 mb-6 transition-colors duration-300">System Status</h3>
                    <div className="flex items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 transition-colors duration-300">
                      <div>
                        <h4 className="text-red-600 dark:text-red-400 font-bold mb-1 transition-colors duration-300">Maintenance Mode</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Disables the app for all users. Only Super Admins can log in.</p>
                      </div>
                      <ToggleSwitch enabled={maintenanceMode} onToggle={() => setMaintenanceMode(!maintenanceMode)} danger />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ---------------- NOTIFICATIONS ---------------- */}
              {activeTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800/50 pb-4 mb-6 transition-colors duration-300">Alert Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-300">
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-medium text-sm transition-colors duration-300">Email Summaries</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Receive daily reports of system activity.</p>
                      </div>
                      <ToggleSwitch enabled={emailAlerts} onToggle={() => setEmailAlerts(!emailAlerts)} />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-300">
                      <div>
                        <h4 className="text-gray-900 dark:text-white font-medium text-sm transition-colors duration-300">Urgent Push Notifications</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Get browser alerts for new disputes or flagged content.</p>
                      </div>
                      <ToggleSwitch enabled={pushAlerts} onToggle={() => setPushAlerts(!pushAlerts)} />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

// --- Reusable UI Components ---

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap text-left ${
        active ? 'text-brand-green bg-brand-green/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
    >
      <Icon size={18} className={active ? "text-brand-green" : "text-gray-400 dark:text-gray-500"} />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function InputField({ label, type = "text", defaultValue, placeholder, icon: Icon, disabled = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-600 group-focus-within:text-brand-green transition-colors duration-300" />}
        <input 
          type={type} 
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4 outline-none transition-colors duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-brand-green focus:ring-1 focus:ring-brand-green'
          }`}
        />
      </div>
    </div>
  );
}

function ToggleSwitch({ enabled, onToggle, danger = false }: any) {
  const activeColor = danger ? 'bg-red-500' : 'bg-brand-green';
  
  return (
    <div 
      className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full relative cursor-pointer transition-colors duration-300 shrink-0 ${enabled ? activeColor : 'bg-gray-200 dark:bg-gray-800'}`} 
      onClick={onToggle}
    >
      <div 
        className="absolute top-1 bottom-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out"
        style={{ left: enabled ? 'calc(100% - 1.25rem - 4px)' : '0.25rem' }}
      />
    </div>
  );
}