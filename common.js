function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const randomLetter = () => characters[Math.floor(random() * characters.length)];

const buildGrid = () => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      addLetterBubble(row, col);
    }
  }
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

  // figure out the size of the box so that we don't end
  // up with islands of letters
  const boxSize = Math.ceil(Math.sqrt(allLetters.length));
  allLetters.forEach((letter, index) => {
    const row = Math.floor(index / boxSize);
    const col = Math.floor(index % boxSize);
    letter.style.left = row * 60;
    letter.style.top = col * 60;

    letter.dataset.row = row;
    letter.dataset.col = col;
  });
};

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

// highlight letters that are being typed
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
