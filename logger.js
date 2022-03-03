const getLogger = () => {
  let logItems = [];
  const addItems = (newLogItem) => {
    const isShuffle = newLogItem === "Shuffle";
    const lastItemWasShuffle =
      logItems.length > 1 && logItems[logItems.length - 1].match("Shuffle");
    if (isShuffle && lastItemWasShuffle) {
      const numberOfPreviousShuffles =
        Number(logItems[logItems.length - 1].split(" x")[1]) || 1;
      logItems.pop();
      logItems.push(`Shuffle x${numberOfPreviousShuffles + 1}`);
    } else {
      logItems.push(newLogItem);
    }
    const loggerElement = document.querySelector(".logger");

    loggerElement.innerHTML = logItems
      .map((log) => `<div>${log}</div>`)
      .join("\n");
  };
  const loggerBaseElement = document.createElement("div");
  loggerBaseElement.classList.add("logger");

  // on logger click, close it
  loggerBaseElement.onclick = () => {
    loggerBaseElement.classList.add("logger-leave");
    setTimeout(() => {
      loggerBaseElement.classList.remove("logger-leave");
      loggerBaseElement.style.display = "none";
    }, 1000);
  };

  // on score click, toggle log
  const scoreElement = document.querySelector("#score-wrapper");
  scoreElement.onclick = () => {
    const isLoggerVisible = loggerBaseElement.style.display === "block";
    if (isLoggerVisible) {
      // if logger up, close it
      loggerBaseElement.classList.add("logger-leave");
      setTimeout(() => {
        loggerBaseElement.classList.remove("logger-leave");
        loggerBaseElement.style.display = "none";
      }, 1000);
    } else {
      // else change it to be visible
      loggerBaseElement.style.display = "block";
    }
  };

  document.body.appendChild(loggerBaseElement);
  return addItems;
};
