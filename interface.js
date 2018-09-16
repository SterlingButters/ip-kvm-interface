// Media Capture
const constraints = {
  video: true
};
const video = document.querySelector('video');

navigator.mediaDevices.getUserMedia(constraints).
  then((stream) => {video.srcObject = stream});

const videoElement = document.querySelector('video');
const audioSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');

navigator.mediaDevices.enumerateDevices()
  .then(gotDevices).then(getStream).catch(handleError);

function gotDevices(deviceInfos) {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
        'microphone ' + (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' +
        (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Found another kind of device: ', deviceInfo);
    }
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  const constraints = {
    audio: {
      deviceId: {exact: audioSelect.value}
    },
    video: {
      deviceId: {exact: videoSelect.value}
    }
  };

  navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
}

// Click
function WhichButton(event) {
    document.getElementById("demo").innerHTML = "You pressed button: " + event.button;
}

// Position
// Cursor Capture
// check pointerLock support
var havePointerLock = 'pointerLockElement' in document ||
  'mozPointerLockElement' in document ||
  'webkitPointerLockElement' in document;

// element for pointerLock
var requestedElement = document.getElementById('screen');

// prefixes
requestedElement.requestPointerLock = requestedElement.requestPointerLock || requestedElement.mozRequestPointerLock || requestedElement.webkitRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
  document.mozExitPointerLock ||
  document.webkitExitPointerLock;

var x;
var y;

var isLocked = function() {
  return requestedElement === document.pointerLockElement ||
    requestedElement === document.mozPointerLockElement ||
    requestedElement === document.webkitPointerLockElement;
}

requestedElement.addEventListener('click', function() {
  if (!isLocked()) {
    x = 0;
    y = 0;
    requestedElement.requestPointerLock();
  }
  // else {
  //   document.exitPointerLock();
  // }
}, false);

var moveCallback = function(e) {
  var position = document.getElementById("position");

    x += e.movementX ||
    e.mozMovementX ||
    e.webkitMovementX ||
    0;

    y -= e.movementY ||
    e.mozMovementY ||
    e.webkitMovementY ||
    0;

    var a = e.clientX
    var b = e.clientY

  position.innerHTML = 'Position X: ' + x + '<br />Position Y: ' + y + '<br />Initial X Window Position : ' + a + '<br />Initial Y Window Position : ' + b;
}

var changeCallback = function() {
  if (!havePointerLock) {
    alert('Unable to Lock Pointer');
    return;
  }
  if (isLocked()) {
    document.addEventListener("mousemove", moveCallback, false);
    document.body.classList.add('locked');
  }

  else {
    document.removeEventListener("mousemove", moveCallback, false);
    document.body.classList.remove('locked');
  }
}

document.addEventListener('pointerlockchange', changeCallback, false);
document.addEventListener('mozpointerlockchange', changeCallback, false);
document.addEventListener('webkitpointerlockchange', changeCallback, false);

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
