// TODO: Figure out why tf I need this
var spawn = require("child_process").spawn;
var process = spawn('pio', ["device", "monitor", "--port", "/dev/cu.usbmodemHIDPC1"])

// Set up Serial connection
var serialPort = require('serialport');
var port = new serialPort('/dev/cu.SLAB_USBtoUART', {
  baudRate: 9600,
  autoOpen: false,
});

// Report error if Serial connection cannot be made
port.open(function (err) {
  if (err) {
    return console.log("Error opening port: ", err.message);
  }
});

port.on('open', function() {
  console.log("Serial connection made")
  setInterval( function() {
  var msg = 'test';
  // console.log(msg.toString('utf8'))
  port.write(msg.toString('utf8'));
  }, 1000);
});
