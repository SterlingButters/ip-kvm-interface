let Keyboard = window.SimpleKeyboard.default;

let commonKeyboardOptions = {
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  onKeyReleased: button => onKeyReleased(button),
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

// Handle Reset
resetButton = document.getElementById('keyboardReset');
resetButton.onclick = function(){
	console.log("Resetting Keyboard");
	socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	alert('Keyboard Reset');
};

function sendCombos(id) {
	if (id == "Alt+Shift") {
		socketTx.emit('keyboardChannel', [96, 0, 0, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Crtl+Shift" ) {
		socketTx.emit('keyboardChannel', [48, 0, 0, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Shift+Shift" ) {
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Meta+Space") {
		socketTx.emit('keyboardChannel', [128, 0, 44, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Ctrl+W") {
		socketTx.emit('keyboardChannel', [16, 0, 26, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Alt+Tab") {
		socketTx.emit('keyboardChannel', [64, 0, 43, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Alt+Enter") {
		socketTx.emit('keyboardChannel', [64, 0, 40, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Alt+F4") {
		socketTx.emit('keyboardChannel', [64, 0, 61, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
	if (id == "Ctrl+Alt+Del") {
		socketTx.emit('keyboardChannel', [80, 0, 40, 0, 0, 0, 0, 0]);
		socketTx.emit('keyboardChannel', [0, 0, 0, 0, 0, 0, 0, 0]);
	};
}

var keyTracker = [];
var modifierTracker = [];

// Function to obtain js keyCode from virtual keyboard button press
function getKeyCode(layoutKey) {
  let layoutKeyProcessed = layoutKey.replace("{", "").replace("}", "");

  let codeList = {
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
    metaright: 93,
    // select: 93,
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

  let code = codeList[layoutKeyProcessed];
  return code;
}

// Function to change array of js keycodes to decimal input reports
function jsToDecimal(keyCode) {

  let decimalList = {
    '8': 42, // backspace
    '9': 43, // tab
    '13': 40, // enter
    '16': 2, // shiftleft
    '16': 32, // shiftright
    '17': 1, // controlleft
    '17': 16, // controlright
    '18': 4, // altleft
    '18': 64, // altright
    '91': 8, // metaleft
    '92': 128, // metaright
    '19': 72, // pause
    '20': 57, // capslock
    '27': 41, // escape
    '32': 44, // space
    '33': 75, // pageup
    '34': 78, // pagedown
    '35': 77, // end
    '36': 74, // home
    '37': 80, // arrowleft
    '38': 82, // arrowup
    '39': 79, // arrowright
    '40': 81, // arrowdown
    '45': 73, // insert
    '46': 76, // delete
    '48': 39, // 0
    '49': 30, // 1
    '50': 31, // 2
    '51': 32, // 3
    '52': 33, // 4
    '53': 34, // 5
    '54': 35, // 6
    '55': 36, // 7
    '56': 37, // 8
    '57': 38, // 9
    '65': 4, // a
    '66': 5, // b
    '67': 6, // c
    '68': 7, // d
    '69': 8, // e
    '70': 9, // f
    '71': 10, // g
    '72': 11, // h
    '73': 12, // i
    '74': 13, // j
    '75': 14, // k
    '76': 15, // l
    '77': 16, // m
    '78': 17, // n
    '79': 18, // o
    '80': 19, // p
    '81': 20, // q
    '82': 21, // r
    '83': 22, // s
    '84': 23, // t
    '85': 24, // u
    '86': 25, // v
    '87': 26, // w
    '88': 27, // x
    '89': 28, // y
    '90': 29, // z
    '93': 119, // select
    '112': 58, // f1
    '113': 59, // f2
    '114': 60, // f3
    '115': 61, // f4
    '116': 62, // f5
    '117': 63, // f6
    '118': 64, // f7
    '119': 65, // f8
    '120': 66, // f9
    '121': 67, // f10
    '122': 68, // f11
    '123': 69, // f12
    '144': 83, //numlock
    '145': 71, //scrolllock
    '186': 51, // ;
    '187': 46, // =
    '188': 54, // ,
    '189': 45, // -
    '190': 55, // .
    '191': 56, // /
    '192': 53, // `
    '219': 47, // [
    '220': 49, // \
    '221': 48, // ]
    '222': 52, // '
  };

  let decimal = decimalList[keyCode];
  return decimal;
}

function onChange(input) {
  document.querySelector(".input").value = input;
  keyboard.setInput(input);
}

/**
 * Virtual Keyboard support
 * Using SimpleKeyboard
 */

function onKeyPress(button) {
  console.log("Button pressed", button);
  button = button.replace('{','').replace('}','');

  // Insert key into tracker - ignore duplicates, ignore modifiers
  if (!(button === "shiftleft" || button === "shiftright" || button === "metaleft" || button ==="metaright" || button === "controlleft" || button === "controlright" || button === "altleft" || button === "altright")) {
    if (! keyTracker.includes(jsToDecimal(getKeyCode(button)))) {
        keyTracker.push(jsToDecimal(getKeyCode(button)));
    }
  }

  // Insert modifier into tracker - ignore duplicates, ignore keys
  if (button === "shiftleft" || button === "shiftright" || button === "metaleft" || button ==="metaright" || button === "controlleft" || button === "controlright" || button === "altleft" || button === "altright") {
    if (! modifierTracker.includes(jsToDecimal(getKeyCode(button)))) {
        modifierTracker.push(jsToDecimal(getKeyCode(button)));
    }
  }

  var recentKeys = keyTracker.reverse();
  var inputReport = new Array(8).fill(0);
  inputReport[0] = modifierTracker.reduce((a,b) => a + b, 0);
  // inputReport[1] = <always 0>
  inputReport[2] = recentKeys[0] || 0;
  inputReport[3] = recentKeys[1] || 0;
  inputReport[4] = recentKeys[2] || 0;
  inputReport[5] = recentKeys[3] || 0;
  inputReport[6] = recentKeys[4] || 0;
  inputReport[7] = recentKeys[5] || 0;

  socketTx.emit('keyboardChannel', inputReport);

  // If you want to handle the shift and caps lock buttons
  if (
    button === "shift" ||
    button === "shiftleft" ||
    button === "shiftright" ||
    button === "capslock"
  ) {
    	toggleShiftMode();
  }
}


function onKeyReleased(button) {
  console.log("Button released", button);
  button = button.replace('{','').replace('}','');

  var keyTrackerUp = [];
  var modifierTrackerUp = [];

  if (keyTracker.includes(jsToDecimal(getKeyCode(button)))) {
      keyTrackerUp = keyTracker.filter(function(key){
       return key !== jsToDecimal(getKeyCode(button));
   });
  }

  if (modifierTracker.includes(jsToDecimal(getKeyCode(button)))) {
      modifierTrackerUp = modifierTracker.filter(function(key){
       return key !== jsToDecimal(getKeyCode(button));
   });
  }

  keyTracker = keyTrackerUp;
  modifierTracker = modifierTrackerUp;

  var recentKeys = keyTrackerUp.reverse();
  var inputReport = new Array(8).fill(0);
  inputReport[0] = modifierTrackerUp.reduce((a,b) => a + b, 0);
  // inputReport[1] = <always 0>
  inputReport[2] = recentKeys[0] || 0;
  inputReport[3] = recentKeys[1] || 0;
  inputReport[4] = recentKeys[2] || 0;
  inputReport[5] = recentKeys[3] || 0;
  inputReport[6] = recentKeys[4] || 0;
  inputReport[7] = recentKeys[5] || 0;

  socketTx.emit('keyboardChannel', inputReport);

  if (
    button === "shift" ||
    button === "shiftleft" ||
    button === "shiftright"
  ) {
    toggleShiftMode();
  }
}

/**
 * Physical Keyboard support
 * Using document listeners
 */

document.addEventListener("keydown", event => {
  console.log(event.key);
  // Insert key into tracker - ignore duplicates, ignore modifiers
  if (!(event.key === "Shift" || event.key === "Meta" || event.key === "Control" || event.key === "Alt")) {
	if (! keyTracker.includes(jsToDecimal(event.keyCode))) {
        keyTracker.push(jsToDecimal(event.keyCode));
    }
  }

  // Insert modifier into tracker - ignore duplicates, ignore keys
  if (event.key === "Shift" || event.key === "Meta" || event.key === "Control" || event.key === "Alt") {
    if (! modifierTracker.includes(jsToDecimal(event.keyCode))) {
        modifierTracker.push(jsToDecimal(event.keyCode));
    }
  }

  var recentKeys = keyTracker.reverse();
  var inputReport = new Array(8).fill(0);
  inputReport[0] = modifierTracker.reduce((a,b) => a + b, 0);
  // inputReport[1] = <always 0>
  inputReport[2] = recentKeys[0] || 0;
  inputReport[3] = recentKeys[1] || 0;
  inputReport[4] = recentKeys[2] || 0;
  inputReport[5] = recentKeys[3] || 0;
  inputReport[6] = recentKeys[4] || 0;
  inputReport[7] = recentKeys[5] || 0;

  // socketTx.emit('keyboardChannel', inputReport);
  // Arduino Test
  socketTx.emit('keyboardChannel', event.keyCode);

  // Disabling keyboard input, as some keys (like F5) make the browser lose focus.
  if (event.key === "Alt") event.preventDefault();
  if (event.key === "F5") event.preventDefault();

  if (event.key === "ArrowUp") event.preventDefault();
  if (event.key === "ArrowDown") event.preventDefault();
  if (event.key === "ArrowLeft") event.preventDefault();
  if (event.key === "ArrowRight") event.preventDefault();
  if (event.key === " ") event.preventDefault();

  if (event.key === "Shift") enableShiftMode(event);
  if (event.key === "CapsLock") {
    toggleShiftMode(event);
    highlightButton(event);
  }
});

var capsTracker = 0;
var isEven = function(x) { return !( x & 1) };

document.addEventListener("keyup", event => {

  var keyTrackerUp = [];
  var modifierTrackerUp = [];

  if (keyTracker.includes(jsToDecimal(event.keyCode))) {
      keyTrackerUp = keyTracker.filter(function(key){
       return key !== jsToDecimal(event.keyCode);
   });
  }

  if (modifierTracker.includes(jsToDecimal(event.keyCode))) {
      modifierTrackerUp = modifierTracker.filter(function(key){
       return key !== jsToDecimal(event.keyCode);
   });
  }

  keyTracker = keyTrackerUp;
  modifierTracker = modifierTrackerUp;

  var recentKeys = keyTrackerUp.reverse();
  var inputReport = new Array(8).fill(0);
  inputReport[0] = modifierTrackerUp.reduce((a,b) => a + b, 0);
  // inputReport[1] = <always 0>
  inputReport[2] = recentKeys[0] || 0;
  inputReport[3] = recentKeys[1] || 0;
  inputReport[4] = recentKeys[2] || 0;
  inputReport[5] = recentKeys[3] || 0;
  inputReport[6] = recentKeys[4] || 0;
  inputReport[7] = recentKeys[5] || 0;

  // socketTx.emit('keyboardChannel', inputReport);

  // Revise this
  let input = document.querySelector(".input").value;
  keyboard.setInput(input);

  if (event.key === "Shift") disableShiftMode(event);
  if (event.key === "CapsLock") {
    if (isEven(capsTracker)) {
      highlightButton(event);
    } else {unhighlightButton(event)}
    capsTracker += 1;
  }
});

function toggleShiftMode(event) {
  let currentLayout = keyboard.options.layoutName;

  // If currentLayout is default, set to shift, and vice versa
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
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
  let layoutKeyName = keyboard.physicalKeyboard.getSimpleKeyboardLayoutKey(event);

  let buttonElement =
    keyboard.getButtonElement(layoutKeyName) ||
    keyboard.getButtonElement(`{${layoutKeyName}}`);

  // Highlighting that key manually...
  buttonElement.style.background = "#9ab4d0";
  buttonElement.style.color = "white";
  console.log(buttonElement);
}

function unhighlightButton(event) {
  let layoutKeyName = keyboard.physicalKeyboard.getSimpleKeyboardLayoutKey(event);

  let buttonElement =
    keyboard.getButtonElement(layoutKeyName) ||
    keyboard.getButtonElement(`{${layoutKeyName}}`);

  // Unhighlighting that key manually...
  buttonElement.removeAttribute("style");
  console.log(buttonElement);
}
