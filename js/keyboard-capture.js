// OnScreen Keyboard
// https://github.com/hodgef/simple-keyboard
let Keyboard = window.SimpleKeyboard.default;

let commonKeyboardOptions = {
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  theme: "simple-keyboard hg-theme-default hg-layout-default",
  physicalKeyboardHighlight: true,
  syncInstanceInputs: true,
  mergeDisplay: true,
  debug: true
};

let keyboard = new Keyboard(".simple-keyboard-main", {
  ...commonKeyboardOptions,
  /**
   * Layout by:
   * Sterling Butters (https://github.com/SterlingButters)
   */
  layout: {
    default: [
      "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{capslock} a s d f g h j k l ; ' {enter}",
      "{shiftleft} z x c v b n m , . / {shiftright}",
      "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
    ],
    shift: [
      "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
      "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
      "{tab} Q W E R T Y U I O P { } |",
      '{capslock} A S D F G H J K L : " {enter}',
      "{shiftleft} Z X C V B N M < > ? {shiftright}",
      "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
    ]
  },
  display: {
    "{escape}": "esc ⎋",
    "{tab}": "tab ⇥",
    "{backspace}": "backspace ⌫",
    "{enter}": "enter ↵",
    "{capslock}": "caps lock ⇪",
    "{shiftleft}": "shift ⇧",
    "{shiftright}": "shift ⇧",
    "{controlleft}": "ctrl ⌃",
    "{controlright}": "ctrl ⌃",
    "{altleft}": "alt ⌥",
    "{altright}": "alt ⌥",
    "{metaleft}": "cmd ⌘",
    "{metaright}": "cmd ⌘"
  }
});

var socketTx = io();

let keyboardControlPad = new Keyboard(".simple-keyboard-control", {
  ...commonKeyboardOptions,
  layout: {
    default: [
      "{prtscr} {scrolllock} {pause}",
      "{insert} {home} {pageup}",
      "{delete} {end} {pagedown}"
    ]
  }
});

let keyboardArrows = new Keyboard(".simple-keyboard-arrows", {
  ...commonKeyboardOptions,
  layout: {
    default: ["{arrowup}", "{arrowleft} {arrowdown} {arrowright}"]
  }
});

/**
 * Physical Keyboard support
 * Whenever the input is changed with the keyboard, updating SimpleKeyboard's internal input
 */
document.addEventListener("keydown", event => {
  buttonPhysical = event.key
  // Disabling keyboard input, as some keys (like F5) make the browser lose focus.
  // If you're like to re-enable it, comment the next line and uncomment the following ones
  // event.preventDefault();
  if (event.key === "Alt") event.preventDefault();
  if (event.key === "F5") event.preventDefault();
  if (event.key === "Shift") handleShift();
  if (event.key === "CapsLock") handleShift();

  socketTx.emit('keyBoard', buttonPhysical);
});

document.addEventListener("keyup", event => {
  let input = document.querySelector(".input").value;
  keyboard.setInput(input);
  if (event.key === "Shift") handleShift();
});

function onChange(input) {
  document.querySelector(".input").value = input;
  keyboard.setInput(input);

  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);
  socketTx.emit('keyBoard', button);

  // If you want to handle the shift and caps lock buttons
  if (
    button === "{shift}" ||
    button === "{shiftleft}" ||
    button === "{shiftright}" ||
    button === "{capslock}"
  ) {
    handleShift();
  }
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}
