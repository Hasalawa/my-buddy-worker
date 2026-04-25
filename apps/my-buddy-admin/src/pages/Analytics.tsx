import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Users, MapPin, 
  Target, Download, Calendar, Briefcase 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
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
const registrationData = [
  { day: 'Mon', students: 45, employers: 12 },
  { day: 'Tue', students: 52, employers: 15 },
  { day: 'Wed', students: 38, employers: 8 },
  { day: 'Thu', students: 65, employers: 20 },
  { day: 'Fri', students: 48, employers: 14 },
  { day: 'Sat', students: 85, employers: 25 },
  { day: 'Sun', students: 70, employers: 18 },
];

const locationData = [
  { city: 'Matara', jobs: 320 },
  { city: 'Colombo', jobs: 450 },
  { city: 'Galle', jobs: 280 },
  { city: 'Kandy', jobs: 190 },
  { city: 'Gampaha', jobs: 150 },
];

const jobSuccessData = [
  { name: 'Completed', value: 75, color: '#00cc44' }, // Brand Green
  { name: 'In Progress', value: 15, color: '#f59e0b' }, // Amber
  { name: 'Cancelled/Failed', value: 10, color: '#ef4444' }, // Red
];

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('Last 7 Days');

  return (
    <div className="w-full relative overflow-x-clip pb-10">
      {/* Background Glows */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Analytics & Reports
              <BarChart2 className="text-brand-green hidden sm:block" size={28} />
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Deep dive into platform growth, demographics, and success rates.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-2.5 flex-1 sm:flex-none">
              <Calendar size={16} className="text-gray-500" />
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-transparent text-gray-300 text-sm outline-none cursor-pointer w-full"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <button className="flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-500 text-black px-4 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-[0_0_15px_rgba(0,204,68,0.2)]">
              <Download size={16} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </motion.div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Registrations" value="403" icon={Users} trend="+24%" color="text-white" />
          <StatCard title="Total Jobs Posted" value="1,400" icon={Briefcase} trend="+12%" color="text-white" />
          <StatCard title="Job Success Rate" value="75%" icon={Target} trend="+5%" color="text-brand-green" highlight />
          <StatCard title="Active Locations" value="24" icon={MapPin} trend="0%" color="text-white" />
        </div>

        {/* Top Chart: User Growth (Area Chart) */}
        <motion.div variants={itemVariants} className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Daily User Registrations</h3>
              <p className="text-xs text-gray-400 mt-1">Comparing new Student vs Employer signups.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span> Students</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Employers</div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00cc44" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00cc44" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmployers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="day" stroke="#666" tick={{fill: '#666', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="students" stroke="#00cc44" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="employers" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEmployers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bottom Grid: Locations & Success Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Location Bar Chart */}
          <motion.div variants={itemVariants} className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><MapPin size={18} className="text-brand-green" /> Top Job Locations</h3>
              <p className="text-xs text-gray-400 mt-1">Districts with the highest job postings.</p>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                  <XAxis type="number" stroke="#666" tick={{fill: '#666', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis dataKey="city" type="category" stroke="#999" axisLine={false} tickLine={false} width={80} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: '#222'}} contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="jobs" fill="#00cc44" radius={[0, 4, 4, 0]} barSize={24}>
                    {locationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#00cc44' : '#00cc4480'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Success Rate Donut Chart */}
          <motion.div variants={itemVariants} className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl flex flex-col">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Target size={18} className="text-brand-green" /> Job Completion Status</h3>
              <p className="text-xs text-gray-400 mt-1">Percentage of successfully finished jobs.</p>
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="h-[200px] w-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobSuccessData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {jobSuccessData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-white">75%</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Success</span>
                </div>
              </div>

              {/* Custom Legend */}
              <div className="flex flex-col gap-3">
                {jobSuccessData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 px-4 py-2 rounded-xl">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-xs font-medium text-gray-300">{item.name}</p>
                      <p className="text-sm font-bold text-white">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

// --- Reusable Stat Card ---
function StatCard({ title, value, icon: Icon, trend, color, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-sm relative overflow-hidden group ${highlight ? 'bg-brand-green/10 border-brand-green/30' : 'bg-gray-900/40 border-gray-800'}`}>
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={80} />
      </div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg border ${highlight ? 'bg-brand-green border-brand-green text-black' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
          <Icon size={18} />
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-300'}`}>
          {trend !== '0%' && <TrendingUp size={10} />}
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-xs text-gray-400 font-medium mb-1">{title}</h4>
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${color}`}>{value}</div>
      </div>
    </div>
  );
}