// src/pages/GenericDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

function GenericDashboard() {
  return (
    <div>
      <h1>Baby Typewriting Institute</h1>
      <p>Welcome to Baby Typewriting Institute. Please choose:</p>
      <ul>
        <li><Link to="/admin/login">Admin Login</Link></li>
        <li><Link to="/student/login">Student Login</Link></li>
        <li><Link to="/student/register">Student Register</Link></li>
      </ul>
    </div>
  );
}

export default GenericDashboard;
