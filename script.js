// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyANzIW_EqzkHVDzpZaD41LkMHugULjsFFk",
  authDomain: "quiz-app-e973d.firebaseapp.com",
  projectId: "quiz-app-e973d",
  storageBucket: "quiz-app-e973d.firebasestorage.app",
  messagingSenderId: "14843518571",
  appId: "1:14843518571:web:266c44f0a84001517c5b2e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// QUIZ
let quiz = [];
let filteredQuiz = [];
let currentQuestion = 0;
let score = 0;
let answeredCount = 0;

let answeredCorrectly = {};

const START_ID = 1687;
const END_ID = 1688;

// LOAD USER DATA
async function loadUserProgress() {
  const user = auth.currentUser;
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));

  if (snap.exists()) {
    answeredCorrectly = snap.data().answeredCorrectly || {};
  }
}

// SAVE
async function saveProgress() {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(doc(db, "users", user.uid), {
    answeredCorrectly
  }, { merge: true });
}

// LOAD QUESTIONS
fetch("questions.json")
  .then(res => res.json())
  .then(async data => {
    quiz = data;
    filteredQuiz = quiz.filter(q => q.id >= START_ID && q.id <= END_ID);

    await loadUserProgress();

    loadQuestion();
    updateProgress();
  });

// LOAD QUESTION
function loadQuestion() {
  const q = filteredQuiz[currentQuestion];
  if (!q) return endQuiz();

  document.getElementById("question").innerText = q.question;

  const imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = "";

  if (q.image) {
    const img = document.createElement("img");
    img.src = q.image;
    img.className = "question-image";
    imageContainer.appendChild(img);
  }

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.innerText = `${i + 1}. ${ans.text}`;
    btn.onclick = () => checkAnswer(btn, ans.correct);
    answersDiv.appendChild(btn);
  });
}

// CHECK
function checkAnswer(btn, isCorrect) {
  const all = document.querySelectorAll(".answer");
  all.forEach(b => b.disabled = true);

  const q = filteredQuiz[currentQuestion];

  all.forEach((b, i) => {
    if (q.answers[i].correct) b.classList.add("correct");
  });

  const feedback = document.getElementById("feedback");

  if (isCorrect) {
    score++;
    answeredCorrectly[q.id] = true;
    saveProgress();
    feedback.className = "feedback correct-bg show";
  } else {
    btn.classList.add("wrong");
    feedback.className = "feedback wrong-bg show";
  }

  answeredCount++;
  updateProgress();
}

// NEXT
function nextQuestion() {
  document.getElementById("feedback").classList.remove("show");
  currentQuestion++;

  if (currentQuestion < filteredQuiz.length) {
    setTimeout(loadQuestion, 300);
  } else {
    endQuiz();
  }
}

// END
function endQuiz() {
  document.getElementById("question").innerText =
    `Ավարտվեց 🎉 ${score}/${filteredQuiz.length}`;
  document.getElementById("answers").innerHTML = "";
}

// PROGRESS
function updateProgress() {
  const percent = (answeredCount / filteredQuiz.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").innerText =
    answeredCount + "/" + filteredQuiz.length;
}

// BACK
function goBack() {
  window.history.back();
}