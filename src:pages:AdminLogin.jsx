import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAILS = ["admin@example.com", "vijayanharish525@gmail.com"]; // add admin emails here

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (ADMIN_EMAILS.includes(userCredential.user.email)) {
        navigate("/admin/dashboard");
      } else {
        setError("You are not authorized as admin.");
        await auth.signOut();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
}

export default AdminLogin;
