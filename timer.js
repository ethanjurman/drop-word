let paused = true;
let startTime = null;
let timer = null;

document.querySelector("#timer").innerText = "1:30";

const startTimer = () => {
  paused = false;
  startTime = new Date().getTime() + 90000;
};

const updateTimer = () => {
  timer = Math.max(startTime - new Date().getTime(), 0);
  const minutes = Math.floor(timer / 60000);
  const seconds = Math.floor((timer % 60000) / 1000);
  const formattedTimer = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  if (formattedTimer != document.querySelector("#timer").innerText) {
    document.querySelector("#timer").innerText = formattedTimer;
  }
};

const stopTimer = () => {
  paused = true;
};

const makeTimer = (onTimeDone) => {
  console.log("starting timer");
  startTimer();
  const intervalId = setInterval(() => {
    updateTimer();
    if (timer <= 0) {
      stopTimer();
      clearInterval(intervalId);
      onTimeDone();
    }
  }, 120);
};
