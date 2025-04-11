// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOShY7YMWluwvD1u95fBCGZ7chErFaBVQ",
  authDomain: "financetracker-698fc.firebaseapp.com",
  projectId: "financetracker-698fc",
  storageBucket: "financetracker-698fc.firebasestorage.app",
  messagingSenderId: "324352403818",
  appId: "1:324352403818:web:f9622d2a6c8276e1101d13"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

