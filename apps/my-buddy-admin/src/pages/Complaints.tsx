import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Search, Filter, Smartphone, Wrench, 
  CheckCircle2, Clock, AlertOctagon, MessageSquarePlus 
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
const complaintsData = [
  { 
    id: 'CMP-1042', 
    user: 'Nethmi Silva', 
    appVersion: 'v2.1.4 (Android)',
    issueType: 'App Crash', 
    description: 'App crashes every time I try to upload a profile picture.', 
    status: 'Investigating', 
    solution: 'Our dev team is looking into the image compression library causing memory leaks on older Android devices.',
    date: '2 hours ago' 
  },
  { 
    id: 'CMP-1041', 
    user: 'Kamal Perera', 
    appVersion: 'v2.1.3 (iOS)',
    issueType: 'Payment Issue', 
    description: 'Money deducted from my card but job status still shows "Awaiting Payment".', 
    status: 'Resolved', 
    solution: 'Payment gateway timeout issue. Manually synced the transaction and refunded the duplicate charge.',
    date: '1 day ago' 
  },
  { 
    id: 'CMP-1040', 
    user: 'Sylvestra Tech', 
    appVersion: 'v2.1.4 (Android)',
    issueType: 'UI Glitch', 
    description: 'The job posting button overlaps with the bottom navigation bar on my screen.', 
    status: 'Pending', 
    solution: 'Not yet addressed. Assigned to frontend team for the next hotfix update.',
    date: '2 days ago' 
  },
];

export default function AppComplaints() {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Resolved' | 'Investigating'>('All');

  const filteredComplaints = complaintsData.filter(comp => filter === 'All' || comp.status === filter);

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Background Glows */}
      <div className="absolute top-[5%] right-[-5%] w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />
      <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-[100px] pointer-events-none -z-10 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3 transition-colors duration-300">
              <Smartphone className="text-brand-green hidden sm:block" size={28} />
              Mobile App Complaints
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-300">Monitor app-related issues, bugs, and track the solutions provided to users.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 flex-1 sm:flex-none focus-within:border-brand-green transition-colors duration-300">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
              <input type="text" placeholder="Search ID or Keyword..." className="bg-transparent border-none outline-none text-sm w-full sm:w-56 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 p-2 rounded-2xl backdrop-blur-sm w-fit overflow-x-auto custom-scrollbar transition-colors duration-300">
          <div className="items-center gap-2 text-sm text-gray-500 dark:text-gray-400 px-2 hidden sm:flex transition-colors duration-300">
            <Filter size={16} /> Filter by Status:
          </div>
          <FilterButton active={filter === 'All'} onClick={() => setFilter('All')} label="All Issues" />
          <FilterButton active={filter === 'Pending'} onClick={() => setFilter('Pending')} label="Pending" />
          <FilterButton active={filter === 'Investigating'} onClick={() => setFilter('Investigating')} label="Investigating" />
          <FilterButton active={filter === 'Resolved'} onClick={() => setFilter('Resolved')} label="Resolved" />
        </motion.div>

        {/* Complaints Grid/List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence>
            {filteredComplaints.map(comp => (
              <motion.div 
                key={comp.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl relative overflow-hidden transition-colors duration-300"
              >
                {/* Status Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
                  comp.status === 'Resolved' ? 'bg-emerald-500' : 
                  comp.status === 'Investigating' ? 'bg-blue-500' : 'bg-orange-500'
                }`} />

                <div className="flex flex-col lg:flex-row gap-6 lg:items-start pl-2">
                  
                  {/* Left Side: User & Issue Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-mono border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                          {comp.id}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 ${
                          comp.status === 'Resolved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          comp.status === 'Investigating' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' : 
                          'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
                        }`}>
                          {comp.status === 'Resolved' && <CheckCircle2 size={12} />}
                          {comp.status === 'Investigating' && <Wrench size={12} />}
                          {comp.status === 'Pending' && <Clock size={12} />}
                          {comp.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 transition-colors duration-300"><Clock size={12} /> {comp.date}</span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1 transition-colors duration-300">
                        <AlertOctagon size={18} className={comp.issueType === 'App Crash' ? 'text-red-500' : 'text-orange-500'} />
                        {comp.issueType}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">"{comp.description}"</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      <span>Reported by: <strong className="text-gray-800 dark:text-gray-300">{comp.user}</strong></span>
                      <span>•</span>
                      <span>App Version: <strong className="text-gray-800 dark:text-gray-300">{comp.appVersion}</strong></span>
                    </div>
                  </div>

                  {/* Right Side: Resolution Box & Actions */}
                  <div className="w-full lg:w-[400px] shrink-0 bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                    <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 transition-colors duration-300">
                      <Wrench size={14} /> Resolution Details
                    </h5>
                    <p className={`text-sm mb-4 leading-relaxed transition-colors duration-300 ${comp.status === 'Pending' ? 'text-gray-400 dark:text-gray-500 italic' : 'text-gray-700 dark:text-gray-300'}`}>
                      {comp.solution}
                    </p>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-300 text-xs font-medium flex items-center justify-center gap-1.5">
                        <MessageSquarePlus size={14} /> Reply to User
                      </button>
                      <button className="flex-1 py-2 bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/20 rounded-lg transition-colors duration-300 text-xs font-bold flex items-center justify-center gap-1.5">
                        Update Status
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
            {filteredComplaints.length === 0 && (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
                No complaints found matching this filter.
              </div>
            )}
          </AnimatePresence>
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
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
        active 
          ? `bg-gray-900 dark:bg-gray-800 border-gray-700 dark:border-gray-600 text-white shadow-sm` 
          : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );
}