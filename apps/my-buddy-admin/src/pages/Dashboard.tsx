import { useState, useRef, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import {
  Users,
  Briefcase,
  DollarSign,
  Activity,
  GraduationCap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Dummy Data for Charts ---
const revenueData = [
  { name: "Mon", revenue: 4000, students: 24 },
  { name: "Tue", revenue: 3000, students: 13 },
  { name: "Wed", revenue: 5500, students: 38 },
  { name: "Thu", revenue: 4500, students: 39 },
  { name: "Fri", revenue: 6000, students: 48 },
  { name: "Sat", revenue: 8000, students: 65 },
  { name: "Sun", revenue: 7500, students: 55 },
];

const jobStats = [
  { name: "IT & Dev", jobs: 120 },
  { name: "Design", jobs: 85 },
  { name: "Writing", jobs: 60 },
  { name: "Tutoring", jobs: 90 },
  { name: "Other", jobs: 40 },
];

// --- Animations ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Dashboard() {
  const [revenueFilter, setRevenueFilter] = useState("This Week");

  return (
    
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Page Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tight">
                System Overview
              </h1>
              <p className="text-gray-400 mt-1">
                Real-time metrics for My Buddy Worker platform.
              </p>
            </motion.div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Students"
                value="1,248"
                trend="+12%"
                icon={GraduationCap}
              />
              <StatCard
                title="Active Buyers"
                value="432"
                trend="+5%"
                icon={Users}
              />
              <StatCard
                title="Active Jobs"
                value="89"
                trend="-2%"
                icon={Briefcase}
                negative
              />
              <StatCard
                title="Weekly Revenue"
                value="Rs 35,500"
                trend="+18%"
                icon={DollarSign}
                isCurrency
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Area Chart */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Revenue & Activity</h3>

                  <CustomDropdown
                    options={["This Week", "Last Month", "This Year"]}
                    value={revenueFilter}
                    onChange={setRevenueFilter}
                  />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#00cc44"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#00cc44"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#222"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#666"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#666"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111",
                          borderColor: "#333",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#00cc44" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#00cc44"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Secondary Bar Chart */}
              <motion.div
                variants={itemVariants}
                className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
              >
                <h3 className="text-lg font-semibold mb-6">Jobs by Category</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobStats}
                      layout="vertical"
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#222"
                        horizontal={false}
                      />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#999"
                        axisLine={false}
                        tickLine={false}
                        width={70}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#222" }}
                        contentStyle={{
                          backgroundColor: "#111",
                          borderColor: "#333",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="jobs"
                        fill="#00cc44"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity Table */}
            <motion.div
              variants={itemVariants}
              className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Recent Job Postings</h3>
                <button className="text-sm text-brand-green hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="pb-3 font-medium">Job Title</th>
                      <th className="pb-3 font-medium">Buyer</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    <TableRow
                      title="UI/UX Design for Mobile App"
                      buyer="Sylvestra Tech"
                      amount="Rs 15,000"
                      status="Active"
                      time="2h ago"
                    />
                    <TableRow
                      title="Data Entry (Excel)"
                      buyer="Perera Stores"
                      amount="Rs 3,000"
                      status="Pending"
                      time="5h ago"
                    />
                    <TableRow
                      title="Translate Document to Sinhala"
                      buyer="Global Reach"
                      amount="Rs 5,500"
                      status="Active"
                      time="1 day ago"
                    />
                    <TableRow
                      title="Frontend Fixes (React)"
                      buyer="Callisto Solutions"
                      amount="Rs 8,000"
                      status="Completed"
                      time="2 days ago"
                    />
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>

  );
}

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  isCurrency = false,
  negative = false,
}: any) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#111111]/80 border border-gray-800/80 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-brand-green/30 transition-colors"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={80} />
      </div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-gray-900 rounded-xl text-brand-green border border-gray-800">
          <Icon size={24} />
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${negative ? "bg-red-500/10 text-red-400" : "bg-brand-green/10 text-brand-green"}`}
        >
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
        <div
          className={`text-3xl font-bold tracking-tight ${isCurrency ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400" : "text-white"}`}
        >
          {value}
        </div>
      </div>
    </motion.div>
  );
}

function TableRow({ title, buyer, amount, status, time }: any) {
  return (
    <tr className="hover:bg-gray-900/30 transition-colors group">
      <td className="py-4 font-medium text-white group-hover:text-brand-green transition-colors">
        {title}
      </td>
      <td className="py-4 text-gray-400">{buyer}</td>
      <td className="py-4 font-semibold">{amount}</td>
      <td className="py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            status === "Active"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : status === "Completed"
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                : "bg-orange-500/10 text-orange-400 border-orange-500/20"
          }`}
        >
          {status === "Active" && <Activity size={12} />}
          {status === "Completed" && <CheckCircle2 size={12} />}
          {status === "Pending" && <Clock size={12} />}
          {status}
        </span>
      </td>
      <td className="py-4 text-gray-500">{time}</td>
    </tr>
  );
}

// --- Custom Premium Dropdown ---
function CustomDropdown({ options, value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close (Senior UX practice)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-brand-green hover:border-gray-700 transition-colors text-white"
      >
        {value}
        
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-36 bg-[#111111] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-md"
          >
            {options.map((option: string) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  value === option
                    ? "bg-brand-green/20 text-brand-green font-medium"
                    : "text-gray-300 hover:bg-brand-green hover:text-black font-medium"
                }`}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
