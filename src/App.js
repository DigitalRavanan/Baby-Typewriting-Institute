import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import GenericDashboard from "./pages/GenericDashboard";

function App() {
  return (
    <Routes>
      {/* Generic dashboard */}
      <Route path="/" element={<GenericDashboard />} />

      {/* Student routes */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
