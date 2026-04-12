// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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
const db = getFirestore(app);

// 🔥 QUIZ VARIABLES
let quiz = [];
let filteredQuiz = [];
let currentQuestion = 0;
let score = 0;
let answeredCount = 0;

// 🔥 SAVE CORRECT ANSWERS PER USER
let answeredCorrectly = {};

// RANGE
const START_ID = 1687;
const END_ID = 1688;

// 🔥 LOAD USER DATA FROM FIREBASE
async function loadUserProgress() {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    answeredCorrectly = data.answeredCorrectly || {};
  }
}

// 🔥 SAVE TO FIREBASE
async function saveProgress() {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(ref, {
    answeredCorrectly: answeredCorrectly
  }, { merge: true });
}

// LOAD QUESTIONS
fetch("questions.json")
  .then(res => res.json())
  .then(async data => {
    quiz = data;

    filteredQuiz = quiz.filter(q => q.id >= START_ID && q.id <= END_ID);

    await loadUserProgress(); // 🔥 LOAD USER DATA

    loadQuestion();
    updateProgress();
  });

// LOAD QUESTION
function loadQuestion() {
  const q = filteredQuiz[currentQuestion];

  if (!q) {
    endQuiz();
    return;
  }

  document.getElementById("question").innerText = q.question;

  // IMAGE
  const imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = "";

  if (q.image) {
    const img = document.createElement("img");
    img.src = q.image;
    img.className = "question-image";
    imageContainer.appendChild(img);
  }

  // ANSWERS
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach((ans, index) => {
    const btn = document.createElement("button");
    btn.className = "answer";

    btn.innerText = (index + 1) + ". " + ans.text;

    btn.onclick = () => checkAnswer(btn, ans.correct);

    answersDiv.appendChild(btn);
  });
}

// CHECK ANSWER
function checkAnswer(btn, isCorrect) {
  const all = document.querySelectorAll(".answer");
  all.forEach(b => b.disabled = true);

  const feedback = document.getElementById("feedback");
  const title = document.getElementById("feedback-title");
  const text = document.getElementById("feedback-text");

  // SHOW CORRECT ANSWER
  all.forEach((b, i) => {
    if (filteredQuiz[currentQuestion].answers[i].correct) {
      b.classList.add("correct");
    }
  });

  if (isCorrect) {
    score++;

    // 🔥 SAVE THIS QUESTION AS CORRECT
    const qId = filteredQuiz[currentQuestion].id;
    answeredCorrectly[qId] = true;

    saveProgress(); // 🔥 SAVE TO FIREBASE

    title.innerText = "Ճիշտ է";
    text.innerText = "Դուք ճիշտ պատասխանեցիք";
    feedback.className = "feedback correct-bg show";
  } else {
    btn.classList.add("wrong");

    title.innerText = "Սխալ է";
    text.innerText = "Ճիշտ պատասխանը նշված է կանաչով";
    feedback.className = "feedback wrong-bg show";
  }

  answeredCount++;
  updateProgress();
}

// NEXT QUESTION
function nextQuestion() {
  document.getElementById("feedback").classList.remove("show");

  currentQuestion++;

  if (currentQuestion < filteredQuiz.length) {
    setTimeout(loadQuestion, 300);
  } else {
    endQuiz();
  }
}

// END QUIZ
function endQuiz() {
  document.getElementById("question").innerText =
    `Ավարտվեց 🎉 Ձեր միավորն է ${score}/${filteredQuiz.length}`;

  document.getElementById("answers").innerHTML = "";
  document.getElementById("image-container").innerHTML = "";
}

// PROGRESS BAR
function updateProgress() {
  const percent = (answeredCount / filteredQuiz.length) * 100;

  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").innerText =
    answeredCount + "/" + filteredQuiz.length;
}

// BACK BUTTON
function goBack() {
  window.history.back();
}