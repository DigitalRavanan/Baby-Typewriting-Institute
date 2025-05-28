import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import StudentLogin from '../pages/StudentLogin';
import StudentRegister from '../pages/StudentRegister';
import StudentDashboard from '../pages/StudentDashboard';
import GenericDashboard from '../pages/GenericDashboard';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GenericDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
