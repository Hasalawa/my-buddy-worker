import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, ShieldCheck, Shield, 
  Edit, Trash2, Ban, CheckCircle2, Clock
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// --- Dummy Data ---
const adminData = [
  { id: 'ADM-001', name: 'Kehan Hasalawa', email: 'kehan@mybuddyworker.com', role: 'Super Admin', status: 'Active', lastActive: 'Just now', permissions: ['All Access'] },
  { id: 'ADM-002', name: 'Tharindra Dasuni', email: 'tharindra@mybuddyworker.com', role: 'Moderator', status: 'Active', lastActive: '10 mins ago', permissions: ['Users', 'Jobs', 'Support'] },
  { id: 'ADM-003', name: 'Nimal Perera', email: 'nimal@mybuddyworker.com', role: 'Moderator', status: 'Offline', lastActive: '2 days ago', permissions: ['Jobs', 'Support'] },
  { id: 'ADM-004', name: 'Kasun Kalhara', email: 'kasun@mybuddyworker.com', role: 'Moderator', status: 'Suspended', lastActive: '1 month ago', permissions: ['None'] },
];

export default function Admins() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Super Admin' | 'Moderator'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Search & Filter Logic
  const filteredAdmins = adminData.filter(admin => {
    const matchesFilter = filter === 'All' || admin.role === filter;
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Background Glows */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Administrator Management
            </h1>
            <p className="text-gray-400 mt-1 text-sm">View, edit, and manage staff access across the platform.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2.5 flex-1 sm:flex-none focus-within:border-brand-green transition-colors">
              <Search size={18} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search staff..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full sm:w-48 placeholder:text-gray-600 text-white" 
              />
            </div>
            {/* අලුත් Admin කෙනෙක් හදන පිටුවට යන බොත්තම */}
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
        <motion.div variants={itemVariants} className="flex items-center gap-3 bg-[#111111]/80 border border-gray-800/80 p-2 rounded-2xl backdrop-blur-sm w-fit overflow-x-auto custom-scrollbar">
          <FilterButton active={filter === 'All'} onClick={() => setFilter('All')} label="All Staff" />
          <FilterButton active={filter === 'Super Admin'} onClick={() => setFilter('Super Admin')} label="Super Admins" />
          <FilterButton active={filter === 'Moderator'} onClick={() => setFilter('Moderator')} label="Moderators" />
        </motion.div>

        {/* Admins Table */}
        <motion.div variants={itemVariants} className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl min-h-[400px]">
          <div className="overflow-x-auto custom-scrollbar pb-4">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="pb-4 font-medium px-4">Staff Member</th>
                  <th className="pb-4 font-medium px-4">Role & Access</th>
                  <th className="pb-4 font-medium px-4">Status</th>
                  <th className="pb-4 font-medium px-4">Last Active</th>
                  <th className="pb-4 font-medium text-right px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                <AnimatePresence>
                  {filteredAdmins.map((admin) => (
                    <motion.tr 
                      key={admin.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-900/30 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                            admin.role === 'Super Admin' ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-white group-hover:text-brand-green transition-colors">{admin.name}</p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            admin.role === 'Super Admin' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {admin.role === 'Super Admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                            {admin.role}
                          </span>
                          <div className="flex gap-1 flex-wrap mt-1">
                            {admin.permissions.map(perm => (
                              <span key={perm} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{perm}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          admin.status === 'Active' ? 'text-emerald-400' : 
                          admin.status === 'Offline' ? 'text-gray-400' : 'text-red-400'
                        }`}>
                          {admin.status === 'Active' && <CheckCircle2 size={14} />}
                          {admin.status === 'Offline' && <Clock size={14} />}
                          {admin.status === 'Suspended' && <Ban size={14} />}
                          {admin.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 text-xs">
                        {admin.lastActive}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 bg-gray-800 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-lg transition-colors tooltip-trigger" title="Edit Permissions">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors tooltip-trigger" title={admin.status === 'Suspended' ? 'Delete Account' : 'Suspend Account'}>
                            {admin.status === 'Suspended' ? <Trash2 size={16} /> : <Ban size={16} />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredAdmins.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No administrators found matching your criteria.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
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
          ? 'bg-gray-800 text-white shadow-md' 
          : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
      }`}
    >
      {label}
    </button>
  );
}