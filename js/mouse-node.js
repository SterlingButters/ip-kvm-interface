// Set up Serial connection
var SerialPort = require('serialport');
var port = new SerialPort('/dev/cu.SLAB_USBtoUART', {
  baudRate: 9600,
  autoOpen: false,
});

// Report error if Serial connection cannot be made
port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
});

port.on('open', function() {
  // port.write(Buffer.from('A'));
  console.log(data.toString('utf8'))
  port.write(data);
});
