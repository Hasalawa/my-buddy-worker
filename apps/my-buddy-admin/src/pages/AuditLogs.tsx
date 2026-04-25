import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Database, Search, Filter, Download, 
  ShieldAlert, UserPlus, Briefcase, FileEdit, Trash2, 
  Monitor, Clock, Activity
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// --- Dummy Data (ඔයාගේ ටීම් එකේ නම් පාවිච්චි කරලා තියෙනවා) ---
const auditLogs = [
  { id: 'LOG-9942', admin: 'Kehan Hasalawa', role: 'Super Admin', action: 'Changed System Configuration', details: 'Updated payout commission rate from 10% to 12%.', module: 'Settings', type: 'UPDATE', ip: '112.134.55.12', time: '10:45 AM, Today' },
  { id: 'LOG-9941', admin: 'Kehan Hasalawa', role: 'Moderator', action: 'Deleted Flagged Job Post', details: 'Removed job post ID: J-8832 due to spam violation.', module: 'Jobs', type: 'DELETE', ip: '112.134.55.89', time: '09:12 AM, Today' },
  { id: 'LOG-9940', admin: 'Kehan Hasalawa', role: 'Super Admin', action: 'Created New Admin User', details: 'Added "Nimal Perera" as Moderator.', module: 'Security', type: 'CREATE', ip: '112.134.55.12', time: '08:30 AM, Today' },
  { id: 'LOG-9939', admin: 'System AI', role: 'Automated', action: 'Auto-flagged Suspicious Account', details: 'Flagged employer profile "FakeCo" for unusual activity.', module: 'Users', type: 'SYSTEM', ip: 'Server (Internal)', time: '11:45 PM, Yesterday' },
  { id: 'LOG-9938', admin: 'Kehan Hasalawa', role: 'Moderator', action: 'Approved Student Verification', details: 'Verified University ID for Kasun K.', module: 'Users', type: 'APPROVE', ip: '112.134.55.89', time: '04:20 PM, Yesterday' },
];

export default function AuditLogs() {
  const [filter, setFilter] = useState<'All' | 'Security' | 'Jobs' | 'Users'>('All');

  // Filter logic
  const filteredLogs = auditLogs.filter(log => filter === 'All' || log.module === filter);

  // Helper function to get colors and icons based on action type
  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'CREATE': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: UserPlus };
      case 'APPROVE': return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Briefcase };
      case 'UPDATE': return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: FileEdit };
      case 'DELETE': return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: Trash2 };
      case 'SYSTEM': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Activity };
      default: return { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: Database };
    }
  };

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Deep Purple/Blue Glow for System Feel */}
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              System Audit Logs
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Immutable record of all administrative actions and system events.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2.5 flex-1 sm:flex-none focus-within:border-brand-green transition-colors">
              <Search size={18} className="text-gray-500" />
              <input type="text" placeholder="Search logs, IPs, or Admins..." className="bg-transparent border-none outline-none text-sm w-full sm:w-56 placeholder:text-gray-600 text-white" />
            </div>
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-medium border border-gray-700">
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 bg-[#111111]/80 border border-gray-800/80 p-2 rounded-2xl backdrop-blur-sm w-fit">
          <div className="flex items-center gap-2 text-sm text-gray-400 px-2 hidden sm:flex">
            <Filter size={16} /> Modules:
          </div>
          <FilterButton active={filter === 'All'} onClick={() => setFilter('All')} label="All Events" />
          <FilterButton active={filter === 'Security'} onClick={() => setFilter('Security')} label="Security & Settings" />
          <FilterButton active={filter === 'Jobs'} onClick={() => setFilter('Jobs')} label="Job Moderation" />
          <FilterButton active={filter === 'Users'} onClick={() => setFilter('Users')} label="User Verification" />
        </motion.div>

        {/* Audit Log Timeline / List */}
        <motion.div variants={itemVariants} className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-xl min-h-[500px]">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredLogs.map(log => {
                const styles = getTypeStyles(log.type);
                const Icon = styles.icon;

                return (
                  <motion.div 
                    key={log.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-gray-900/30 border border-gray-800 hover:border-gray-700 transition-colors group relative overflow-hidden"
                  >
                    {/* Action Type Indicator Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.bg} border-r ${styles.border}`} />

                    {/* Icon Area */}
                    <div className={`p-3 rounded-xl border shrink-0 z-10 ${styles.bg} ${styles.border} ${styles.color}`}>
                      <Icon size={20} />
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 w-full z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm sm:text-base">{log.action}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${styles.bg} ${styles.border} ${styles.color}`}>
                            {log.module}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1 shrink-0">
                          <Clock size={12} /> {log.time}
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mb-3">{log.details}</p>

                      {/* Meta Data (Admin & IP) */}
                      <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 text-gray-400 bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-700/50">
                          <ShieldAlert size={12} className={log.role === 'Super Admin' ? 'text-brand-green' : 'text-blue-400'} />
                          <span className="font-medium text-gray-300">{log.admin}</span>
                          <span className="text-gray-500">({log.role})</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-gray-500 font-mono bg-gray-800/50 px-2.5 py-1 rounded-lg border border-gray-700/50">
                          <Monitor size={12} />
                          IP: {log.ip}
                        </div>

                        <div className="flex items-center gap-1 text-gray-600 font-mono ml-auto">
                          ID: {log.id}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
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
      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
        active 
          ? 'bg-gray-800 text-white shadow-md' 
          : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
      }`}
    >
      {label}
    </button>
  );
}