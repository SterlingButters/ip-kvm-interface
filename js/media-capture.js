// Media Capture

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
