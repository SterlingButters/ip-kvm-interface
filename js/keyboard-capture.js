// OnScreen Keyboard
// https://github.com/hodgef/simple-keyboard

let Keyboard = window.SimpleKeyboard.default;

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  layout: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{capslock} a s d f g h j k l ; ' {enter}",
      "{shift} z x c v b n m , . / {shift}",
      ".com @ {space}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{capslock} A S D F G H J K L : " {capslock}',
      "{shift} Z X C V B N M < > ? {shift}",
      ".com @ {space}"
    ]
  },
  display: {
    "{bksp}": "backspace",
    "{enter}": "< enter",
    "{shift}": "shift",
    "{s}": "shift",
    "{tab}": "tab",
    "{capslock}": "caps",
    "{accept}": "Submit",
    "{space}": " ",
    "{//}": " "
  }
});

console.log(keyboard);

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);
  // If you want to handle the shift and caps lock buttons
  if (button === "{shift}" || button === "{capslock}") handleShift();
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}

// Normal Keyboard
var socketTx = io();

document.addEventListener("keydown", function(event) {
  let buttonPressed = event.key.toLowerCase();
  let currentInput = document.querySelector(".input");

  socketTx.emit('Browser', event.key.toLowerCase());

  // Adding selected class
  keyboard.setOptions({
    buttonTheme: [
      {
        class: "selectedButton",
        buttons: buttonPressed
      }
    ]
  });

  // Updating keyboard internal input
  keyboard.setInput(currentInput.value += buttonPressed);
});

// Removing button style on keyup
document.addEventListener("keyup", function(event) {
  let currentInput = document.querySelector(".input");

  keyboard.setOptions({
    buttonTheme: []
  });
  keyboard.setInput(currentInput.value);
});
