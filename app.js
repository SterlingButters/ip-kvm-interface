// TODO: Figure out why tf I need this and revise for use on RPi3
var spawn = require("child_process").spawn;
var process = spawn('pio', ["device", "monitor", "--port", "/dev/cu.usbmodemHIDPC1"]);
console.log('Starting miniterm');

// Start Butterfly for User
var util = require("util");
var spawn = require("child_process").spawn;
var process = spawn('butterfly.server.py',["--port=57575", "--unsecure"]);

util.log('Starting Butterfly Server on port 57575...');
process.stdout.on('data',function(chunk){
    var textChunk = chunk.toString('utf8');
    util.log(textChunk);
});

// Start WebServer
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socketTx = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

http.listen(3000, function(){
  console.log('Listening on http://127.0.0.1:3000');
});

// Set up Serial connection cu.usbmodemHIDPC1 cu.SLAB_USBtoUART
var serialPort = require('serialport');
var port = new serialPort('/dev/cu.SLAB_USBtoUART', {
  baudRate: 9600,
  autoOpen: false,
  flowControl: true
});

// Report error if Serial connection cannot be made
port.open(function (err) {
  if (err) {
    return console.log("Error opening port: ", err.message);
  }
});
port.on('open', function() {
  console.log("Serial connection made")
});

var io = require('socket.io-client');
io.connect('http://localhost:3000', {reconnect: true});

// Make browser connection
socketTx.on('connection', function(socketRx) {
  // Receive keyboard data from browser and log in node console
  socketRx.on('keyBoard', function(data){
    console.log(data.toString('utf8'));
    // TODO: Enable when on RPi3
    // port.write(data);
    });

  // Receive mouse data from browser and log in node console
  socketRx.on('mouse', function(data){
    console.log(data.x + ", " + data.y);
  });

  // Receive wake on LAN request
  socketRx.on('poweron', function(data){
    console.log("Requesting Power-on");
    if (data === "ON") {
      var spawn = require('child_process').spawn;
      var macAddress = '00:11:22:33:44:55';
      var ipAddress = '10.0.0.0';

      // TODO: Catch Unhandled Error Event
      process.on('uncaughtException', function (err) {
        var child = spawn('etherwake', ['-b', ipAddress, macAddress]);
        console.log('Caught exception: ', err);

        child.stdout.on('data', function(output){console.log("stdout: " + output)});
        child.stderr.on('data', function(output){console.log("stderr: " + data)});
        child.on('close', function(code){console.log("Exited with code: " + code)});
      });
    };
  });
});

var openURL = require('opn');
// opens the url in the default browser
console.log("Opening Server URL")
openURL('http://127.0.0.1:3000');
