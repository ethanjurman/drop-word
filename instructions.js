const instructions = document.querySelector("#instructions");

const currentDate = new Date().getTime();
const lastOpenedDate = localStorage.getItem(window.location.pathname);

// open instructions and set local storage if new
if (!lastOpenedDate) {
  instructions.style.display = "block";
  localStorage.setItem(window.location.pathname, currentDate);
}

// open instructions and set local storage if over a day old
if (currentDate - Number(lastOpenedDate) > 24 * 60 * 60 * 1000) {
  instructions.style.display = "block";
  localStorage.setItem(window.location.pathname, currentDate);
}

const instructionsOpenButton = document.createElement("div");
instructionsOpenButton.classList.add("open-instructions");

instructionsOpenButton.onclick = () => {
  const isLoggerVisible = instructions.style.display === "block";
  if (isLoggerVisible) {
    // if logger up, close it
    instructions.classList.add("logger-leave");
    setTimeout(() => {
      instructions.classList.remove("logger-leave");
      instructions.style.display = "none";
    }, 500);
  } else {
    // else change it to be visible
    instructions.style.display = "block";
  }
};
const scoreElement = document.querySelector("#score-wrapper");
scoreElement.appendChild(instructionsOpenButton);

// close button
const closeInstructions = document.createElement("div");
closeInstructions.classList.add("close-logger");
closeInstructions.onclick = () => {
  instructions.classList.add("logger-leave");
  setTimeout(() => {
    instructions.classList.remove("logger-leave");
    instructions.style.display = "none";
  }, 500);
};
instructions.appendChild(closeInstructions);
