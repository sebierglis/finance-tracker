import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOShY7YMWluwvD1u95fBCGZ7chErFaBVQ",
  authDomain: "financetracker-698fc.firebaseapp.com",
  projectId: "financetracker-698fc",
  storageBucket: "financetracker-698fc.appspot.com",
  messagingSenderId: "324352403818",
  appId: "1:324352403818:web:f9622d2a6c8276e1101d13"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
