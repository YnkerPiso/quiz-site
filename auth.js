<<<<<<< HEAD
// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyANzIW_EqzkHVDzpZaD41LkMHugULjsFFk",
  authDomain: "quiz-app-e973d.firebaseapp.com",
  projectId: "quiz-app-e973d",
  storageBucket: "quiz-app-e973d.firebasestorage.app",
  messagingSenderId: "14843518571",
  appId: "1:14843518571:web:266c44f0a84001517c5b2e"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔥 AUTO LOGIN
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "home.html";
  }
});

// 🔥 ELEMENTS
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("error");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// 🔥 LOGIN
loginBtn.onclick = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    errorDiv.innerText = "Please fill all fields";
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => {
      errorDiv.innerText = err.message;
    });
};

// 🔥 REGISTER
registerBtn.onclick = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    errorDiv.innerText = "Please fill all fields";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => {
      errorDiv.innerText = err.message;
    });
};

let isLoading = false;

loginBtn.onclick = () => {
  if (isLoading) return;
  isLoading = true;

  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => {
      errorDiv.innerText = err.message;
    })
    .finally(() => {
      setTimeout(() => isLoading = false, 2000);
    });
=======
// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyANzIW_EqzkHVDzpZaD41LkMHugULjsFFk",
  authDomain: "quiz-app-e973d.firebaseapp.com",
  projectId: "quiz-app-e973d",
  storageBucket: "quiz-app-e973d.firebasestorage.app",
  messagingSenderId: "14843518571",
  appId: "1:14843518571:web:266c44f0a84001517c5b2e"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔥 AUTO LOGIN
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "home.html";
  }
});

// 🔥 ELEMENTS
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("error");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// 🔥 LOGIN
loginBtn.onclick = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    errorDiv.innerText = "Please fill all fields";
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => {
      errorDiv.innerText = err.message;
    });
};

// 🔥 REGISTER
registerBtn.onclick = () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    errorDiv.innerText = "Please fill all fields";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => {
      errorDiv.innerText = err.message;
    });
};

let isLoading = false;

loginBtn.onclick = () => {
  if (isLoading) return;
  isLoading = true;

  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "home.html";
    })
    .catch(err => {
      errorDiv.innerText = err.message;
    })
    .finally(() => {
      setTimeout(() => isLoading = false, 2000);
    });
>>>>>>> d893e09a02e28786e5f8b0cfdd814774c72df531
};