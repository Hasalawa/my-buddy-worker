import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  DollarSign, ArrowUpRight, CreditCard, Download, 
  Wallet, CheckCircle, Clock, AlertCircle, Building,
  Heart, Server, ArrowRightLeft
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// --- Dummy Data ---
const financeChartData = [
  { name: 'Mon', totalVolume: 15000, commission: 1500 },
  { name: 'Tue', totalVolume: 22000, commission: 2200 },
  { name: 'Wed', totalVolume: 18000, commission: 1800 },
  { name: 'Thu', totalVolume: 30000, commission: 3000 },
  { name: 'Fri', totalVolume: 28000, commission: 2800 },
  { name: 'Sat', totalVolume: 45000, commission: 4500 },
  { name: 'Sun', totalVolume: 42000, commission: 4200 },
];

const pendingPayouts = [
  { id: 'TRX-9082', student: 'Nethmi Silva', bank: 'BOC - 8273****', amount: 'Rs 12,500', status: 'Pending', days: '2 days waiting' },
  { id: 'TRX-9083', student: 'Kamal Perera', bank: 'ComBank - 1928****', amount: 'Rs 4,000', status: 'Pending', days: '1 day waiting' },
  { id: 'TRX-9084', student: 'Kasun Kalhara', bank: 'HNB - 9921****', amount: 'Rs 8,500', status: 'Processing', days: 'Just now' },
];

// අලුතින් එකතු කරපු Transaction Data
const recentTransactions = [
  { id: 'PAY-5011', payer: 'Sylvestra Tech', payee: 'Nethmi Silva', amount: 'Rs 15,000', date: 'Apr 30, 2026', time: '10:45 AM', status: 'Completed' },
  { id: 'PAY-5012', payer: 'Perera Stores', payee: 'Kamal Perera', amount: 'Rs 3,000', date: 'Apr 29, 2026', time: '02:30 PM', status: 'Completed' },
  { id: 'PAY-5013', payer: 'Global Reach', payee: 'Kasun Kalhara', amount: 'Rs 8,500', date: 'Apr 29, 2026', time: '09:15 AM', status: 'Processing' },
];

export default function Finance() {
  const [dateRange, setDateRange] = useState('This Week');

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Background Glows */}
      <div className="absolute top-[5%] left-[-5%] w-[300px] h-[300px] bg-brand-green/20 dark:bg-brand-green/10 rounded-full blur-[100px] pointer-events-none -z-10 transition-colors duration-300" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-300" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">Payments & Finance</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors duration-300">Track earnings, commissions, and process student payouts.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-brand-green flex-1 sm:flex-none cursor-pointer transition-colors duration-300"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <button className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2.5 rounded-xl transition-colors duration-300 text-sm font-medium border border-gray-200 dark:border-gray-700">
              <Download size={16} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </motion.div>

        {/* Top Financial KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <FinanceCard 
            title="Total Transaction" 
            amount="Rs 200k" 
            trend="+15.3%" 
            subtitle="Volume moved"
            icon={ArrowUpRight} 
            colorClass="text-gray-900 dark:text-white"
          />
          <FinanceCard 
            title="App Commission" 
            amount="Rs 20,000" 
            trend="+12.1%" 
            subtitle="Platform revenue"
            icon={DollarSign} 
            colorClass="text-brand-green"
            highlight
          />
          <FinanceCard 
            title="Pending Payouts" 
            amount="Rs 45,500" 
            trend="-2.4%" 
            subtitle="To be cleared"
            icon={Wallet} 
            colorClass="text-orange-500 dark:text-orange-400"
          />
          {/* අලුතින් එකතු කරපු KPI Cards */}
          <FinanceCard 
            title="Charity Fund" 
            amount="Rs 5,000" 
            trend="+5.0%" 
            subtitle="Allocated donations"
            icon={Heart} 
            colorClass="text-rose-500 dark:text-rose-400"
          />
          <FinanceCard 
            title="Maintenance" 
            amount="Rs 8,000" 
            trend="+3.2%" 
            subtitle="Server & operations"
            icon={Server} 
            colorClass="text-blue-500 dark:text-blue-400"
          />
        </div>

        {/* Main Chart Section */}
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-xl transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">Earnings vs Commission Trend</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Daily comparison of total volume and your revenue.</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 transition-colors duration-300"></span> Total Volume</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-brand-green"></span> Commission</div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00cc44" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00cc44" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4b5563" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4b5563" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#00cc44' }}
                />
                <Area type="monotone" dataKey="totalVolume" stroke="#4b5563" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" dataKey="commission" stroke="#00cc44" strokeWidth={3} fillOpacity={1} fill="url(#colorCommission)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payout Management Table */}
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl overflow-hidden transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
                <CreditCard className="text-brand-green" size={20} />
                Payout Management Queue
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Review and process student payments securely.</p>
            </div>
            <button className="bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/20 px-4 py-2 rounded-xl transition-colors text-sm font-semibold flex items-center gap-2">
              <CheckCircle size={16} />
              Process All Pending
            </button>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <tr>
                  <th className="pb-3 font-medium px-4">Student & ID</th>
                  <th className="pb-3 font-medium px-4">Bank Details</th>
                  <th className="pb-3 font-medium px-4">Amount Due</th>
                  <th className="pb-3 font-medium px-4">Status</th>
                  <th className="pb-3 font-medium text-right px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 transition-colors duration-300">
                {pendingPayouts.map(payout => (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{payout.student}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-500 font-mono transition-colors duration-300">{payout.id}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1 transition-colors duration-300">
                      <Building size={14} className="text-gray-400 dark:text-gray-500 transition-colors duration-300" /> {payout.bank}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white transition-colors duration-300">{payout.amount}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 ${
                          payout.status === 'Pending' 
                            ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' 
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                        }`}>
                          {payout.status === 'Pending' ? <Clock size={10} /> : <AlertCircle size={10} />}
                          {payout.status}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-500 transition-colors duration-300">{payout.days}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="px-4 py-2 bg-brand-green hover:bg-emerald-500 text-black rounded-lg transition-colors text-xs font-bold shadow-[0_0_10px_rgba(0,204,68,0.2)]">
                        Clear Payout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* අලුතින් එකතු කරපු Transaction History Table */}
        <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#111111]/80 border border-gray-200 dark:border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl overflow-hidden transition-colors duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
                <ArrowRightLeft className="text-brand-green" size={20} />
                Recent Transactions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Track who paid whom, including date and time details.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <tr>
                  <th className="pb-3 font-medium px-4">Transaction ID</th>
                  <th className="pb-3 font-medium px-4">Payment Flow (Payer → Payee)</th>
                  <th className="pb-3 font-medium px-4">Date & Time</th>
                  <th className="pb-3 font-medium px-4">Amount</th>
                  <th className="pb-3 font-medium px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 transition-colors duration-300">
                {recentTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group">
                    <td className="py-4 px-4 font-mono text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      {txn.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">{txn.payer}</span>
                        <ArrowRightLeft size={14} className="text-brand-green opacity-50" />
                        <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{txn.payee}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-gray-900 dark:text-white transition-colors duration-300">{txn.date}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 transition-colors duration-300">
                          <Clock size={10} /> {txn.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white transition-colors duration-300">
                      {txn.amount}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 ${
                        txn.status === 'Completed' 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                      }`}>
                        {txn.status === 'Completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

// --- Reusable Finance Card ---
function FinanceCard({ title, amount, trend, subtitle, icon: Icon, colorClass, highlight = false }: any) {
  return (
    <motion.div 
      variants={itemVariants} 
      className={`relative overflow-hidden rounded-2xl p-5 border backdrop-blur-sm transition-colors duration-300 group ${
        highlight 
          ? 'bg-brand-green/5 border-brand-green/30 hover:border-brand-green/60 dark:hover:border-brand-green/60' 
          : 'bg-white/80 dark:bg-[#111111]/80 border-gray-200 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-gray-900 dark:text-white">
        <Icon size={80} />
      </div>
      
      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl border transition-colors duration-300 ${highlight ? 'bg-brand-green/20 border-brand-green/30 text-brand-green' : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400'}`}>
          <Icon size={20} />
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full transition-colors duration-300 ${trend.startsWith('+') ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
          {trend}
        </span>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-gray-500 dark:text-gray-400 text-[11px] font-medium mb-1 transition-colors duration-300">{title}</h4>
        <div className={`text-2xl font-extrabold tracking-tight mb-1 transition-colors duration-300 ${colorClass}`}>
          {amount}
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors duration-300">{subtitle}</p>
      </div>
    </motion.div>
  );
}