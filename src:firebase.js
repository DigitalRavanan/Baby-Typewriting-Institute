// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBxS3WRK8kvVMO-q5EO_XvV6bwgm05IVN0",
  authDomain: "baby-typewriting-institu-89e00.firebaseapp.com",
  databaseURL: "https://baby-typewriting-institu-89e00-default-rtdb.firebaseio.com",
  projectId: "baby-typewriting-institu-89e00",
  storageBucket: "baby-typewriting-institu-89e00.firebasestorage.app",
  messagingSenderId: "873777136115",
  appId: "1:873777136115:web:e40b75d23ec3ffc2fc1286"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
