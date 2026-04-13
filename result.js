const data = JSON.parse(localStorage.getItem("quizResults"));

if (!data) {
  document.body.innerHTML = "No results found";
  throw new Error("No data");
}

// 🔙 BACK BUTTON
window.goBack = function () {
  window.location.href = "page12.html";
};

// 📊 CALCULATE %
const percent = Math.round((data.score / data.total) * 100);

// 🎯 CIRCLE (GREEN)
const circle = document.getElementById("circle");
circle.style.background =
  `conic-gradient(#0f6d4d ${percent}%, #ddd ${percent}%)`;

document.getElementById("percent").innerText = percent + "%";

// 📊 STATS
document.getElementById("time").innerText = data.time + " sec";
document.getElementById("correct").innerText = data.score;
document.getElementById("wrong").innerText = data.total - data.score;

// 🔢 GRID
const grid = document.getElementById("grid");

data.answers.forEach((a, i) => {
  const btn = document.createElement("button");

  btn.innerText = i + 1;

  if (a.isCorrect) {
    btn.className = "correct-box";
  } else {
    btn.className = "wrong-box";
  }

  btn.onclick = () => {
    localStorage.setItem("reviewQuestion", JSON.stringify(a));
    window.location.href = "./review.html";
  };

  grid.appendChild(btn);
});