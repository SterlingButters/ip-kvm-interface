// Position: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events#Examples
// Cursor Capture
// check pointerLock support
var havePointerLock = 'pointerLockElement' in document ||
                      'mozPointerLockElement' in document ||
                      'webkitPointerLockElement' in document;

// element for pointerLock
var requestedElement = document.getElementById('video');

// prefixes
requestedElement.requestPointerLock = requestedElement.requestPointerLock || requestedElement.mozRequestPointerLock || requestedElement.webkitRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock ||
                           document.webkitExitPointerLock;

let x;
let y;
let a;
let b;

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

var socketTx = io();

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

    a = e.clientX;
    b = e.clientY;

  var pos = {x: x, y: y};
  socketTx.emit('mouseMove', pos);

  position.innerHTML = 'Position X: ' + x +
                       '<br />Position Y: ' + y +
                       '<br />Initial X Window Position : ' + a +
                       '<br />Initial Y Window Position : ' + b;
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

// Click
document.getElementById('video').addEventListener('mousedown', clickHandler, false);
document.getElementById('video').addEventListener('mouseup', clickHandler, false);

function clickHandler(event) {
  document.getElementById("click-button").innerHTML = "You pressed button: " + event.button;
  // TODO: Send click data to socket (Press AND release)
  if (event.type == "mousedown") {
  if (event.button === 0) {socketTx.emit('mouseClick', "leftDown")};
  if (event.button === 1) {socketTx.emit('mouseClick', "middleDown")};
  if (event.button === 2) {socketTx.emit('mouseClick', "rightDown")};
  };

  if (event.type == "mouseup") {
  if (event.button === 0) {socketTx.emit('mouseClick', "leftUp")};
  if (event.button === 1) {socketTx.emit('mouseClick', "middleUp")};
  if (event.button === 2) {socketTx.emit('mouseClick', "rightUp")};
  };
}
