import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./pages/AddAdmin"; // අපි කලින් හදපු එක
import Users from "./pages/Users";
import Jobs from "./pages/Jobs";
import Finance from "./pages/Finance";
import Support from "./pages/Support";
import Flagged from "./pages/Flagged";
import AuditLogs from "./pages/AuditLogs";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Admins from "./pages/Admins";
import AppComplaints from "./pages/Complaints";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected Admin Routes (Layout එක ඇතුලේ) */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-admin" element={<AddAdmin />} />
          <Route path="/users" element={<Users />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/support" element={<Support />} />
          <Route path="/flagged" element={<Flagged />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/app-complaints" element={<AppComplaints />} />
          {/* ඉස්සරහට හදන pages මෙතනට දාන්න */}
          <Route path="/students" element={<div className="text-white">Students Page Coming Soon...</div>} />
        </Route>

        {/* වැරදි ලින්ක් එකකට ගියොත් Dashboard එකට යවන්න */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;