const buildKeyboard = ({ parent, onKeyPress }) => {
  const keys = [["clear", "shuffle", "enter"]];
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
  parent;
};
