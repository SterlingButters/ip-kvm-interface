
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

function getKeyCode(layoutKey) {
  let layoutKeyProcessed = layoutKey.replace("{", "").replace("}", "");
  let code = getKeyCodeList(layoutKeyProcessed);

  return code;
}

function getKeyCodeList(key) {
  let obj = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shiftleft: 16,
    shiftright: 16,
    controlleft: 17,
    controlright: 17,
    altleft: 18,
    altright: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    space: 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    metaleft: 91,
    metaright: 92,
    select: 93,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    "'": 192,
    '{': 219,
    '\\': 220,
    '}': 221,
    '"': 222
  };
  return obj[key];
}

function onChange(input) {
  document.querySelector(".input").value = input;
  keyboard.setInput(input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);
  buttonOnScreen = button.replace('{','').replace('}','');
  // Use line below for keyCode
  // var buttonOnScreen = String(getKeyCode(button));
  socketTx.emit('keyBoard', buttonOnScreen);

  // If you want to handle the shift and caps lock buttons
  if (
    button === "{shift}" ||
    button === "{shiftleft}" ||
    button === "{shiftright}" ||
    button === "{capslock}"
  ) {
    toggleShiftMode();
  }
}

/**
 * Physical Keyboard support
 * Whenever the input is changed with the keyboard, updating SimpleKeyboard's internal input
 */
document.addEventListener("keydown", event => {
  // TODO: Arduino: Keypress down string here
  // buttonPhysical = keyboard.physicalKeyboardInterface.getSimpleKeyboardLayoutKey(event);
  // Use line below for keyCode
  buttonPhysical = String(""+event.keyCode);

  // Disabling keyboard input, as some keys (like F5) make the browser lose focus.
  // If you're like to re-enable it, comment the next line and uncomment the following ones
  // event.preventDefault();
  if (event.key === "Alt") event.preventDefault();
  if (event.key === "F5") event.preventDefault();

  if (event.key === "ArrowUp") event.preventDefault();
  if (event.key === "ArrowDown") event.preventDefault();
  if (event.key === "ArrowLeft") event.preventDefault();
  if (event.key === "ArrowRight") event.preventDefault();
  if (event.key === " ") event.preventDefault();

  if (event.key === "Shift") enableShiftMode(event);
  if (event.key === "CapsLock") enableShiftMode(event);

  socketTx.emit('keyBoard', buttonPhysical);
});

document.addEventListener("keyup", event => {
  // TODO: Arduino: Keyboard up string here
  buttonPhysical = String(""+event.keyCode);

  let input = document.querySelector(".input").value;
  keyboard.setInput(input);

  if (event.key === "Shift") disableShiftMode(event);
  if (event.key === "CapsLock") disableShiftMode(event);
});

function toggleShiftMode(event) {
  let currentLayout = keyboard.options.layoutName;

  // If currentLayout is default, set to shift, and vice versa
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });

  if (event) {
    highlightButton(event);
  }
}

function enableShiftMode(event) {
  keyboard.setOptions({
    layoutName: "shift"
  });
  highlightButton(event);
}

function disableShiftMode(event) {
  keyboard.setOptions({
    layoutName: "default"
  });
  unhighlightButton(event);
}

function highlightButton(event) {
  let layoutKeyName = keyboard.physicalKeyboardInterface.getSimpleKeyboardLayoutKey(event);

  let buttonElement =
    keyboard.getButtonElement(layoutKeyName) ||
    keyboard.getButtonElement(`{${layoutKeyName}}`);

  // Highlighting that key manually...
  buttonElement.style.background = "#9ab4d0";
  buttonElement.style.color = "white";
  console.log(buttonElement);
}

function unhighlightButton(event) {
  let layoutKeyName = keyboard.physicalKeyboardInterface.getSimpleKeyboardLayoutKey(event);

  let buttonElement =
    keyboard.getButtonElement(layoutKeyName) ||
    keyboard.getButtonElement(`{${layoutKeyName}}`);

  // Unhighlighting that key manually...
  buttonElement.removeAttribute("style");
  console.log(buttonElement);
}
