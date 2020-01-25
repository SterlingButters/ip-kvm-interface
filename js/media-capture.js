// Set Fullscreen
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
const videoSelect = document.querySelector('videoSource');
const audioSelect = document.querySelector('audioSource');
