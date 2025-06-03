import "./styles.css";
import "./tailwind.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginAnimation } from "./Pages/LoginAnimation";
import { Login } from "./Pages/Login";
import { DashboardHome } from "./Pages/Dashboard/Home";
import { MainFrame } from "./Pages/Dashboard/MainFrame";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginAnimation" element={<LoginAnimation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/main" element={<MainFrame />} />
        {/* Redirect root to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
