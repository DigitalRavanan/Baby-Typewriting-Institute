import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { getDatabase, ref, get, set, push } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const db = getDatabase();

  const [profile, setProfile] = useState({});
  const [attendance, setAttendance] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({ from: "", to: "", reason: "" });
  const [message, setMessage] = useState("");

  // Load student data on mount
  useEffect(() => {
    if (!user) {
      navigate("/student/login");
      return;
    }
    // Fetch profile data
    get(ref(db, `students/${user.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.val());
        setAttendance(snapshot.val().attendance || {});
        setLeaveRequests(snapshot.val().leaveRequests ? Object.values(snapshot.val().leaveRequests) : []);
      }
    });
  }, [user, db, navigate]);

  // Mark Attendance (check-in or check-out for today)
  const markAttendance = async (type) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const attendanceRef = ref(db, `students/${user.uid}/attendance/${today}`);

    let updateData = {};
    if (type === "checkin") {
      updateData.checkIn = new Date().toISOString();
    } else if (type === "checkout") {
      updateData.checkOut = new Date().toISOString();
    }

    try {
      await set(attendanceRef, {
        ...attendance[today],
        ...updateData,
      });
      setAttendance((prev) => ({ ...prev, [today]: { ...prev[today], ...updateData } }));
      setMessage(`${type === "checkin" ? "Checked In" : "Checked Out"} successfully!`);
    } catch (err) {
      setMessage("Error marking attendance: " + err.message);
    }
  };

  // Submit leave request
  const submitLeaveRequest = async (e) => {
    e.preventDefault();
    if (!newLeave.from || !newLeave.to || !newLeave.reason) {
      setMessage("Please fill all leave request fields.");
      return;
    }
    try {
      const leaveRef = ref(db, `students/${user.uid}/leaveRequests`);
      const newLeaveRef = push(leaveRef);
      await set(newLeaveRef, { ...newLeave, status: "pending", submittedAt: new Date().toISOString() });
      setLeaveRequests((prev) => [...prev, { ...newLeave, status: "pending" }]);
      setNewLeave({ from: "", to: "", reason: "" });
      setMessage("Leave request submitted.");
    } catch (err) {
      setMessage("Error submitting leave request: " + err.message);
    }
  };

  // Update profile
  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await set(ref(db, `students/${user.uid}`), {
        ...profile,
        attendance,
        leaveRequests: leaveRequests.reduce((acc, lr, i) => {
          acc[i] = lr;
          return acc;
        }, {}),
      });
      setMessage("Profile updated.");
    } catch (err) {
      setMessage("Error updating profile: " + err.message);
    }
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    navigate("/student/login");
  };

  return (
    <div>
      <h2>Welcome, {profile.fullName || "Student"}</h2>
      <button onClick={logout}>Logout</button>

      <section>
        <h3>Mark Attendance</h3>
        <button onClick={() => markAttendance("checkin")}>Check In</button>
        <button onClick={() => markAttendance("checkout")}>Check Out</button>
      </section>

      <section>
        <h3>Attendance Report</h3>
        <ul>
          {Object.entries(attendance).map(([date, record]) => (
            <li key={date}>
              <strong>{date}</strong>: Check-in - {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"}, Check-out - {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "N/A"}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Course Details</h3>
        <p>Basic Typewriting Course - Duration: 3 Months</p>
        <p>Advanced Typewriting Course - Duration: 2 Months</p>
        {/* You can load real course details from database as needed */}
      </section>

      <section>
        <h3>Leave Requests</h3>
        <form onSubmit={submitLeaveRequest}>
          <label>
            From: <input type="date" value={newLeave.from} onChange={e => setNewLeave({...newLeave, from: e.target.value})} required />
          </label>
          <label>
            To: <input type="date" value={newLeave.to} onChange={e => setNewLeave({...newLeave, to: e.target.value})} required />
          </label>
          <label>
            Reason: <textarea value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} required />
          </label>
          <button type="submit">Submit Leave Request</button>
        </form>
        <ul>
          {leaveRequests.map((lr, i) => (
            <li key={i}>
              {lr.from} to {lr.to} — {lr.reason} (Status: {lr.status})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Update Profile</h3>
        <form onSubmit={updateProfile}>
          <label>
            Full Name: <input type="text" value={profile.fullName || ""} onChange={e => setProfile({...profile, fullName: e.target.value})} required />
          </label>
          <label>
            Email: <input type="email" value={profile.email || ""} readOnly />
          </label>
          <button type="submit">Save Profile</button>
        </form>
      </section>

      {message && <p style={{color: "green"}}>{message}</p>}
    </div>
  );
}

export default StudentDashboard;