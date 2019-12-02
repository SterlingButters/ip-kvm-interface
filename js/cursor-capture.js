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

var isLocked = function() {
  return requestedElement === document.pointerLockElement ||
         requestedElement === document.mozPointerLockElement ||
         requestedElement === document.webkitPointerLockElement;
}

var x;
var y;
var click;
var moveTrack = [];

requestedElement.addEventListener('click', function() {
  if (!isLocked()) {
    x = 0;
    y = 0;
    click = 0;
    requestedElement.requestPointerLock();
  }
  // else {
  //   document.exitPointerLock();
  // }
}, false);

var socketTx = io();

var cursorHandler = function(event) {
  console.log(event.type);

  //Movement Handling
  //document.getElementById("position").innerHTML = 'Position X: ' + x +
                       '<br />Position Y: ' + y

  var xChange = 0;
  var yChange = 0;
  if (event.type == "mousemove") {
    x += event.movementX ||
    event.mozMovementX ||
    event.webkitMovementX ||
    0;

    y -= event.movementY ||
    event.mozMovementY ||
    event.webkitMovementY ||
    0;

    var pos = {x: x, y: y};
    moveTrack.push(pos);
    xChange = moveTrack[moveTrack.length - 1].x - moveTrack[moveTrack.length - 2].x;
    yChange = moveTrack[moveTrack.length - 1].y - moveTrack[moveTrack.length - 2].y;
    if (moveTrack.length > 2) {moveTrack = moveTrack.slice(-2)};
  }

  //Click Handling
  // document.getElementById("click-button").innerHTML = "You pressed button: " + event.button;

  if (event.type == "mousedown") {
    if (event.button === 0) {click += 1}; //left-click
    if (event.button === 1) {click += 3}; //middle-click
    if (event.button === 2) {click += 2}; //right-click
  };

  if (event.type == "mouseup") {
    if (event.button === 0) {click -= 1}; //left-click
    if (event.button === 1) {click -= 3}; //middle-click
    if (event.button === 2) {click -= 2}; //right-click
  };

    socketTx.emit('mouseChannel', [click, xChange, -yChange]); //edits here
}

var changeCallback = function() {
  if (!havePointerLock) {
    alert('Unable to Lock Pointer');
    return;
  }
  if (isLocked()) {
    document.addEventListener('mousemove', cursorHandler);
    document.getElementById('video').addEventListener('mousedown', cursorHandler);
    document.getElementById('video').addEventListener('mouseup', cursorHandler);

    document.body.classList.add('locked');
  }

  else {
    document.removeEventListener("mousemove", cursorHandler, false);
    document.getElementById('video').removeEventListener('mousedown', cursorHandler);
    document.getElementById('video').removeEventListener('mouseup', cursorHandler);

    document.body.classList.remove('locked');
  }
}

document.addEventListener('pointerlockchange', changeCallback, false);
document.addEventListener('mozpointerlockchange', changeCallback, false);
document.addEventListener('webkitpointerlockchange', changeCallback, false);
