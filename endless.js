const letterGridElement = document.querySelector("#letter-grid");
const wordInputWrapperElement = document.querySelector("#word-input-wrapper");
let wordChains = [];
let word = "";

const rows = 5;
const cols = 5;

// delete me after march 6th
let characters =
  "aaaaaaaaaabbccddddeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnoooooooppqrrrrrrssssssttttttuuuuvvwwxyyz";
// use new letter set after march 6th
if (new Date().getDate() > 6) {
  characters = "aaaabbccddeeeeffgghhiiiijjkkllmmnnoooppqqrrssttuuuuvvwxyyzz";
}

const fibbScore = [
  0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
  4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811,
];

const searchParams = new URLSearchParams(window.location.search);

let seed =
  Number(searchParams.get("seed")) || Math.floor(Math.random() * 100000000);

const logger = getLogger({ mode: "Endless", seed });

function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const randomLetter = () => characters[Math.floor(random() * characters.length)];

const addLetterBubble = (row, col) => {
  const posX = row * 60;
  const posY = col * 60;
  const element = document.createElement("div");
  element.classList.add("letter-item");
  element.onclick = ({ target: { innerText } }) => {
    handleKeyDown({ key: innerText.toLowerCase() });
  };
  element.dataset.row = row;
  element.dataset.col = col;

  element.style.left = posX;
  element.style.top = posY;
  element.innerText = randomLetter();
  letterGridElement.appendChild(element);
};

const buildGrid = () => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      addLetterBubble(row, col);
    }
  }
};

const shuffleGrid = () => {
  const allLetters = [...document.querySelectorAll(".letter-item")];

  let currentIndex = allLetters.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [allLetters[currentIndex], allLetters[randomIndex]] = [
      allLetters[randomIndex],
      allLetters[currentIndex],
    ];
  }

  allLetters.forEach((letter, index) => {
    const row = Math.floor(index / 5);
    const col = Math.floor(index % 5);
    letter.style.left = row * 60;
    letter.style.top = col * 60;

    letter.dataset.row = row;
    letter.dataset.col = col;
  });
};

const unselectLetters = () => {
  const allLetters = document.querySelectorAll(".letter-item");
  allLetters.forEach((elements) => elements.classList.remove("on"));
};

const clearWord = () => {
  [...wordInputWrapperElement.children].forEach((letterElement) => {
    wordInputWrapperElement.removeChild(letterElement);
  });
  word = "";
};

const markAsBadWord = () => {
  const allLetters = document.querySelectorAll(".letter-typed");
  allLetters.forEach((letterElement) => {
    letterElement.classList.remove("added");
    letterElement.classList.add("rejected");
  });
  setTimeout(() => {
    const allLetters = document.querySelectorAll(".letter-typed");
    allLetters.forEach((letterElement) => {
      letterElement.classList.remove("rejected");
    });
  }, 150);
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
    wordChains = [];
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

const addLetterTyped = (key) => {
  const newLetter = document.createElement("div");
  newLetter.classList.add("letter-typed");
  newLetter.classList.add("added");
  newLetter.innerText = key;
  newLetter.onclick = (event) => {
    const wordArray = word.split("");
    const element = event.target;
    const elementIndex = [...element.parentElement.children].findIndex(
      (item) => item === element
    );
    element.parentElement.removeChild(element);
    wordArray.splice(elementIndex, 1);
    word = wordArray.join("");
    unselectLetters();
    evaluateWordElements();
  };
  wordInputWrapperElement.appendChild(newLetter);
  word += key;
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

    const scoreElement = document.querySelector("#score");
    const startingScore = Number(scoreElement.innerText);
    selectedLetters.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("letter-removed");
        scoreElement.innerText = Math.floor(
          startingScore + scoreAdd / (selectedLetters.length - index)
        );
        setTimeout(() => {
          element.parentElement.removeChild(element);
        }, 240 * index);
      }, 120 * index);
    });
    if (scoreAdd > 0) {
      logger(
        `${word.toUpperCase()}: +${fibbScore[word.length]} x ${
          wordChains.length
        }`
      );
    }
    clearWord();
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
