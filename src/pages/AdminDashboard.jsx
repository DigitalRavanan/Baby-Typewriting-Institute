import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAILS = ["admin@example.com", "vijayanharish525@gmail.com"]; // your admins here

function AdminDashboard() {
  const [students, setStudents] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || !ADMIN_EMAILS.includes(user.email)) {
        navigate("/admin/login");
      } else {
        const studentsRef = ref(database, "students");
        onValue(studentsRef, (snapshot) => {
          setStudents(snapshot.val() || {});
        });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>Students List</h3>
      <ul>
        {Object.entries(students).map(([id, student]) => (
          <li key={id}>
            {student.name} ({student.email}) - Fees Paid: {student.feesPaid || 0}
            {/* Expand with attendance and leave details as needed */}
          </li>
        ))}
      </ul>
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
}

export default AdminDashboard;
