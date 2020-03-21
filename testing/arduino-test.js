const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/ttyUSB0', {baudRate:115200}) // Allow user to specify

//var testBuffer = Buffer.from([0, 0, 4, 0, 0, 0, 0, 0]);
var testBuffer = Buffer.from('test');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

port.on('open', function() {
  console.log("Port Opened");
  var recursiveAsyncReadLine = function () {
  rl.question('Enter data to send to serial: ', function (data) {
    if (data == 'exit') return rl.close();
    port.write(data);
    recursiveAsyncReadLine();
    });
  };

  recursiveAsyncReadLine();
})

// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})
