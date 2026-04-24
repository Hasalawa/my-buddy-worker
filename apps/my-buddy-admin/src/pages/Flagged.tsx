import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  ShieldAlert, Search, Trash2, 
  CheckCircle, Eye, UserX, AlertOctagon, Filter, Briefcase
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
const flaggedItems = [
  { 
    id: 'FLG-8021', 
    type: 'Job Post', 
    title: 'Easy money from home! Click here to join my WhatsApp group', 
    reportedBy: 'Kasun K.', 
    reason: 'Spam / Phishing attempt. Trying to take users off-platform.', 
    date: '10 mins ago', 
    risk: 'High' 
  },
  { 
    id: 'FLG-8022', 
    type: 'User Profile', 
    title: 'Sylvestra Tech (Employer)', 
    reportedBy: 'System AI', 
    reason: 'Multiple jobs posted with identical suspicious descriptions.', 
    date: '2 hours ago', 
    risk: 'Medium' 
  },
  { 
    id: 'FLG-8023', 
    type: 'Job Post', 
    title: 'Need someone to write my final year university assignment', 
    reportedBy: 'Nethmi S.', 
    reason: 'Academic Dishonesty. Violates terms of service.', 
    date: '5 hours ago', 
    risk: 'High' 
  },
];

export default function Flagged() {
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium'>('All');

  const filteredItems = flaggedItems.filter(item => filter === 'All' || item.risk === filter);

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Red/Orange Warning Glow Background */}
      <div className="absolute top-0 right-[-5%] w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Flagged Content
              <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
                Action Required
              </span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Review and moderate reported jobs and suspicious accounts.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2 w-full sm:w-auto">
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search report ID..." className="bg-transparent border-none outline-none text-sm w-full sm:w-64 placeholder:text-gray-600 text-white" />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 mr-2">
            <Filter size={16} /> Filter Risk:
          </div>
          <FilterButton active={filter === 'All'} onClick={() => setFilter('All')} label="All Reports" />
          <FilterButton active={filter === 'High'} onClick={() => setFilter('High')} label="High Risk" colorClass="text-red-400" />
          <FilterButton active={filter === 'Medium'} onClick={() => setFilter('Medium')} label="Medium Risk" colorClass="text-orange-400" />
        </motion.div>

        {/* Content Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden group"
              >
                {/* Risk Indicator line */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${item.risk === 'High' ? 'bg-red-500' : 'bg-orange-500'}`} />
                
                <div className="pl-2">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        item.type === 'Job Post' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {item.type === 'Job Post' ? <Briefcase size={12} /> : <UserX size={12} />}
                        {item.type}
                      </span>
                      <span className="text-xs font-mono text-gray-500">{item.id}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><AlertOctagon size={12} className={item.risk === 'High' ? 'text-red-500' : 'text-orange-500'} /> {item.date}</span>
                  </div>
                  
                  <h4 className="text-base font-semibold text-white mb-4 leading-snug">{item.title}</h4>
                  
                  {/* Reason Box */}
                  <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-5">
                    <p className="text-xs text-red-400 font-bold mb-1.5 flex items-center gap-1.5">
                      <ShieldAlert size={14} /> Reason for Report:
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.reason}</p>
                    <div className="mt-3 pt-3 border-t border-red-500/10 flex justify-between items-center text-[11px] text-gray-500">
                      <span>Reported by: <strong className="text-gray-400">{item.reportedBy}</strong></span>
                      <span className={`font-bold ${item.risk === 'High' ? 'text-red-500' : 'text-orange-500'}`}>{item.risk} Risk Level</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <Trash2 size={16} /> 
                      {item.type === 'Job Post' ? 'Delete Post' : 'Ban User'}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-lg transition-colors text-xs sm:text-sm font-medium">
                      <Eye size={16} /> View Details
                    </button>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/20 rounded-lg transition-colors text-xs sm:text-sm font-medium" title="Dismiss Report">
                      <CheckCircle size={16} /> <span className="sm:hidden">Dismiss</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </div>
  );
}

// --- Reusable Filter Button ---
function FilterButton({ active, onClick, label, colorClass = "text-white" }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
        active 
          ? `bg-gray-800 border-gray-600 ${colorClass}` 
          : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );
}