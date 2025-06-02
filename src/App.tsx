import "./styles.css";
import "./tailwind.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Login/Login";
import { DashboardHome } from "./Dashboard/Home";
import { MainFrame } from "./Dashboard/MainFrame";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/main" element={<MainFrame />} />
        {/* Redirect root to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
