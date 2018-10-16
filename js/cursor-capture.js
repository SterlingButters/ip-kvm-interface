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
var moveTrack = [];

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

var moveCallback = function(event) {
  var position = document.getElementById("position");

    x += event.movementX ||
    event.mozMovementX ||
    event.webkitMovementX ||
    0;

    y -= event.movementY ||
    event.mozMovementY ||
    event.webkitMovementY ||
    0;

  // TODO: Other: Verify Accuracy
  var pos = {x: x, y: y};
  moveTrack.push(pos);
  xChange = moveTrack[moveTrack.length - 1].x - moveTrack[moveTrack.length - 2].x;
  yChange = moveTrack[moveTrack.length - 1].y - moveTrack[moveTrack.length - 2].y;
  var mov = {x: xChange, y: yChange};
  if (moveTrack.length > 2) {moveTrack = moveTrack.slice(-2)};

  socketTx.emit('mouseMove', mov);

  position.innerHTML = 'Position X: ' + x +
                       '<br />Position Y: ' + y
}

var changeCallback = function() {
  if (!havePointerLock) {
    alert('Unable to Lock Pointer');
    return;
  }
  if (isLocked()) {
    document.addEventListener('mousemove', moveCallback, false);
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
  // Send click data to socket (Press AND release)
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
