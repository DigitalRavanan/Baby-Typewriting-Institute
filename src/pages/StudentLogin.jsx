import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

function StudentRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !fullName) {
      setError("Please fill all fields");
      return;
    }
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional profile info in Realtime Database
      const db = getDatabase();
      await set(ref(db, 'students/' + user.uid), {
        fullName,
        email,
        createdAt: Date.now(),
        attendance: {},
        fees: {},
        leaveRequests: {}
      });

      alert("Registration successful! Please login.");
      navigate("/student/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
}

export default StudentRegister;
