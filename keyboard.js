const buildKeyboard = ({ parent, onKeyPress }) => {
  const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "del"],
  ];
  for (keyArray of keys) {
    const keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-row");
    for (key of keyArray) {
      const keyboardRowKey = document.createElement("div");
      keyboardRowKey.classList.add("keyboard-row-key");
      keyboardRowKey.innerText = key;
      keyboardRowKey.onclick = (event) => {
        event.preventDefault();
        onKeyPress({ key: event.target.innerText.toLowerCase() });
      };
      keyboardRow.appendChild(keyboardRowKey);
    }
    parent.appendChild(keyboardRow);
  }
};
