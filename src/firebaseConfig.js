// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import Firebase Auth
import { getFirestore } from "firebase/firestore";  // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzltomBiEIXBHa4sdunpfbbZHvkTdBeKU",
  authDomain: "todoapp-85d11.firebaseapp.com",
  projectId: "todoapp-85d11",
  storageBucket: "todoapp-85d11.appspot.com",
  messagingSenderId: "56538038790",
  appId: "1:56538038790:web:4a4854ffe8dab748b77987"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);  // This is for Firestore

// Export both Auth and Firestore
export { auth, db };  // Export Firestore along with Auth
