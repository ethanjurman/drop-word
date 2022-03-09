const stats = {
  dailyStreak: localStorage.getItem("daily-streak"),
};

const setScoreInRecords = (mode, currentScore) => {
  const previousHighScore =
    Number(localStorage.getItem(`${mode}-highscore`)) || 0;
  const highscore = Math.max(currentScore, previousHighScore);
  localStorage.setItem(`${mode}-highscore`, highscore);
  document.querySelector(".highscore").innerText = highscore;
};

const getStreak = () => Number(localStorage.getItem("daily-streak")) || 0;

const addToStreak = (daySeed) => {
  const streak = getStreak();
  if (Number(localStorage.getItem("users-previous-seed")) + 1 === daySeed) {
    localStorage.setItem("users-previous-seed", daySeed);
    localStorage.setItem("daily-streak", streak + 1);
  } else {
    localStorage.setItem("users-previous-seed", daySeed);
    localStorage.setItem("daily-streak", 1);
  }
  document.querySelector(".streak").innerText = getStreak();
};
