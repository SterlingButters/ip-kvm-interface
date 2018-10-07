var socketTx = io();

document.getElementById('power').onclick = function(){
  socketTx.emit('poweron', "ON");
  // TODO: Icon visible only once pressed and disappears when video is present
  icon = document.getElementById('loading');
  if (icon.style.visibility === 'hidden') {
    icon.style.visibility = 'visible';
  }
  else {icon.style.visibility = 'hidden'};
};

// document.getElementById('power').onclick = function(){
//   var macAddress = '00:11:22:33:44:55';
//   var ipAddress = '10.0.0.0';
//   var ifrm = document.getElementById('butterfly');
//   ifrm = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
//
//   ifrm.document.open();
//   ifrm.document.write('etherwake -b' + ipAddress + ' ' + macAddress);
//   ifrm.document.close();
// };
