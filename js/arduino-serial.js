var SerialPort = require('serialport');
var port = new SerialPort('/dev/cu.SLAB_USBtoUART', {
  baudRate: 9600,
  autoOpen: false
});

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
});

// The open event is always emitted
port.on('open', function() {
  // port.write('H')
  port.write(Buffer.from('A'));
});
