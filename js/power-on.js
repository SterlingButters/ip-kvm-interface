var socketTx = io();

document.getElementById('power').onclick = function(){
  socketTx.emit('poweron', "ON");

  icon = document.getElementById('loading');

  // TODO: Make icon disappear on video prompt
  // if (document.getElementById("videoSource").options.length > 0) {
    icon.style.visibility = 'visible';
  // };
  // else {icon.style.visibility = 'hidden';}
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
