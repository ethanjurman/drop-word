const letterGridElement = document.querySelector("#letter-grid");
const wordInputWrapperElement = document.querySelector("#word-input-wrapper");
let wordChains = [];
let word = "";

const rows = 5;
const cols = 5;
const characters =
  "aaaaaaaaaabbccddddeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnoooooooppqrrrrrrssssssttttttuuuuvvwwxyyz";

const fibbScore = [
  0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
  4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811,
];

const searchParams = new URLSearchParams(window.location.search);

let seed =
  Number(searchParams.get("seed")) || Math.floor(Math.random() * 100000000);

const logger = getLogger({ mode: "Endless", seed });

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
  const topRow = document.querySelectorAll(`[data-col="0"]`);
  if (topRow.length < 5) {
    const index0 = document.querySelector(`[data-row="0"][data-col="0"]`);
    const index1 = document.querySelector(`[data-row="1"][data-col="0"]`);
    const index2 = document.querySelector(`[data-row="2"][data-col="0"]`);
    const index3 = document.querySelector(`[data-row="3"][data-col="0"]`);
    const index4 = document.querySelector(`[data-row="4"][data-col="0"]`);
    if (!index0) {
      addLetterBubble(0, 0);
    }
    if (!index1) {
      addLetterBubble(1, 0);
    }
    if (!index2) {
      addLetterBubble(2, 0);
    }
    if (!index3) {
      addLetterBubble(3, 0);
    }
    if (!index4) {
      addLetterBubble(4, 0);
    }
  }
};

const handleKeyDown = ({ key }) => {
  const numberOfLetters = wordInputWrapperElement.children.length;
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
  }
  unselectLetters();
  evaluateWordElements();
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
