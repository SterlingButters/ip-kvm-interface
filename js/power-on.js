var socketTx = io();

powerButton = document.getElementById('power');
videoSources = document.getElementById('videoSource');
icon = document.getElementById('loading');

// TODO: Use Mutation observer to check for option.length change?
if (videoSources.options.length == 0) {
  powerButton.onclick = function() {
    socketTx.emit('poweron', "ON");
    icon.style.visibility = 'visible';
  }
}
else {icon.style.visibility = 'hidden';}
