import { auth, db } from "./data.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { doc, getDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

console.log("🚀 script loaded");

// QUIZ DATA
let quiz = [];
let filteredQuiz = [];
let currentQuestion = 0;
let score = 0;
let answeredCount = 0;

// 🔥 NEW
let userAnswers = [];
let startTime = Date.now();

// USER DATA
let answeredCorrectly = {};

// RANGE
const START_ID = 1687;
const END_ID = 1688;

// LOAD
loadQuestions();

// AUTH
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await loadUserProgress();
  }
});

// LOAD USER PROGRESS
async function loadUserProgress() {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    answeredCorrectly = snap.data().answeredCorrectly || {};
  }
}

// SAVE CORRECT
async function saveCorrectAnswer(qId) {
  const user = auth.currentUser;
  if (!user) return;

  if (!answeredCorrectly[qId]) {
    answeredCorrectly[qId] = true;

    const ref = doc(db, "users", user.uid);

    await setDoc(ref, {
      answeredCorrectly
    }, { merge: true });
  }
}

// LOAD QUESTIONS
async function loadQuestions() {
  const res = await fetch("./questions.json?v=" + Date.now());
  const data = await res.json();

  quiz = data;

  filteredQuiz = quiz.filter(q => q.id >= START_ID && q.id <= END_ID);
  if (filteredQuiz.length === 0) filteredQuiz = quiz;

  currentQuestion = 0;
  score = 0;
  answeredCount = 0;
  userAnswers = [];
  startTime = Date.now();

  loadQuestion();
  updateProgress();
}

// LOAD QUESTION
function loadQuestion() {
  const q = filteredQuiz[currentQuestion];

  if (!q) {
    endQuiz();
    return;
  }

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

  q.answers.forEach((ans, index) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.innerText = (index + 1) + ". " + ans.text;

    btn.onclick = () => checkAnswer(btn, index);

    answersDiv.appendChild(btn);
  });
}

// CHECK
function checkAnswer(btn, index) {
  const all = document.querySelectorAll(".answer");
  all.forEach(b => b.disabled = true);

  const feedback = document.getElementById("feedback");
  const title = document.getElementById("feedback-title");
  const text = document.getElementById("feedback-text");

  const currentQ = filteredQuiz[currentQuestion];
  const correctIndex = currentQ.answers.findIndex(a => a.correct);

  all.forEach((b, i) => {
    if (i === correctIndex) b.classList.add("correct");
  });

  const isCorrect = index === correctIndex;

  // 🔥 SAVE ANSWER
  userAnswers.push({
    question: currentQ,
    selectedIndex: index,
    correctIndex: correctIndex,
    isCorrect: isCorrect
  });

  if (isCorrect) {
    score++;
    saveCorrectAnswer(currentQ.id);

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

// NEXT
window.nextQuestion = function () {
  document.getElementById("feedback").classList.remove("show");

  currentQuestion++;

  if (currentQuestion < filteredQuiz.length) {
    setTimeout(loadQuestion, 300);
  } else {
    endQuiz();
  }
};

// END → REDIRECT
function endQuiz() {
  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);

  localStorage.setItem("quizResults", JSON.stringify({
    score,
    total: filteredQuiz.length,
    answers: userAnswers,
    time: totalTime
  }));

  window.location.href = "result.html";
}

// PROGRESS
function updateProgress() {
  const total = filteredQuiz.length;
  const percent = total ? (answeredCount / total) * 100 : 0;

  document.getElementById("progress-bar").style.width = percent + "%";
  document.getElementById("progress-text").innerText =
    answeredCount + "/" + total;
}

// BACK
window.goBack = function () {
  window.history.back();
};