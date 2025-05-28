import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { ref, update, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        const attendanceRef = ref(database, "students/" + u.uid + "/attendance");
        onValue(attendanceRef, (snapshot) => {
          setAttendance(snapshot.val() || {});
        });
      } else {
        navigate("/student/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const markAttendance = () => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    update(ref(database, "students/" + user.uid + "/attendance/" + today), {
      markedAt: Date.now()
    }).catch(e => setError(e.message));
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/student/login");
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={markAttendance}>Mark Attendance</button>
      <h3>Attendance Records:</h3>
      <ul>
        {attendance && Object.entries(attendance).map(([date, record]) => (
          <li key={date}>{date} - Marked at: {new Date(record.markedAt).toLocaleString()}</li>
        ))}
      </ul>
      {error && <p style={{color:"red"}}>{error}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StudentDashboard;
