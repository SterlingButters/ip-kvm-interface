// OnScreen Keyboard
// https://github.com/hodgef/simple-keyboard

let Keyboard = window.SimpleKeyboard.default;

let myKeyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button)
});

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);
}

// Normal Keyboard
document.addEventListener('keydown', function(event){

  // Gives Key Code: event.keyCode;
  // Gives Actual Key: event.key
  document.querySelector(".input").value += event.key;
  console.log("Input changed", input);
} );
