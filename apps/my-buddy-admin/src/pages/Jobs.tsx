import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Search, Briefcase, CheckCircle2, ShieldAlert, Eye, Trash2, AlertTriangle, Clock } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Jobs() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'flagged'>('active');

  // Dummy Data for testing
  const activeJobs = [
    { id: 'J-1042', title: 'Need a React Developer for a bug fix', buyer: 'Callisto Solutions', worker: 'Tharindra Dasuni', amount: 'Rs 15,000', status: 'In Progress', deadline: '2 days left' },
    { id: 'J-1043', title: 'Translate English Document to Sinhala', buyer: 'Global Reach', worker: 'Pending', amount: 'Rs 4,500', status: 'Open', deadline: '5 days left' },
  ];

  const flaggedContent = [
    { id: 'F-001', jobTitle: 'Easy money from home! Click here', reportedBy: 'Kasun K.', reason: 'Spam / Scam', date: '1 hour ago', risk: 'High' },
    { id: 'F-002', title: 'Need someone to write my university assignment', reportedBy: 'Nethmi S.', reason: 'Academic Dishonesty', date: '3 hours ago', risk: 'Medium' },
  ];

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Job Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-300">Monitor ongoing work and moderate flagged listings.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 w-full sm:w-auto focus-within:border-brand-green transition-colors duration-300">
            <Search size={18} className="text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <input type="text" placeholder="Search Job ID or Title..." className="bg-transparent border-none outline-none text-sm w-full sm:w-64 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white transition-colors duration-300" />
          </div>
        </motion.div>

        {/* Custom Tabs */}
        <motion.div variants={itemVariants} className="flex bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 p-1.5 rounded-2xl backdrop-blur-sm w-fit overflow-x-auto custom-scrollbar transition-colors duration-300">
          <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} icon={Briefcase} label="Active & Open Jobs" />
          <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} icon={CheckCircle2} label="Completed Jobs" />
          <TabButton active={activeTab === 'flagged'} onClick={() => setActiveTab('flagged')} icon={ShieldAlert} label="Flagged Content" badge="2" />
        </motion.div>

        {/* Tab Content Area */}
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl min-h-[500px] transition-colors duration-300">
          <AnimatePresence mode="wait">
            
            {/* ---------------- ACTIVE JOBS TAB ---------------- */}
            {activeTab === 'active' && (
              <motion.div key="active" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="overflow-x-auto custom-scrollbar pb-4">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                      <tr>
                        <th className="pb-4 font-medium px-4">Job Details</th>
                        <th className="pb-4 font-medium px-4">Participants</th>
                        <th className="pb-4 font-medium px-4">Value</th>
                        <th className="pb-4 font-medium px-4">Status & Time</th>
                        <th className="pb-4 font-medium text-right px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 transition-colors duration-300">
                      {activeJobs.map(job => (
                        <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                          <td className="py-4 px-4">
                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-green transition-colors duration-300">{job.title}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">ID: {job.id}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Buyer: <span className="text-gray-900 dark:text-white transition-colors duration-300">{job.buyer}</span></span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">Worker: <span className={job.worker === 'Pending' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white transition-colors duration-300'}>{job.worker}</span></span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white transition-colors duration-300">{job.amount}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-start gap-1.5">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 ${
                                job.status === 'Open' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' : 'bg-emerald-50 dark:bg-brand-green/10 text-emerald-700 dark:text-brand-green border-emerald-200 dark:border-brand-green/20'
                              }`}>
                                {job.status}
                              </span>
                              <span className="text-[11px] text-gray-500 flex items-center gap-1 transition-colors duration-300"><Clock size={10} /> {job.deadline}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors tooltip-trigger" title="View Details">
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ---------------- FLAGGED CONTENT TAB ---------------- */}
            {activeTab === 'flagged' && (
              <motion.div key="flagged" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800/50 pb-4 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">Reported Listings</h3>
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2 transition-colors duration-300"><AlertTriangle size={16} /> Action Required</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {flaggedContent.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 relative overflow-hidden group transition-colors duration-300">
                      {/* Risk Indicator line */}
                      <div className={`absolute top-0 left-0 w-1 h-full ${item.risk === 'High' ? 'bg-red-500' : 'bg-orange-500'}`} />
                      
                      <div className="pl-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-mono rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">ID: {item.id}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-300">{item.date}</span>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 line-clamp-2 transition-colors duration-300">{item.title || item.jobTitle}</h4>
                        
                        <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-lg p-3 mb-5 transition-colors duration-300">
                          <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1 flex items-center gap-1.5 transition-colors duration-300"><ShieldAlert size={14} /> Reason for Report:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">{item.reason}</p>
                          <p className="text-[11px] text-gray-500 mt-2 transition-colors duration-300">Reported by: {item.reportedBy}</p>
                        </div>

                        <div className="flex gap-3">
                          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg transition-colors duration-300 text-xs sm:text-sm font-bold">
                            <Trash2 size={16} /> Remove Post
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-300 text-xs sm:text-sm font-medium">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ---------------- COMPLETED JOBS TAB ---------------- */}
            {activeTab === 'completed' && (
              <motion.div key="completed" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-500 transition-colors duration-300">
                <CheckCircle2 size={48} className="text-gray-300 dark:text-gray-800 mb-4 transition-colors duration-300" />
                <p>History of all completed jobs will appear here.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

// --- Reusable Tab Button ---
function TabButton({ active, onClick, icon: Icon, label, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
        active ? 'text-gray-900 dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
    >
      {active && (
        <motion.div layoutId="activeJobTab" className="absolute inset-0 bg-brand-green rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
      )}
      <Icon size={16} className="relative z-10 shrink-0" />
      <span className="relative z-10 whitespace-nowrap">{label}</span>
      {badge && (
        <span className={`relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${active ? 'bg-gray-900/10 dark:bg-black/20 text-gray-900 dark:text-black' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}