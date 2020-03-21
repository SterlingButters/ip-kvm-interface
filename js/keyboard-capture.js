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

// Function to change array of js keycodes to ascii value
function jsToASCII(keyCode) {

  let asciiList = {
    '8': 'KEY_BACKSPACE', // backspace
    '9': 'KEY_TAB', // tab
    '13': 'KEY_RETURN', // enter
    '16': 'KEY_LEFT_SHIFT', // shiftleft
    '16': 'KEY_RIGHT_SHIFT', // shiftright
    '17': 'KEY_LEFT_CTRL', // controlleft
    '17': 'KEY_RIGHT_CTRL', // controlright
    '18': 'KEY_LEFT_ALT', // altleft
    '18': 'KEY_RIGHT_ALT', // altright
    '91': 'KEY_LEFT_GUI', // metaleft
    '92': 'KEY_RIGHT_GUI', // metaright
    '19': 0, // pause - ascii null
    '20': 'KEY_CAPS_LOCK', // capslock
    '27': 'KEY_ESC', // escape
    '32': ' ', // space
    '33': 'KEY_PAGE_UP', // pageup
    '34': 'KEY_PAGE_DOWN', // pagedown
    '35': 'KEY_END', // end
    '36': 'KEY_HOME', // home
    '37': 'KEY_LEFT_ARROW', // arrowleft
    '38': 'KEY_UP_ARROW', // arrowup
    '39': 'KEY_RIGHT_ARROW', // arrowright
    '40': 'KEY_DOWN_ARROW', // arrowdown
    '45': 'KEY_INSERT', // insert
    '46': 'KEY_DELETE', // delete
    '48': '0', // 0
    '49': '1', // 1
    '50': '2', // 2
    '51': '3', // 3
    '52': '4', // 4
    '53': '5', // 5
    '54': '6', // 6
    '55': '7', // 7
    '56': '8', // 8
    '57': '9', // 9
    '65': 'a', // a
    '66': 'b', // b
    '67': 'c', // c
    '68': 'd', // d
    '69': 'e', // e
    '70': 'f', // f
    '71': 'g', // g
    '72': 'h', // h
    '73': 'i', // i
    '74': 'j', // j
    '75': 'k', // k
    '76': 'l', // l
    '77': 'm', // m
    '78': 'n', // n
    '79': 'o', // o
    '80': 'p', // p
    '81': 'q', // q
    '82': 'r', // r
    '83': 's', // s
    '84': 't', // t
    '85': 'u', // u
    '86': 'v', // v
    '87': 'w', // w
    '88': 'x', // x
    '89': 'y', // y
    '90': 'z', // z
    '93': 0, // select
    '112': 'KEY_F1', // f1
    '113': 'KEY_F2', // f2
    '114': 'KEY_F3', // f3
    '115': 'KEY_F4', // f4
    '116': 'KEY_F5', // f5
    '117': 'KEY_F6', // f6
    '118': 'KEY_F7', // f7
    '119': 'KEY_F8', // f8
    '120': 'KEY_F9', // f9
    '121': 'KEY_F10', // f10
    '122': 'KEY_F11', // f11
    '123': 'KEY_F12', // f12
    '144': 0, //numlock
    '145': 0, //scrolllock
    '186': ';', // ;
    '187': '=', // =
    '188': ',', // ,
    '189': '-', // -
    '190': '.', // .
    '191': '/', // /
    '192': '`', // `
    '219': '[', // [
    '220': '\\', // \
    '221': ']', // ]
    '222': '\'', // '
  };

  // let asciiList = {
  //   '8': 8, // backspace
  //   '9': 9, // tab
  //   '13': 176, // enter
  //   '16': 129, // shiftleft
  //   '16': 133, // shiftright
  //   '17': 128, // controlleft
  //   '17': 132, // controlright
  //   '18': 130, // altleft
  //   '18': 134, // altright
  //   '91': 131, // metaleft
  //   '92': 135, // metaright
  //   '19': 0, // pause - ascii null
  //   '20': 193, // capslock
  //   '27': 177, // escape
  //   '32': 32, // space
  //   '33': 211, // pageup
  //   '34': 214, // pagedown
  //   '35': 213, // end
  //   '36': 210, // home
  //   '37': 216, // arrowleft
  //   '38': 218, // arrowup
  //   '39': 215, // arrowright
  //   '40': 217, // arrowdown
  //   '45': 209, // insert
  //   '46': 212, // delete
  //   '48': 48, // 0
  //   '49': 49, // 1
  //   '50': 50, // 2
  //   '51': 51, // 3
  //   '52': 52, // 4
  //   '53': 53, // 5
  //   '54': 54, // 6
  //   '55': 55, // 7
  //   '56': 56, // 8
  //   '57': 57, // 9
  //   '65': 97, // a
  //   '66': 98, // b
  //   '67': 99, // c
  //   '68': 100, // d
  //   '69': 101, // e
  //   '70': 102, // f
  //   '71': 103, // g
  //   '72': 104, // h
  //   '73': 105, // i
  //   '74': 106, // j
  //   '75': 107, // k
  //   '76': 108, // l
  //   '77': 109, // m
  //   '78': 110, // n
  //   '79': 111, // o
  //   '80': 112, // p
  //   '81': 113, // q
  //   '82': 114, // r
  //   '83': 115, // s
  //   '84': 116, // t
  //   '85': 117, // u
  //   '86': 118, // v
  //   '87': 119, // w
  //   '88': 120, // x
  //   '89': 121, // y
  //   '90': 122, // z
  //   '93': 123, // select
  //   '112': 194, // f1
  //   '113': 195, // f2
  //   '114': 196, // f3
  //   '115': 197, // f4
  //   '116': 198, // f5
  //   '117': 199, // f6
  //   '118': 200, // f7
  //   '119': 201, // f8
  //   '120': 202, // f9
  //   '121': 203, // f10
  //   '122': 204, // f11
  //   '123': 205, // f12
  //   '144': 0, //numlock
  //   '145': 0, //scrolllock
  //   '186': 59, // ;
  //   '187': 61, // =
  //   '188': 44, // ,
  //   '189': 45, // -
  //   '190': 46, // .
  //   '191': 47, // /
  //   '192': 96, // `
  //   '219': 91, // [
  //   '220': 92, // \
  //   '221': 93, // ]
  //   '222': 39, // '
  // };

  let ascii = asciiList[keyCode];
  return ascii;
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
  socketTx.emit('keyboardChannel', jsToASCII(event.keyCode));

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
