// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your Firebase config
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

// Login function
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      if (email === "admin@example.com") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "register.html";
      }
    })
    .catch(err => alert(err.message));
};

// Enroll function
window.enroll = function () {
  const name = document.getElementById("name").value;
  const course = document.getElementById("course").value;

  const newRef = push(ref(db, "enrollments"));
  set(newRef, { name, course })
    .then(() => alert("Enrollment successful!"))
    .catch(err => alert(err.message));
};

// Load enrollments (admin.html)
if (window.location.pathname.includes("admin.html")) {
  const list = document.getElementById("list");
  const enrollmentsRef = ref(db, "enrollments");

  onValue(enrollmentsRef, snapshot => {
    list.innerHTML = "";
    snapshot.forEach(child => {
      const data = child.val();
      const li = document.createElement("li");
      li.textContent = `${data.name} enrolled in ${data.course}`;
      list.appendChild(li);
    });
  });
}
