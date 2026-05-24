import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, ShieldCheck, Shield,
  Edit, Ban, CheckCircle2, Clock, ChevronLeft, ChevronRight,
  AlertCircle, Check, X, IdCard, Phone
} from 'lucide-react';

import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Admins() {
  const navigate = useNavigate();

  // --- States ---
  const [adminsData, setAdminsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filter, setFilter] = useState<'All' | 'Super Admin' | 'Moderator'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // එක පිටුවකට 4 යි

  // Modal States
  const [suspendTarget, setSuspendTarget] = useState<any | null>(null); // For Suspend/Activate Confirm
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null); // For Edit Dialog
  const [editConfirmTarget, setEditConfirmTarget] = useState<any | null>(null); // For Edit Confirm Dialog
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Form States
  const [editName, setEditName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editNic, setEditNic] = useState('');
  const [editRole, setEditRole] = useState('Moderator');
  const [editPermissions, setEditPermissions] = useState({
    manageUsers: false, manageJobs: false, viewFinancials: false, systemSettings: false
  });

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 5000);
  };

  // --- Initial Data Fetch ---
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'admins'));
        const fetchedAdmins = querySnapshot.docs.map(doc => {
          const data = doc.data();

          // Timestamp එක String එකක් විදියට හදාගන්නවා
          let formattedLastActive = 'Never';
          if (data.loginTime && typeof data.loginTime.toDate === 'function') {
            // "May 12, 2:25 PM" වගේ ලස්සනට format කරනවා
            formattedLastActive = data.loginTime.toDate().toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            });
          }

          return {
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            nic: data.nic || '',
            mobile: data.mobile || '',
            role: data.role || 'Moderator',
            status: data.status || 'Active',
            lastActive: formattedLastActive, // <--- මෙතන තමයි වෙනස් වුණේ
            permissions: data.permissions || {}
          };
        });

        setAdminsData(fetchedAdmins);

      } catch (error) {
        console.error("Error fetching admins:", error);
        showToast("Failed to load admins data.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // --- Auto Switch to 'All' when typing in Search ---
  useEffect(() => {
    if (searchQuery.length > 0 && filter !== 'All') {
      setFilter('All');
    }
    setCurrentPage(1);
  }, [searchQuery]);

  // --- Filtering & Pagination Logic ---
  const filteredAdmins = adminsData.filter(admin => {
    const matchesFilter = filter === 'All' || admin.role === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      admin.name.toLowerCase().startsWith(searchLower) ||
      admin.name.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().startsWith(searchLower) ||
      admin.nic.startsWith(searchLower) ||
      admin.mobile.includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  // Helper to format permissions for UI display in table
  const getActivePermissionLabels = (permsObj: any) => {
    const labels = [];
    if (permsObj.manageUsers) labels.push('Users');
    if (permsObj.manageJobs) labels.push('Jobs');
    if (permsObj.viewFinancials) labels.push('Financials');
    if (permsObj.systemSettings) labels.push('Settings');
    return labels.length > 0 ? labels : ['None'];
  };

  // --- Suspend / Activate Logic ---
  const handleStatusChangeSubmit = async () => {
    if (!suspendTarget) return;
    setIsSubmitting(true);
    const newStatus = suspendTarget.status === 'Suspended' ? 'Active' : 'Suspended';

    try {
      await updateDoc(doc(db, 'admins', suspendTarget.id), { status: newStatus });

      // Update Local State
      setAdminsData(prev => prev.map(admin =>
        admin.id === suspendTarget.id ? { ...admin, status: newStatus } : admin
      ));

      showToast(`Admin successfully ${newStatus === 'Active' ? 'activated' : 'suspended'}.`, "success");
    } catch (error) {
      showToast("Failed to update admin status.", "error");
    } finally {
      setIsSubmitting(false);
      setSuspendTarget(null);
    }
  };

  // --- Edit Admin Logic ---
  const openEditModal = (admin: any) => {
    setEditingAdmin(admin);
    setEditName(admin.name);
    setEditNic(admin.nic);
    setEditMobile(admin.mobile);
    setEditRole(admin.role);
    setEditPermissions({ ...admin.permissions });
  };

  const getFormattedMobile = (num: string) => {
    let formatted = num.trim();
    if (formatted.startsWith('0')) formatted = '+94' + formatted.substring(1);
    else if (!formatted.startsWith('+94')) formatted = '+94' + formatted;
    return formatted;
  };

  const handleEditSaveClick = () => {
    // 1. Check if nothing changed
    const formattedMobileForCheck = getFormattedMobile(editMobile);
    const isUnchanged =
      editName === editingAdmin.name &&
      editNic === editingAdmin.nic &&
      formattedMobileForCheck === editingAdmin.mobile &&
      editRole === editingAdmin.role &&
      JSON.stringify(editPermissions) === JSON.stringify(editingAdmin.permissions);

    if (isUnchanged) {
      showToast("No changes detected.", "success");
      setEditingAdmin(null);
      return;
    }

    // 2. Validations
    if (!editName.trim() || !editMobile.trim() || !editNic.trim()) {
      return showToast("Please fill in all the required fields.", "error");
    }

    const nicRegex = /^(?:19|20)?\d{9}[vVxX]$|^\d{12}$/;
    if (!nicRegex.test(editNic)) {
      return showToast("Invalid NIC format.", "error");
    }

    const formattedMobile = getFormattedMobile(editMobile);
    const mobileRegex = /^\+947\d{8}$/;
    if (!mobileRegex.test(formattedMobile)) {
      return showToast("Invalid mobile number format.", "error");
    }

    const hasPermission = Object.values(editPermissions).some(val => val === true);
    if (!hasPermission) {
      return showToast("Please enable at least one permission.", "error");
    }

    // Pass validated data to confirm dialog
    setEditConfirmTarget({
      ...editingAdmin,
      name: editName,
      nic: editNic,
      mobile: formattedMobile,
      role: editRole,
      permissions: editPermissions
    });
  };

  const submitEditToFirebase = async () => {
    if (!editConfirmTarget) return;
    setIsSubmitting(true);

    try {

      // Check Duplicates (Excluding current admin)
      const adminsRef = collection(db, 'admins');

      if (editConfirmTarget.nic !== editingAdmin.nic) {
        const qNic = query(adminsRef, where('nic', '==', editConfirmTarget.nic));
        const snapNic = await getDocs(qNic);
        if (!snapNic.empty) throw new Error("This NIC is already used by another admin.");
      }

      if (editConfirmTarget.mobile !== editingAdmin.mobile) {
        const qMobile = query(adminsRef, where('mobile', '==', editConfirmTarget.mobile));
        const snapMobile = await getDocs(qMobile);
        if (!snapMobile.empty) throw new Error("This Mobile Number is already used by another admin.");
      }

      // Update Firestore
      await updateDoc(doc(db, 'admins', editingAdmin.id), {
        name: editConfirmTarget.name,
        nic: editConfirmTarget.nic,
        mobile: editConfirmTarget.mobile,
        role: editConfirmTarget.role,
        permissions: editConfirmTarget.permissions
      });

      // Update Local State
      setAdminsData(prev => prev.map(admin =>
        admin.id === editingAdmin.id ? { ...admin, ...editConfirmTarget } : admin
      ));

      showToast("Administrator details updated successfully!", "success");
      setEditingAdmin(null);
      setEditConfirmTarget(null);

    } catch (error: any) {
      showToast(error.message || "Failed to update details.", "error");
      setEditConfirmTarget(null); // Keep edit modal open but close confirm modal
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full relative overflow-x-clip pb-10 min-h-screen">
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">

        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3 transition-colors duration-300">
              Administrator Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-300">View, edit, and manage staff access across the platform.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 flex-1 sm:flex-none focus-within:border-brand-green transition-colors duration-300">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search name, NIC, mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full sm:w-56 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => navigate('/add-admin')}
              className="flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-500 text-black px-4 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-[0_0_15px_rgba(0,204,68,0.2)] shrink-0"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add New</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 p-2 rounded-2xl backdrop-blur-sm w-fit overflow-x-auto custom-scrollbar transition-colors duration-300">
          <FilterButton active={filter === 'All'} onClick={() => setFilter('All')} label="All Staff" />
          <FilterButton active={filter === 'Super Admin'} onClick={() => setFilter('Super Admin')} label="Super Admins" />
          <FilterButton active={filter === 'Moderator'} onClick={() => setFilter('Moderator')} label="Moderators" />
        </motion.div>

        {/* Admins Table */}
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl min-h-[400px] flex flex-col justify-between transition-colors duration-300">
          <div className="overflow-x-auto pb-4 flex-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-green transition-all">            <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <tr>
                <th className="pb-4 font-medium px-4">Staff Member</th>
                <th className="pb-4 font-medium px-4">NIC Number</th>
                <th className="pb-4 font-medium px-4">Mobile Number</th>
                <th className="pb-4 font-medium px-4">Role & Access</th>
                <th className="pb-4 font-medium px-4">Status</th>
                <th className="pb-4 font-medium px-4">Last Active</th>
                <th className="pb-4 font-medium text-right px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 transition-colors duration-300">

              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">Loading administrators...</td>
                </tr>
              ) : (
                <AnimatePresence mode='wait'>
                  {currentAdmins.map((admin) => (
                    <motion.tr
                      key={admin.id}
                      layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors duration-300 ${admin.role === 'Super Admin'
                            ? 'bg-brand-green/20 text-brand-green border border-brand-green/30'
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                            }`}>
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-green transition-colors">{admin.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 transition-colors duration-300">{admin.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300 font-mono text-xs transition-colors duration-300">
                        {admin.nic}
                      </td>

                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300 font-mono text-xs transition-colors duration-300">
                        {admin.mobile}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 ${admin.role === 'Super Admin'
                            ? 'bg-brand-green/10 text-brand-green border-brand-green/20'
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                            }`}>
                            {admin.role === 'Super Admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                            {admin.role}
                          </span>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {getActivePermissionLabels(admin.permissions).map((perm, idx) => (
                              <span key={idx} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded transition-colors duration-300">{perm}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${admin.status === 'Active' ? 'text-emerald-500 dark:text-emerald-400' :
                          admin.status === 'Offline' ? 'text-gray-500 dark:text-gray-400' : 'text-red-500 dark:text-red-400'
                          }`}>
                          {admin.status === 'Active' && <CheckCircle2 size={14} />}
                          {admin.status === 'Offline' && <Clock size={14} />}
                          {admin.status === 'Suspended' && <Ban size={14} />}
                          {admin.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">
                        {admin.lastActive}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors tooltip-trigger"
                            title="Edit Permissions"
                          >
                            <Edit size={16} />
                          </button>
                          {/* Suspend or Activate Button (Trash removed) */}
                          {admin.status === 'Suspended' ? (
                            <button
                              onClick={() => setSuspendTarget(admin)}
                              className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors tooltip-trigger"
                              title="Activate Account"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setSuspendTarget(admin)}
                              className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-500/20 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors tooltip-trigger"
                              title="Suspend Account"
                            >
                              <Ban size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                  {/* Empty States */}
                  {filteredAdmins.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {searchQuery
                          ? `No administrators found matching "${searchQuery}".`
                          : `No administrators found in ${filter} section.`}
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              )}
            </tbody>
          </table>
          </div>

          {/* Pagination UI */}
          {!isLoading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAdmins.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(indexOfLastItem, filteredAdmins.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredAdmins.length}</span> entries
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === index + 1
                      ? 'bg-brand-green text-black border border-brand-green'
                      : 'border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </motion.div>

      </motion.div>

      {/* --- Auto-closing Toast Notification --- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 w-[90%] sm:w-auto max-w-md ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-brand-green text-black'}`}
          >
            {toast.type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <Check size={20} className="shrink-0" />}
            <span className="text-sm font-semibold flex-1 leading-snug">{toast.message}</span>
            <button onClick={() => setToast(null)} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Suspend / Activate Confirm Dialog --- */}
      <AnimatePresence>
        {suspendTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 transition-colors duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${suspendTarget.status === 'Suspended' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'}`}
                >
                  {suspendTarget.status === 'Suspended' ? <CheckCircle2 size={32} /> : <Ban size={32} />}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  You are about to {suspendTarget.status === 'Suspended' ? 'activate' : 'suspend'} the account for <strong className="text-gray-800 dark:text-gray-200">{suspendTarget.name}</strong>.
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button onClick={() => setSuspendTarget(null)} disabled={isSubmitting} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-semibold disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={handleStatusChangeSubmit} disabled={isSubmitting} className={`flex-1 py-3 rounded-xl transition-colors font-bold shadow-md flex items-center justify-center disabled:opacity-50 ${suspendTarget.status === 'Suspended' ? 'bg-brand-green hover:bg-emerald-500 text-black' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                    {isSubmitting ? 'Processing...' : 'Yes, Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Edit Admin Details Dialog --- */}
      <AnimatePresence>
        {editingAdmin && !editConfirmTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors duration-300"
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Edit className="text-brand-green" size={20} /> Edit Administrator
                </h3>
                <button onClick={() => setEditingAdmin(null)} className="p-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-green transition-all">
                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                    <div className="relative group">
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-4 pr-4 outline-none focus:border-brand-green transition-all text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">NIC Number</label>
                    <div className="relative group">
                      <IdCard className="absolute right-4 top-3 h-4 w-4 text-gray-400" />
                      <input type="text" value={editNic} onChange={(e) => setEditNic(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:border-brand-green transition-all text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Mobile Number</label>
                    <div className="relative group">
                      <Phone className="absolute right-4 top-3 h-4 w-4 text-gray-400" />
                      <input type="tel" value={editMobile} onChange={(e) => setEditMobile(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:border-brand-green transition-all text-sm" />
                    </div>
                  </div>
                </div>

                {/* Roles */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 block">Access Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RoleCard title="Super Admin" desc="Full access." selected={editRole === 'Super Admin'} onClick={() => setEditRole('Super Admin')} />
                    <RoleCard title="Moderator" desc="Limited access." selected={editRole === 'Moderator'} onClick={() => setEditRole('Moderator')} />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 block">Specific Permissions</label>
                  <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-4">
                    <PermissionToggle label="Manage Users" active={editPermissions.manageUsers} onClick={() => setEditPermissions(p => ({ ...p, manageUsers: !p.manageUsers }))} />
                    <PermissionToggle label="Manage Job Listings" active={editPermissions.manageJobs} onClick={() => setEditPermissions(p => ({ ...p, manageJobs: !p.manageJobs }))} />
                    <PermissionToggle label="View Financial Data" active={editPermissions.viewFinancials} onClick={() => setEditPermissions(p => ({ ...p, viewFinancials: !p.viewFinancials }))} />
                    <PermissionToggle label="System Settings" active={editPermissions.systemSettings} onClick={() => setEditPermissions(p => ({ ...p, systemSettings: !p.systemSettings }))} />
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-200 dark:border-gray-800 flex gap-3 bg-gray-50 dark:bg-gray-900/50">
                <button onClick={() => setEditingAdmin(null)} className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-semibold text-sm">Cancel</button>
                <button onClick={handleEditSaveClick} className="flex-1 py-3 bg-brand-green hover:bg-emerald-500 text-black rounded-xl transition-colors font-bold shadow-md text-sm">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Confirm Edit Save Dialog --- */}
      <AnimatePresence>
        {editConfirmTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 transition-colors duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatDelay: 0.5 }}
                  className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-4"
                >
                  <AlertCircle size={32} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Save Changes?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to update the details and permissions for <strong className="text-gray-800 dark:text-gray-200">{editConfirmTarget.name}</strong>?
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button onClick={() => setEditConfirmTarget(null)} disabled={isSubmitting} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors font-semibold disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={submitEditToFirebase} disabled={isSubmitting} className="flex-1 py-3 bg-brand-green hover:bg-emerald-500 text-black rounded-xl transition-colors font-bold shadow-md flex items-center justify-center disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Yes, Save'}
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

// --- Reusable Components ---
function FilterButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${active
        ? 'bg-gray-900 dark:bg-gray-800 text-white shadow-md'
        : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
        }`}
    >
      {label}
    </button>
  );
}

function RoleCard({ title, desc, selected, onClick }: any) {
  return (
    <div onClick={onClick} className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 w-full ${selected ? 'bg-brand-green/10 border-brand-green' : 'bg-transparent border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className={`text-sm font-semibold transition-colors duration-300 ${selected ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>{title}</h4>
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${selected ? 'border-brand-green bg-brand-green' : 'border-gray-300 dark:border-gray-600'}`}>
          {selected && <Check size={10} className="text-black" />}
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{desc}</p>
    </div>
  );
}

function PermissionToggle({ label, active, onClick }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onClick}>
      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">{label}</span>
      <div className={`flex items-center w-10 h-5 sm:w-11 sm:h-6 rounded-full px-1 transition-colors duration-300 shrink-0 ${active ? 'bg-brand-green justify-end' : 'bg-gray-200 dark:bg-gray-800 justify-start'}`}>
        <motion.div layout className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
      </div>
    </div>
  );
}