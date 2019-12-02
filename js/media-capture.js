// Setting Fullscreen
info = document.getElementById('information');
monitor = document.getElementById('monitor');
keyBoard = document.getElementById('keyboard');
button = document.getElementById('fullscreen');
video = document.getElementById('video');
butterfly = document.getElementById('butterfly');

button.onclick = function toggleFullScreen() {
  document.body.className = 'dark-background';
  video.className = 'full-video';
  info.className += ' hide';
  monitor.className += ' hide';
  keyBoard.className += ' hide';
  butterfly.className += ' hide';
}

var observer = new MutationObserver(function (event) {
  if (document.body.className == "dark-background") {
    document.addEventListener('keydown', function(event) {
      if (event.keyCode = 27) {
        document.body.className = 'light-background';
        video.className = 'regular-video';
        info.className -= ' hide';
        monitor.className -= ' hide';
        keyBoard.className -= ' hide';
        butterfly.className -= ' hide';
      }
    })
  }
})

observer.observe(video, {
  attributes: true,
  attributeFilter: ['class'],
  childList: false,
  characterData: false
})

// Capturing Media
const videoElement = document.querySelector('video');
const audioSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');

var socketTx = io();

powerButton = document.getElementById('power');
icon = document.getElementById('loading');

navigator.mediaDevices.enumerateDevices()
  .then(gotDevices).then(getStream).catch(handleError);

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

function gotDevices(deviceInfos) {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;

    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || 'microphone ' +
        (audioSelect.length);
      audioSelect.appendChild(option);
    }

    else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' +
        (videoSelect.length);
      videoSelect.appendChild(option);
    }

    else {
      console.log('Found another kind of device: ', deviceInfo);
    }
  }
}

function getStream() {
  // Power-on loading icon; TODO: accept power-on from multiple servers (currently overconstrained) and auto change input
  if (videoSelect.value == 'no-input') {
    powerButton.onclick = function() {
      if (icon.style.visibility != 'hidden') {
        socketTx.emit('powerChannel', "ON");
        icon.style.visibility = 'visible';
      }
    }
  }
  else {icon.style.visibility = 'hidden';}

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
      deviceId: {exact: videoSelect.value},
      width: {min: 1280},
      height: {min: 720}
    }
  };

  navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream;
  videoElement.srcObject = stream;
}

function handleError(error) {
  console.error('Error: ', error);
}
