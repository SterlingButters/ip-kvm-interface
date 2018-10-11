// Media Capture
document.getElementById('fullscreen').onclick = function toggleFullScreen() {
  if (document.getElementById('activestyle').href = "/css/interface.css") {
    document.getElementById('activestyle').setAttribute("href", "/css/fullscreen.css");
  }
};

// TODO: Figure out why untoggle doesnt work
function untoggleFullScreen() {
  activeStyle = document.getElementById('activestyle').href
  if (activeStyle = "/css/fullscreen.css") {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode = 27) {
        activeStyle = "/css/interface.css";
      };
    });
  };
};

const videoElement = document.querySelector('video');
const audioSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');

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
