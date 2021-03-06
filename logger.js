const getLogger = ({ mode, seed }) => {
  let logItems = [];

  const addItems = (newLogItem) => {
    const logList = document.querySelector(".log-list");
    const isShuffle = newLogItem === "Shuffle";
    const lastItemWasShuffle =
      logItems.length > 0 && logItems[logItems.length - 1].match("Shuffle");
    if (isShuffle && lastItemWasShuffle) {
      const numberOfPreviousShuffles =
        Number(logItems[logItems.length - 1].split(" x")[1]) || 1;
      logItems.pop();
      logItems.push(`Shuffle x${numberOfPreviousShuffles + 1}`);
    } else {
      logItems.push(newLogItem);
    }
    logList.innerHTML = logItems.map((log) => `<div>${log}</div>`).join("\n");
  };

  const loggerBaseElement = document.createElement("div");
  loggerBaseElement.classList.add("logger");

  // on score click, toggle log
  const scoreElement = document.querySelector("#score-wrapper");
  const logOpenButton = document.createElement("div");
  logOpenButton.classList.add("open-logger");

  logOpenButton.onclick = () => {
    const isLoggerVisible = loggerBaseElement.style.display === "block";
    if (isLoggerVisible) {
      // if logger up, close it
      loggerBaseElement.classList.add("logger-leave");
      setTimeout(() => {
        loggerBaseElement.classList.remove("logger-leave");
        loggerBaseElement.style.display = "none";
      }, 500);
    } else {
      // else change it to be visible
      loggerBaseElement.style.display = "block";
    }
  };
  scoreElement.appendChild(logOpenButton);

  // copy seed button
  const copySeedUrlElement = document.createElement("div");
  if (seed) {
    copySeedUrlElement.classList.add("seed-link");
    copySeedUrlElement.innerHTML = `${mode} - seed: ${seed}<div class="copy-text">click here to copy link</div>`;
    copySeedUrlElement.onclick = () => {
      navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}?seed=${seed}`
      );
    };
  } else {
    copySeedUrlElement.classList.add("seed-link");
    copySeedUrlElement.innerHTML = `${mode} - ${new Date().toDateString()}<div class="copy-text">click here to copy link</div>`;
    copySeedUrlElement.onclick = () => {
      navigator.clipboard.writeText(`${window.location.href}`);
    };
  }
  loggerBaseElement.appendChild(copySeedUrlElement);

  // close button
  const closeElement = document.createElement("div");
  closeElement.classList.add("close-logger");
  closeElement.onclick = () => {
    loggerBaseElement.classList.add("logger-leave");
    setTimeout(() => {
      loggerBaseElement.classList.remove("logger-leave");
      loggerBaseElement.style.display = "none";
    }, 500);
  };
  loggerBaseElement.appendChild(closeElement);

  // streak
  if (mode === "Daily") {
    const streakElement = document.createElement("div");
    streakElement.classList.add("streak");
    streakElement.innerText = 0;
    loggerBaseElement.appendChild(streakElement);
  }

  // high score
  const highScoreElement = document.createElement("div");
  highScoreElement.classList.add("highscore");
  highScoreElement.innerText =
    localStorage.getItem(`${mode.toLowerCase()}-highscore`) || 0;
  loggerBaseElement.appendChild(highScoreElement);

  // line break
  loggerBaseElement.appendChild(document.createElement("hr"));

  // log list
  const logList = document.createElement("div");
  logList.classList.add("log-list");
  loggerBaseElement.appendChild(logList);

  // log copy button
  const logCopyButton = document.createElement("div");
  logCopyButton.classList.add("log-copy-button");
  logCopyButton.innerText = "click to copy log";
  logCopyButton.onclick = () => {
    const logListItems = document.querySelector(".log-list");
    const score = document.querySelector("#score").innerText;
    navigator.clipboard.writeText(
      `${mode} ${
        mode === "Daily" ? new Date().toDateString() : `(seed ${seed})`
      }\n${logListItems.innerText}\nScore: ${score}`
    );
  };
  loggerBaseElement.appendChild(logCopyButton);

  if (mode === "Daily") {
    // restart button
    const restart = document.createElement("a");
    restart.classList.add("restart-button");
    restart.href = window.location.pathname;
    restart.innerText = "Restart";
    loggerBaseElement.appendChild(restart);
  }

  if (mode !== "Daily") {
    // restart button
    const restart = document.createElement("a");
    restart.classList.add("new-game-button");
    restart.href = window.location.pathname;
    restart.innerText = "New Game (new board)";
    loggerBaseElement.appendChild(restart);
    // restart w/ seed button
    const restartWithSeed = document.createElement("a");
    restartWithSeed.classList.add("restart-button");
    restartWithSeed.href = `${window.location.pathname}?seed=${seed}`;
    restartWithSeed.innerText = "Restart (same board)";
    loggerBaseElement.appendChild(restartWithSeed);
  }

  document.body.appendChild(loggerBaseElement);
  return addItems;
};
