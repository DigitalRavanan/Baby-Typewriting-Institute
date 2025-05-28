// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBxS3WRK8kvVMO-q5EO_XvV6bwgm05IVN0",
  authDomain: "baby-typewriting-institu-89e00.firebaseapp.com",
  databaseURL: "https://baby-typewriting-institu-89e00-default-rtdb.firebaseio.com",
  projectId: "baby-typewriting-institu-89e00",
  storageBucket: "baby-typewriting-institu-89e00.appspot.com",
  messagingSenderId: "873777136115",
  appId: "1:873777136115:web:e40b75d23ec3ffc2fc1286"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Enroll with payment function
window.enrollWithPayment = function () {
  const name = document.getElementById("name").value;
  const course = document.getElementById("course-select").value;
  const amount = document.getElementById("payment-amount").value;

  if (!name || !course || !amount) {
    alert("Please fill in all fields");
    return;
  }

  const newRef = push(ref(db, "students"));
  set(newRef, {
    name,
    course,
    payment: amount,
    attendance: {}
  })
    .then(() => alert("Enrolled successfully!"))
    .catch(err => alert(err.message));
};

// Login function
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      if (email === "vijayanharish525@gmail.com") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "student-dashboard.html";
      }
    })
    .catch(err => alert(err.message));
};

// Mark Check-In
window.markCheckIn = function () {
  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toLocaleTimeString();

  update(ref(db, `attendance/${user.uid}/${today}`), {
    checkIn: now
  }).then(() => alert("Checked in!"));
};

// Mark Check-Out
window.markCheckOut = function () {
  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toLocaleTimeString();

  update(ref(db, `attendance/${user.uid}/${today}`), {
    checkOut: now
  }).then(() => alert("Checked out!"));
};
// Listen for auth state changes