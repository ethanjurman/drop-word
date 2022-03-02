const letterGridElement = document.querySelector("#letter-grid");
const wordInputWrapperElement = document.querySelector("#word-input-wrapper");
let wordChains = [];
let word = "";

const rows = 5;
const cols = 5;
// A-9, B-2, C-2, D-4, E-12, F-2, G-3, H-2, I-9, J-1, K-1, L-4, M-2, N-6, O-8, P-2, Q-1, R-6, S-4, T-6, U-4, V-2, W-2, X-1, Y-2, Z-1
const characters =
  "aaaaaaaaaabbccddddeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnoooooooppqrrrrrrssssssttttttuuuuvvwwxyyz";

const randomLetter = () =>
  characters[Math.floor(Math.random() * characters.length)];

const addLetterBox = (row, col) => {
  const posX = row * 60;
  const posY = col * 60;
  const element = document.createElement("div");
  element.classList.add("letter-item");
  element.dataset.row = row;
  element.dataset.col = col;

  element.style.left = posX;
  element.style.top = posY;
  element.innerText = randomLetter();
  // element.onclick = (event) => {
  //   event.preventDefault();
  //   if (element.classList.contains("on")) {
  //     element.classList.remove("on");
  //   } else {
  //     element.classList.add("on");
  //   }
  // };
  letterGridElement.appendChild(element);
};

const buildGrid = () => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      addLetterBox(row, col);
    }
  }
};

const clearWordElements = () => {
  const allLetters = document.querySelectorAll(".letter-item");
  allLetters.forEach((elements) => elements.classList.remove("on"));
};

const adjacentItemsNotInChain = (chain) => {
  const lastItem = chain[chain.length - 1];
  const { row, col } = lastItem.dataset;
  const allLetters = document.querySelectorAll(".letter-item");
  let arrayReturn = [];
  allLetters.forEach((element) => {
    const { row: elementRow, col: elementCol } = element.dataset;
    const elementIsAdjacent =
      Math.abs(row - elementRow) <= 1 && Math.abs(col - elementCol) <= 1;
    const elementIsInChain = chain.includes(element);
    if (!elementIsInChain && elementIsAdjacent) {
      arrayReturn.push(element);
    }
  });
  return arrayReturn;
};

const evaluateWordElements = () => {
  if (!word) {
    return;
  }
  const allLetters = document.querySelectorAll(".letter-item");
  if (word[0]) {
    // get first letter
    allLetters.forEach((element) => {
      const isKey = element.innerText == word[0].toUpperCase();
      if (isKey) {
        wordChains.push([element]);
      }
    });
  }

  for (charIndex in word) {
    if (charIndex == 0) {
      continue; // already done above
    }
    for (chainArrayIndex in wordChains) {
      const chainArray = wordChains[chainArrayIndex];
      const itemsWithCharacter = (
        (chainArray.length > 0 && adjacentItemsNotInChain(chainArray)) ||
        []
      ).filter((element) => {
        const hasCharacter = element.innerText == word[charIndex].toUpperCase();
        return hasCharacter;
      });
      if (itemsWithCharacter.length === 0) {
        // there are no new items, we should remove this list
        wordChains[chainArrayIndex] = [];
      } else if (itemsWithCharacter.length === 1) {
        // there is only a single addition, we should just add to existing list
        chainArray.push(itemsWithCharacter[0]);
      } else {
        itemsWithCharacter.forEach((newTailElement) => {
          wordChains.push([...chainArray, newTailElement]);
        });
      }
    }
  }
  // filter bad sizes
  wordChains = wordChains.filter((chains) => chains.length === word.length);
  // actually change style of those elements;
  for (chain of wordChains) {
    for (element of chain) {
      console.log({ element, chain, wordChains });
      element.classList.add("on");
    }
  }
};

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
      addLetterBox(0, 0);
    }
    if (!index1) {
      addLetterBox(1, 0);
    }
    if (!index2) {
      addLetterBox(2, 0);
    }
    if (!index3) {
      addLetterBox(3, 0);
    }
    if (!index4) {
      addLetterBox(4, 0);
    }
  }
};

document.addEventListener("keydown", ({ key }) => {
  const numberOfLetters = wordInputWrapperElement.children.length;
  if (key === "Backspace" && numberOfLetters > 0) {
    const lastChild = wordInputWrapperElement.children[numberOfLetters - 1];
    wordInputWrapperElement.removeChild(lastChild);
    word = word.slice(0, word.length - 1);
  }
  if (characters.includes(key)) {
    const newLetter = document.createElement("div");
    newLetter.classList.add("letter-typed");
    newLetter.innerText = key;
    wordInputWrapperElement.appendChild(newLetter);
    word += key;
  }
  if (key === "Enter") {
    const validWord = word in words;
    if (!validWord) {
      return;
    }

    const selectedLetters = document.querySelectorAll(".on");
    const scoreAdd = selectedLetters.length;
    selectedLetters.forEach((element) =>
      element.parentElement.removeChild(element)
    );
    const allInputLetters = document.querySelectorAll(".letter-typed");
    allInputLetters.forEach((element) =>
      element.parentElement.removeChild(element)
    );

    word = "";
    const scoreElement = document.querySelector("#score");
    scoreElement.innerText = Number(scoreElement.innerText) + scoreAdd;
  }
  clearWordElements();
  evaluateWordElements();
});

buildGrid();
setInterval(() => {
  dropLetters();
}, 120);
