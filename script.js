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
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { update, get, child } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

let currentUser;

// Monitor login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadAttendance();
  }
});

window.checkIn = function () {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleTimeString();
  const path = `students/${currentUser.uid}/attendance/${today}`;
  set(ref(db, path), { checkIn: now });
  alert("Checked in at " + now);
};

window.checkOut = function () {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleTimeString();
  const path = `students/${currentUser.uid}/attendance/${today}/checkOut`;
  set(ref(db, path), now);
  alert("Checked out at " + now);
};

window.requestLeave = function () {
  const date = document.getElementById("leaveDate").value;
  const reason = document.getElementById("leaveReason").value;
  if (!date || !reason) return alert("Fill in both fields.");

  set(ref(db, `students/${currentUser.uid}/leaves/${date}`), reason)
    .then(() => alert("Leave requested."))
    .catch((err) => alert(err.message));
};

window.updateProfile = function () {
  const name = document.getElementById("updateName").value;
  const email = document.getElementById("updateEmail").value;
  update(ref(db, `students/${currentUser.uid}`), {
    name, email
  })
    .then(() => alert("Profile updated."))
    .catch((err) => alert(err.message));
};

function loadAttendance() {
  const list = document.getElementById("attendanceList");
  const attendanceRef = ref(db, `students/${currentUser.uid}/attendance`);
  onValue(attendanceRef, snapshot => {
    list.innerHTML = "";
    snapshot.forEach(day => {
      const record = day.val();
      const li = document.createElement("li");
      li.textContent = `${day.key}: In - ${record.checkIn || '-'}, Out - ${record.checkOut || '-'}`;
      list.appendChild(li);
    });
  });
}
