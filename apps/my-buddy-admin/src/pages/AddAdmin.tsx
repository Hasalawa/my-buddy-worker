import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { UserPlus, Shield, Mail, Key, ShieldCheck, ArrowLeft, Check, AlertCircle, IdCard, Phone, RotateCcw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

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
  const navigate = useNavigate();

  // --- Form States ---
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [nic, setNic] = useState('');
  const [selectedRole, setSelectedRole] = useState('Moderator');
  const [permissions, setPermissions] = useState({
    manageUsers: true,
    manageJobs: true,
    viewFinancials: false,
    systemSettings: false,
  });

  // Generated States
  const [randomDigits, setRandomDigits] = useState('');
  const [computedEmail, setComputedEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('Auto-generated upon creation');

  // Dialog & Status States
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Auto-closing Toast Notification State ---
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    // කලින් timeout එකක් තිබ්බොත් ඒක clear කරනවා
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    // තත්පර 3කින් toast එක අයින් කරනවා
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Generate the 3 random digits when component mounts or resets
  useEffect(() => {
    setRandomDigits(Math.floor(100 + Math.random() * 900).toString());

    // Component එක unmount වෙද්දි timeout එක clear කරනවා
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Update computed email when name changes
  useEffect(() => {
    if (name.trim() !== '') {
      const formattedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      setComputedEmail(`${formattedName}${randomDigits}.mybuddyworker@gmail.com`);
    } else {
      setComputedEmail('');
    }
  }, [name, randomDigits]);

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Generate a random secure password
  const generateSecurePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // --- Validation Logic ---
  const handleValidationAndConfirm = async () => {
    if (!name.trim() || !mobile.trim() || !nic.trim()) {
      return showToast("Please fill in all the required fields (Name, Mobile, NIC).", "error");
    }

    // Sri Lankan NIC Validation (Old 9 digits + V/v or New 12 digits)
    const nicRegex = /^(?:19|20)?\d{9}[vVxX]$|^\d{12}$/;
    if (!nicRegex.test(nic)) {
      return showToast("Invalid NIC format. Please enter a valid Sri Lankan NIC.", "error");
    }

    // Mobile Validation (Sri Lankan formats: 07XXXXXXXX or +947XXXXXXXX)
    const mobileRegex = /^(07\d{8}|\+947\d{8})$/;
    if (!mobileRegex.test(mobile)) {
      return showToast("Invalid mobile number format. Use 07XXXXXXXX or +947XXXXXXXX.", "error");
    }

    // Permissions Validation
    const hasPermission = Object.values(permissions).some(val => val === true);
    if (!hasPermission) {
      return showToast("Please enable at least one specific permission for this admin.", "error");
    }

    // Show Confirmation Dialog before checking Firebase
    setShowConfirmDialog(true);
  };

  // --- Firebase Submission Logic ---
  const createAdminInFirebase = async () => {
    setIsSubmitting(true);
    try {

      // 1. Check if NIC already exists in Firestore
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('nic', '==', nic));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setShowConfirmDialog(false);
        setIsSubmitting(false);
        return showToast("An admin with this NIC already exists in the system!", "error");
      }

      // 2. Generate Password & Create User in Firebase Auth
      const newPassword = generateSecurePassword();
      const userCredential = await createUserWithEmailAndPassword(auth, computedEmail, newPassword);
      const uid = userCredential.user.uid;

      // 3. Save Admin Data to Firestore matching your screenshot structure
      await setDoc(doc(db, 'admins', uid), {
        createdAt: serverTimestamp(),
        email: computedEmail,
        loginTime: serverTimestamp(),
        logoutTime: null,
        mobile: mobile,
        name: name,
        nic: nic,
        permissions: {
          manageJobs: permissions.manageJobs,
          manageUsers: permissions.manageUsers,
          systemSettings: permissions.systemSettings,
          viewFinancials: permissions.viewFinancials
        },
        role: selectedRole,
        twoFactorEnabled: true, // default to true
        uid: uid
      });

      // 4. Show Password to Super Admin
      setGeneratedPassword(newPassword);
      setShowConfirmDialog(false);
      showToast("Administrator successfully created!", "success");



      // --- DUMMY SUCCESS LOGIC (REMOVE WHEN FIREBASE IS ACTIVE) ---
      // await new Promise(resolve => setTimeout(resolve, 1500));
      // const fakePassword = generateSecurePassword();
      // setGeneratedPassword(fakePassword);
      // setShowConfirmDialog(false);
      // showToast("Administrator successfully created! (Dummy Success)", "success");
      // ------------------------------------------------------------

    } catch (error: any) {
      console.error("Error creating admin: ", error);
      setShowConfirmDialog(false);
      showToast(`Failed to create admin: ${error.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Reset Logic ---
  const executeReset = () => {
    setName('');
    setMobile('');
    setNic('');
    setSelectedRole('Moderator');
    setPermissions({ manageUsers: true, manageJobs: true, viewFinancials: false, systemSettings: false });
    setRandomDigits(Math.floor(100 + Math.random() * 900).toString());
    setGeneratedPassword('Auto-generated upon creation');
    setShowResetDialog(false);
  };

  return (
    <div className="w-full relative overflow-x-clip pb-10">

      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-[90px] md:blur-[120px] pointer-events-none -z-10 translate-x-1/4 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto w-full">

        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT SIDE: Form Inputs */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 w-full">
            <div className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-sm shadow-xl w-full transition-colors duration-300">

              {/* User Details Header with Reset Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
                  <UserPlus className="text-brand-green" size={20} />
                  User Details
                </h3>
                <button
                  onClick={() => setShowResetDialog(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                >
                  <RotateCcw size={14} /> RESET
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Full Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kehan Hasalawa"
                      className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 sm:py-3 pl-4 pr-4 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Email Address (Auto-generated)</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 transition-colors" />
                    <input
                      type="email"
                      value={computedEmail}
                      readOnly
                      placeholder="Auto-generated"
                      className="w-full bg-gray-100 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800/50 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none cursor-not-allowed text-sm sm:text-base transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">NIC Number</label>
                  <div className="relative group">
                    <IdCard className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-brand-green transition-colors" />
                    <input
                      type="text"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      placeholder="e.g. 199912345678"
                      className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 group-focus-within:text-brand-green transition-colors" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +94770000000"
                      className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Password field updates after creation */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Temporary Password</label>
                  <div className="relative group">
                    <Key className="absolute right-4 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-600 transition-colors" />
                    <input
                      type="text"
                      value={generatedPassword}
                      readOnly
                      className={`w-full text-sm sm:text-base transition-colors duration-300 rounded-xl py-2.5 sm:py-3 pl-4 pr-10 outline-none ${generatedPassword === 'Auto-generated upon creation'
                        ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800/50 cursor-not-allowed'
                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-mono font-bold'
                        }`}
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
              onClick={handleValidationAndConfirm}
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

      {/* --- Auto-closing Toast Notification --- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 w-[90%] sm:w-auto max-w-md ${toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-brand-green text-black'
              }`}
          >
            {toast.type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <Check size={20} className="shrink-0" />}
            <span className="text-sm font-semibold flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Confirmation Dialog for Submit --- */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 transition-colors duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  You are about to create a new <strong className="text-gray-800 dark:text-gray-200">{selectedRole}</strong> account for <strong className="text-gray-800 dark:text-gray-200">{name}</strong>. An email and temporary password will be generated.
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createAdminInFirebase}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-brand-green hover:bg-emerald-500 text-black rounded-xl transition-colors font-bold shadow-md flex items-center justify-center disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Yes, Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Confirmation Dialog for Reset --- */}
      <AnimatePresence>
        {showResetDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 transition-colors duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                  <RotateCcw size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reset All Fields?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to clear all entered data? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setShowResetDialog(false)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeReset}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Reusable UI Components ---

function RoleCard({ title, desc, selected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-300 w-full ${selected
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