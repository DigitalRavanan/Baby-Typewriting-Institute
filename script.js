// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your Firebase config (use your config here)
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
const db = getDatabase(app);

// Attach function to window so HTML can call it
window.enrollWithPayment = function () {
  const name = document.getElementById("name").value.trim();
  const course = document.getElementById("course-select").value;
  const amount = document.getElementById("payment-amount").value.trim();

  if (!name || !course || !amount) {
    alert("Please fill all fields.");
    return;
  }

  const enrollRef = push(ref(db, "enrollments"));
  set(enrollRef, {
    name,
    course,
    amount,
    timestamp: Date.now()
  })
    .then(() => alert("Enrollment and payment recorded! We will contact you soon."))
    .catch(err => alert("Error: " + err.message));
};
