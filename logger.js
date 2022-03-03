const getLogger = () => {
  const body = document.querySelector("body");
  let logItems = [];
  const addItems = (newLogItem) => {
    const isShuffle = newLogItem === "Shuffle";
    const lastItemWasShuffle =
      logItems.length > 1 && logItems[logItems.length - 1].match("Shuffle");
    if (isShuffle && lastItemWasShuffle) {
      const numberOfPreviousShuffles =
        Number(logItems[logItems.length - 1].split(" x")[1]) || 0;
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
    loggerBaseElement.style.display = "none";
  };

  // on score click, toggle log
  const scoreElement = document.querySelector("#score-wrapper");
  scoreElement.onclick = () => {
    loggerBaseElement.style.display =
      loggerBaseElement.style.display === "block" ? "none" : "block";
  };

  document.body.appendChild(loggerBaseElement);
  return addItems;
};
