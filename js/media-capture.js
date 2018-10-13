// Media Capture

video = document.getElementById('video')
button = document.getElementById('fullscreen')
activeStyle = document.getElementById('activestyle')

// TODO: Prevent crazy looking stylesheet reload when pressing escape
// Detect click in body
// document.addEventListener('click', function(e) {
//   if(event.target = document.body) {
//     console.log("Clicked outside");
//   }
// })
var observer = new MutationObserver(function untoggleFullScreen(event) {
  console.log(event);
  if (activeStyle.href != event.oldValue) {
    document.addEventListener('keydown', function(event) {
      if (event.keyCode = 27) {
        activeStyle.href = "/css/interface.css";
      }
    })
  }
})

observer.observe(activeStyle, {
  attributes: true,
  attributeFilter: ['href'],
  attributeOldValue: true,
  childList: false,
  characterData: false
})

button.onclick = function toggleFullScreen() {
  if (activeStyle.href = "/css/interface.css") {
    activeStyle.href = "/css/fullscreen.css";
  }
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
