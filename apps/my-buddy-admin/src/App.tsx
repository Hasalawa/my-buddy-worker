import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AddAdmin from "./pages/AddAdmin"; // අපි කලින් හදපු එක

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
          {/* ඉස්සරහට හදන pages මෙතනට දාන්න */}
          <Route path="/students" element={<div className="text-white">Students Page Coming Soon...</div>} />
        </Route>

        {/* වැරදි ලින්ක් එකකට ගියොත් Dashboard එකට යවන්න */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;