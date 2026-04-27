import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Search, CheckCircle, XCircle, Eye, GraduationCap, Building2, ShieldAlert, Star } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Users() {
  const [activeTab, setActiveTab] = useState<'students' | 'employers' | 'verification'>('verification');

  // Dummy Data
  const verifications = [
    { id: 1, name: 'Kasun Kalhara', uni: 'University of Ruhuna', type: 'Student ID', date: '2 hours ago', status: 'Pending' },
    { id: 2, name: 'Sylvestra Tech', uni: 'Business BR', type: 'BR Document', date: '5 hours ago', status: 'Pending' },
  ];

  const students = [
    { id: 1, name: 'Nethmi Silva', location: 'Matara', skills: ['UI/UX', 'React'], completedJobs: 14, rating: 4.8, status: 'Verified' },
    { id: 2, name: 'Kamal Perera', location: 'Colombo', skills: ['Data Entry', 'Excel'], completedJobs: 3, rating: 4.2, status: 'Verified' },
  ];

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-300">Manage students, employers, and identity verifications.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 w-full sm:w-auto transition-colors duration-300">
            <Search size={18} className="text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            <input type="text" placeholder="Search by name or email..." className="bg-transparent border-none outline-none text-sm w-full sm:w-64 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white transition-colors duration-300" />
          </div>
        </motion.div>

        {/* Custom Tabs */}
        <motion.div variants={itemVariants} className="flex bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 p-1.5 rounded-2xl backdrop-blur-sm w-fit overflow-x-auto custom-scrollbar transition-colors duration-300">
          <TabButton active={activeTab === 'verification'} onClick={() => setActiveTab('verification')} icon={ShieldAlert} label="Verification Queue" badge="12" />
          <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={GraduationCap} label="Student Profiles" />
          <TabButton active={activeTab === 'employers'} onClick={() => setActiveTab('employers')} icon={Building2} label="Employer Profiles" />
        </motion.div>

        {/* Tab Content Area */}
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl min-h-[500px] transition-colors duration-300">
          <AnimatePresence mode="wait">
            
            {/* ---------------- VERIFICATION PORTAL ---------------- */}
            {activeTab === 'verification' && (
              <motion.div key="verification" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800/50 pb-4 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">Pending ID Approvals</h3>
                  <span className="text-sm text-brand-green font-medium">Action Required</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {verifications.map(req => (
                    <div key={req.id} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-brand-green/50 dark:hover:border-brand-green/50 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{req.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{req.uni}</p>
                        </div>
                        <span className="px-2 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] uppercase font-bold rounded-md border border-orange-200 dark:border-orange-500/20 transition-colors duration-300">{req.status}</span>
                      </div>
                      
                      {/* Fake ID Image Area */}
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-700/50 mb-4 flex items-center justify-center cursor-pointer group transition-colors duration-300">
                        <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 group-hover:text-brand-green transition-colors duration-300">
                          <Eye size={24} />
                          <span className="text-xs font-medium">Click to View {req.type}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-lg transition-colors duration-300 text-sm font-medium">
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-lg transition-colors duration-300 text-sm font-medium">
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ---------------- STUDENT PROFILES ---------------- */}
            {activeTab === 'students' && (
              <motion.div key="students" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                      <tr>
                        <th className="pb-4 font-medium">Student Info</th>
                        <th className="pb-4 font-medium">Location</th>
                        <th className="pb-4 font-medium">Top Skills</th>
                        <th className="pb-4 font-medium">Jobs & Rating</th>
                        <th className="pb-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 transition-colors duration-300">
                      {students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center font-bold">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-green transition-colors duration-300">{student.name}</p>
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-300">{student.status}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-gray-600 dark:text-gray-400 transition-colors duration-300">{student.location}</td>
                          <td className="py-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {student.skills.map(skill => (
                                <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md transition-colors duration-300">{skill}</span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">{student.completedJobs} Completed</span>
                              <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                <Star size={12} className="fill-yellow-500" /> {student.rating}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button className="text-sm font-medium text-brand-green hover:underline">View Profile</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ---------------- EMPLOYER PROFILES ---------------- */}
            {activeTab === 'employers' && (
              <motion.div key="employers" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-500 transition-colors duration-300">
                Employer Profiles Data Table (Similar structure to students)
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
      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
        active ? 'text-gray-900 dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
      }`}
    >
      {active && (
        <motion.div layoutId="activeTab" className="absolute inset-0 bg-brand-green rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
      )}
      <Icon size={18} className="relative z-10" />
      <span className="relative z-10 whitespace-nowrap">{label}</span>
      {badge && (
        <span className={`relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${active ? 'bg-gray-900/10 dark:bg-black/20 text-gray-900 dark:text-black' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}