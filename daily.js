const letterGridElement = document.querySelector("#letter-grid");
const wordInputWrapperElement = document.querySelector("#word-input-wrapper");
let wordChains = [];
let word = "";
let gameEnd = false;
const logger = getLogger({ mode: "Daily", seed: null });

const rows = 5;
const cols = 5;
const characters =
  "aaaaaaaaaabbccddddeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnoooooooppqrrrrrrssssssttttttuuuuvvwwxyyz";

const fibbScore = [
  0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
  4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811,
];

const date = new Date();
let seed = Number(
  `${date.getYear()}${
    date.getMonth() >= 10 ? date.getMonth() : "0" + date.getMonth()
  }${date.getDay() >= 10 ? date.getDay() : "0" + date.getDay()}`
);

// different from blitz or endless because we don't re-add letters
const dropLetters = () => {
  const allLetters = document.querySelectorAll(".letter-item");
  allLetters.forEach((element) => {
    const { row, col } = element.dataset;
    if (Number(col) == 4) {
      return;
    }
    const emptyItemBelow = !document.querySelector(
      `[data-row="${row}"][data-col="${Number(col) + 1}"]`
    );
    if (emptyItemBelow) {
      element.dataset.col = Number(col) + 1;
      element.style.top = 60 * Number(element.dataset.col);
    }
  });
};

const handleKeyDown = ({ key }) => {
  const numberOfLetters = wordInputWrapperElement.children.length;
  if (gameEnd) {
    return;
  }
  if ((key === "Backspace" || key === "del") && numberOfLetters > 0) {
    const lastChild = wordInputWrapperElement.children[numberOfLetters - 1];
    wordInputWrapperElement.removeChild(lastChild);
    word = word.slice(0, word.length - 1);
  }
  if (characters.includes(key)) {
    addLetterTyped(key);
  }
  if (key === "clear" || key === "Escape") {
    clearWord();
  }
  if (key === " " || key === "shuffle") {
    logger("Shuffle");
    clearWord();
    shuffleGrid();
  }
  if (key === "Enter" || key === "enter") {
    const validWord = word.toUpperCase() in words;
    if (!validWord) {
      markAsBadWord();
      return;
    }

    const selectedLetters = document.querySelectorAll(".on");
    const scoreAdd = wordChains.length * fibbScore[word.length];

    const scoreAddElement = document.querySelector("#score-add");
    scoreAddElement.innerText = `+${scoreAdd}`;
    scoreAddElement.classList.add("slide-up-score");
    setTimeout(() => {
      scoreAddElement.classList.remove("slide-up-score");
    }, 1000);

    selectedLetters.forEach((element) =>
      element.parentElement.removeChild(element)
    );
    if (scoreAdd > 0) {
      logger(
        `${word.toUpperCase()}: +${fibbScore[word.length]} x ${
          wordChains.length
        }`
      );
    }
    clearWord();
    const scoreElement = document.querySelector("#score");
    scoreElement.innerText = Number(scoreElement.innerText) + scoreAdd;
    checkIfAnyWordsLeft();
  }
  unselectLetters();
  evaluateWordElements();
};

const checkIfAnyWordsLeft = () => {
  const boardLetterElements = document.querySelectorAll(".letter-item");
  const scoreElement = document.querySelector("#score");
  const boardLetterElementsArray = [...boardLetterElements];
  if (boardLetterElementsArray.length === 0) {
    const currentScore = Number(scoreElement.innerText);
    const scoreAddElement = document.querySelector("#score-add");
    scoreAddElement.innerText = `x3`;
    scoreAddElement.classList.add("slide-up-score");
    logger(`Board Clear: ${currentScore} x 3`);
    setTimeout(() => {
      scoreAddElement.classList.remove("slide-up-score");
      const scoreElement = document.querySelector("#score");
      scoreElement.innerText = currentScore * 3;
    }, 1000);
  }

  const boardLetters = boardLetterElementsArray
    .map((element) => element.innerText)
    .sort()
    .join("");
  const isLastWord = !Object.keys(words).some((word) =>
    boardLetters.includes([...word].sort().join(""))
  );
  if (isLastWord) {
    gameEnd = true;
    setTimeout(() => {
      document.querySelector(".logger").style.display = "block";
    }, 1200);
  }
};

document.addEventListener("keydown", handleKeyDown);

buildGrid();
buildKeyboard({
  onKeyPress: handleKeyDown,
  parent: document.querySelector("#keyboard"),
});

setInterval(() => {
  dropLetters();
}, 120);
