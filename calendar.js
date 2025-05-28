window.addEventListener("DOMContentLoaded", function () {
  const calendar = document.getElementById("calendar");

  import("https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js").then(({ initializeApp }) => {
    import("https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js").then(({ getAuth }) => {
      import("https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js").then(({ getDatabase, ref, onValue }) => {
        const firebaseConfig = {
          apiKey: "AIzaSyBxS3WRK8kvVMO-q5EO_XvV6bwgm05IVN0",
          authDomain: "baby-typewriting-institu-89e00.firebaseapp.com",
          databaseURL: "https://baby-typewriting-institu-89e00-default-rtdb.firebaseio.com",
          projectId: "baby-typewriting-institu-89e00",
          storageBucket: "baby-typewriting-institu-89e00.appspot.com",
          messagingSenderId: "873777136115",
          appId: "1:873777136115:web:e40b75d23ec3ffc2fc1286"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getDatabase(app);

        auth.onAuthStateChanged(user => {
          if (!user) return;

          const attendanceRef = ref(db, `attendance/${user.uid}`);
          onValue(attendanceRef, snapshot => {
            calendar.innerHTML = "";

            snapshot.forEach(daySnap => {
              const date = daySnap.key;
              const data = daySnap.val();

              const div = document.createElement("div");
              div.style.border = "1px solid #ccc";
              div.style.margin = "5px";
              div.style.padding = "5px";
              div.innerHTML = `<strong>${date}</strong><br>Check-in: ${data.checkIn || "N/A"}<br>Check-out: ${data.checkOut || "N/A"}`;
              calendar.appendChild(div);
            });
          });
        });
      });
    });
  });
});
