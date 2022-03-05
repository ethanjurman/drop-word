const instructions = document.querySelector("#instructions");

if (!localStorage.getItem(window.location.pathname)) {
  instructions.style.display = "block";
}

// use localstorage to know if the instructions are open or not
localStorage.setItem(window.location.pathname, 1);

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
