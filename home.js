import { auth, db } from "./data.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { doc, setDoc, onSnapshot } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

let questionsCache = [];

// 🔥 PRELOAD QUESTIONS (FAST)
async function preloadQuestions() {
  try {
    const res = await fetch("./questions.json");

    if (!res.ok) throw new Error("HTTP " + res.status);

    questionsCache = await res.json();

    console.log("✅ Questions loaded:", questionsCache.length);

  } catch (err) {
    console.error("❌ Failed to load questions:", err);
  }
}

// 🔒 AUTH + REALTIME LISTENER
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  await preloadQuestions();

  const ref = doc(db, "users", user.uid);

  onSnapshot(ref, (snap) => {
    let answeredCorrectly = {};

    if (snap.exists()) {
      answeredCorrectly = snap.data().answeredCorrectly || {};
    }

    updateCircle(answeredCorrectly);
  });
});

// 🔥 UPDATE PROGRESS CIRCLE
function updateCircle(answeredCorrectly) {
  const total = questionsCache.length;

  if (!total) {
    console.warn("⚠ No questions found");
    return;
  }

  // ✅ COUNT CORRECT ANSWERS (FIXED)
  const correctCount = Object.keys(answeredCorrectly).length;

  const percent = Math.round((correctCount / total) * 100);

  console.log("📊 Progress:", percent + "%");

  const circle = document.getElementById("progress-circle");

  circle.style.background =
    `conic-gradient(#0f6d4d ${percent}%, #ddd ${percent}%)`;

  document.getElementById("progress-text").innerText = percent + "%";
}

// 🔥 RESET PROGRESS
window.resetProgress = async function() {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(ref, {
    answeredCorrectly: {}
  }, { merge: true });

  console.log("♻ Progress reset");
};

// 🔐 LOGOUT
window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// ▶ START QUIZ (FIXED NAVIGATION)
window.startQuiz = function() {
  window.location.href = "nextpage.html"; // ✅ FIX HERE
};