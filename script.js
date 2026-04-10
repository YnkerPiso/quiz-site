let quiz = [];
let currentQuestion = 0;
let score = 0;

// store correct answers by QUESTION ID
let answeredCorrectly = {};

// Load questions
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    quiz = data;

    // load saved progress
    const saved = localStorage.getItem("answeredCorrectly");

    if (saved) {
      answeredCorrectly = JSON.parse(saved);
    } else {
      answeredCorrectly = {};
      localStorage.setItem("answeredCorrectly", JSON.stringify(answeredCorrectly));
    }

    updateProgress();
    loadQuestion();
  });

function loadQuestion() {
  const q = quiz[currentQuestion];

  // set question text
  document.getElementById("question").innerText = q.question;

  // ✅ HANDLE IMAGE
  const img = document.getElementById("question-image");

  if (q.image) {
    img.src = q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  // answers
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.innerText = ans.text;

    btn.dataset.correct = ans.correct;

    btn.onclick = () => checkAnswer(btn, ans.correct);

    answersDiv.appendChild(btn);
  });
}

function checkAnswer(clickedBtn, isCorrect) {
  const all = document.querySelectorAll(".answer");
  const feedback = document.getElementById("feedback");
  const title = document.getElementById("feedback-title");
  const text = document.getElementById("feedback-text");

  const q = quiz[currentQuestion];

  // disable buttons
  all.forEach(b => b.disabled = true);

  // ✅ save correct answer by ID
  if (isCorrect) {
    answeredCorrectly[q.id] = true;
    localStorage.setItem("answeredCorrectly", JSON.stringify(answeredCorrectly));
    score++;
  }

  // move forward
  currentQuestion++;
  updateProgress();

  // show correct answer in green
  all.forEach(btn => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
  });

  if (isCorrect) {
    feedback.className = "feedback correct-bg";
    title.innerText = "Ճիշտ է";
    text.innerText = "Դուք ճիշտ պատասխանեցիք";
  } else {
    clickedBtn.classList.add("wrong");
    feedback.className = "feedback wrong-bg";
    title.innerText = "Սխալ է";
    text.innerText = "Ճիշտ պատասխանը նշված է կանաչով";
  }

  setTimeout(() => {
    feedback.classList.add("show");
  }, 50);
}

function nextQuestion() {
  const feedback = document.getElementById("feedback");
  feedback.classList.remove("show");

  if (currentQuestion < quiz.length) {
    setTimeout(loadQuestion, 300);
  } else {
    document.getElementById("question").innerText =
      `Ավարտվեց 🎉 Ձեր միավորն է ${score}/${quiz.length}`;

    document.getElementById("answers").innerHTML = "";

    // hide image on finish
    document.getElementById("question-image").style.display = "none";

    document.getElementById("progress-bar").style.width = "100%";
    document.getElementById("progress-text").innerText =
      `${quiz.length}/${quiz.length}`;
  }
}

function updateProgress() {
  const progress = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  const percent = (currentQuestion / quiz.length) * 100;
  progress.style.width = percent + "%";

  progressText.innerText = `${currentQuestion}/${quiz.length}`;
}

function goBack() {
  window.history.back();
}