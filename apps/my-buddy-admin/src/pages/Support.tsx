import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  MessageSquare, Star, ShieldAlert, CheckCircle, 
  Search, Filter, User, Clock, MoreVertical, Trash2, Send 
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
const supportTickets = [
  { id: 'TIC-201', user: 'Kasun Kalhara', subject: 'Payment not received', priority: 'High', date: '45m ago', status: 'Open' },
  { id: 'TIC-202', user: 'Sylvestra Tech', subject: 'Worker did not complete task', priority: 'Medium', date: '2h ago', status: 'In Progress' },
];

const reportedReviews = [
  { id: 'REV-501', from: 'Amara Siri', to: 'Nethmi Silva', text: 'Very unprofessional behavior, do not recommend!', reason: 'Hate speech / Bullying', rating: 1 },
  { id: 'REV-502', from: 'Unknown Buyer', to: 'Callisto Solutions', text: 'Fake profile, scammer!', reason: 'False Information', rating: 1 },
];

export default function Support() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'reviews'>('tickets');

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Background Glows */}
      <div className="absolute top-0 right-[-5%] w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dispute & Support</h1>
            <p className="text-gray-400 mt-1 text-sm">Resolve user conflicts and moderate platform reviews.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-2 w-full sm:w-auto">
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search tickets..." className="bg-transparent border-none outline-none text-sm w-full sm:w-64 placeholder:text-gray-600 text-white" />
          </div>
        </motion.div>

        {/* Custom Tabs */}
        <motion.div variants={itemVariants} className="flex bg-[#111111]/80 border border-gray-800/80 p-1.5 rounded-2xl backdrop-blur-sm w-fit overflow-x-auto custom-scrollbar">
          <TabButton active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={MessageSquare} label="Support Tickets" badge="3" />
          <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={Star} label="Review Moderation" badge="5" />
        </motion.div>

        {/* Tab Content Area */}
        <motion.div variants={itemVariants} className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-xl min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* ---------------- SUPPORT TICKETS TAB ---------------- */}
            {activeTab === 'tickets' && (
              <motion.div key="tickets" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-800/50 pb-4">
                  <h3 className="text-lg font-semibold text-white">Active Support Requests</h3>
                  <button className="text-xs text-brand-green font-bold flex items-center gap-2 hover:underline">
                    <Filter size={14} /> Filter by Priority
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {supportTickets.map(ticket => (
                    <div key={ticket.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 hover:border-brand-green/30 transition-all group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${ticket.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                            <ShieldAlert size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-white group-hover:text-brand-green transition-colors">{ticket.subject}</h4>
                              <span className="text-[10px] font-mono text-gray-500">{ticket.id}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><User size={12} /> {ticket.user}</span>
                              <span className="flex items-center gap-1"><Clock size={12} /> {ticket.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            ticket.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {ticket.status}
                          </span>
                          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-green text-black rounded-lg text-xs font-bold hover:bg-emerald-500 transition-all">
                            <Send size={14} /> Reply & Resolve
                          </button>
                          <button className="p-2 text-gray-500 hover:text-white">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ---------------- REVIEW MODERATION TAB ---------------- */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-800/50 pb-4">
                  <h3 className="text-lg font-semibold text-white">Flagged Reviews</h3>
                  <span className="text-xs text-gray-500 italic">Reported for violating platform policies.</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportedReviews.map(rev => (
                    <div key={rev.id} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < rev.rating ? 'fill-yellow-500' : 'text-gray-700'} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20 uppercase">
                          {rev.reason}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 italic">"{rev.text}"</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                        <div className="text-[11px] text-gray-500 leading-tight">
                          <p>From: <span className="text-white">{rev.from}</span></p>
                          <p>To: <span className="text-brand-green">{rev.to}</span></p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all tooltip-trigger" title="Delete Review">
                            <Trash2 size={16} />
                          </button>
                          <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-all tooltip-trigger" title="Approve (Dismiss Report)">
                            <CheckCircle size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
        active ? 'text-black' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      {active && (
        <motion.div layoutId="activeSupportTab" className="absolute inset-0 bg-brand-green rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
      )}
      <Icon size={16} className="relative z-10 shrink-0" />
      <span className="relative z-10 whitespace-nowrap">{label}</span>
      {badge && (
        <span className={`relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-black/20 text-black' : 'bg-red-500/20 text-red-400'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}