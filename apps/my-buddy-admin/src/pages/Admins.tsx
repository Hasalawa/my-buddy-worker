import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, ShieldCheck, Shield, 
  Edit, Trash2, Ban, CheckCircle2, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// --- Dummy Data (NIC & Mobile එකතු කළා, Pagination බලන්න තව දෙන්නෙක් දැම්මා) ---
const adminData = [
  { id: 'ADM-001', name: 'Kehan Hasalawa', email: 'kehan@mybuddyworker.com', nic: '199912345678', mobile: '+94 77 123 4567', role: 'Super Admin', status: 'Active', lastActive: 'Just now', permissions: ['All Access'] },
  { id: 'ADM-002', name: 'Sahan Dilshan', email: 'tharindra@mybuddyworker.com', nic: '199856789123', mobile: '+94 71 234 5678', role: 'Moderator', status: 'Active', lastActive: '10 mins ago', permissions: ['Users', 'Jobs', 'Support'] },
  { id: 'ADM-003', name: 'Nimal Perera', email: 'nimal@mybuddyworker.com', nic: '198512345678', mobile: '+94 70 345 6789', role: 'Moderator', status: 'Offline', lastActive: '2 days ago', permissions: ['Jobs', 'Support'] },
  { id: 'ADM-004', name: 'Kasun Kalhara', email: 'kasun@mybuddyworker.com', nic: '199012345678', mobile: '+94 75 456 7890', role: 'Moderator', status: 'Suspended', lastActive: '1 month ago', permissions: ['None'] },
  { id: 'ADM-005', name: 'Amal Silva', email: 'amal@mybuddyworker.com', nic: '199212345678', mobile: '+94 72 567 8901', role: 'Moderator', status: 'Active', lastActive: '5 hours ago', permissions: ['Users', 'Support'] },
  { id: 'ADM-006', name: 'Sunil Shantha', email: 'sunil@mybuddyworker.com', nic: '198812345678', mobile: '+94 78 678 9012', role: 'Moderator', status: 'Offline', lastActive: '1 week ago', permissions: ['Jobs'] },
];

export default function Admins() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Super Admin' | 'Moderator'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // එක පිටුවකට පෙන්නන ප්‍රමාණය

  // Search & Filter Logic
  const filteredAdmins = adminData.filter(admin => {
    const matchesFilter = filter === 'All' || admin.role === filter;
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          admin.nic.includes(searchQuery) ||
                          admin.mobile.includes(searchQuery); // Phone එකෙනුත් Search කරන්න හැදුවා
    return matchesFilter && matchesSearch;
  });

  // Filter එකක් හරි Search එකක් හරි කරාම ආයෙත් 1 වෙනි පිටුවට යන්න
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  // Pagination Math Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Background Glows */}
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
                placeholder="Search staff..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full sm:w-48 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white" 
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
          <div className="overflow-x-auto custom-scrollbar pb-4 flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <tr>
                  <th className="pb-4 font-medium px-4">Staff Member</th>
                  <th className="pb-4 font-medium px-4">NIC Number</th>
                  <th className="pb-4 font-medium px-4">Mobile Number</th> {/* අලුත් Mobile Column එක */}
                  <th className="pb-4 font-medium px-4">Role & Access</th>
                  <th className="pb-4 font-medium px-4">Status</th>
                  <th className="pb-4 font-medium px-4">Last Active</th>
                  <th className="pb-4 font-medium text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 transition-colors duration-300">
                <AnimatePresence mode='wait'>
                  {/* මෙතන filteredAdmins වෙනුවට currentAdmins පාවිච්චි කරා */}
                  {currentAdmins.map((admin) => (
                    <motion.tr 
                      key={admin.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 transition-colors duration-300 ${
                            admin.role === 'Super Admin' 
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

                      {/* Mobile Number දත්ත පෙන්වන තැන */}
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300 font-mono text-xs transition-colors duration-300">
                        {admin.mobile}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 ${
                            admin.role === 'Super Admin' 
                              ? 'bg-brand-green/10 text-brand-green border-brand-green/20' 
                              : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                          }`}>
                            {admin.role === 'Super Admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                            {admin.role}
                          </span>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {admin.permissions.map(perm => (
                              <span key={perm} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded transition-colors duration-300">{perm}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                          admin.status === 'Active' ? 'text-emerald-500 dark:text-emerald-400' : 
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
                            onClick={() => navigate('/add-admin', { state: { editData: admin } })}
                            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors tooltip-trigger" 
                            title="Edit Permissions"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-500/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors tooltip-trigger" title={admin.status === 'Suspended' ? 'Delete Account' : 'Suspend Account'}>
                            {admin.status === 'Suspended' ? <Trash2 size={16} /> : <Ban size={16} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredAdmins.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        No administrators found matching your criteria.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination UI එක */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(indexOfLastItem, filteredAdmins.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredAdmins.length}</span> entries
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
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === index + 1 
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
    </div>
  );
}

// --- Reusable Filter Button ---
function FilterButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
        active 
          ? 'bg-gray-900 dark:bg-gray-800 text-white shadow-md' 
          : 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
    >
      {label}
    </button>
  );
}