// Start Butterfly for User
var util = require("util");
var spawn = require("child_process").spawn;
var process = spawn('butterfly.server.py',["--port=57575", "--unsecure"]);

util.log('Starting Butterfly Server on port 57575');
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
  console.log('listening on http://127.0.0.1:3000');
});

var io = require('socket.io-client');
io.connect('http://localhost:3000', {reconnect: true});

// 4) Receive data from browser and log in node console
socketTx.on('connection', function(socketRx) {
  socketRx.on('keyBoard', function(data){
    console.log(data.toString('utf8'));

    // Set up Serial connection
    // var SerialPort = require('serialport');
    // var port = new SerialPort('/dev/cu.SLAB_USBtoUART', {
    //   baudRate: 9600,
    //   autoOpen: false,
    // });
    //
    // // Report error if Serial connection cannot be made
    // port.open(function (err) {
    //   if (err) {
    //     return console.log('Error opening port: ', err.message);
    //   }
    // });
    //
    // port.on('open', function(data) {
    //   port.write(data);
    // });
  });

  socketRx.on('mouse', function(data){
    console.log(data.x + ", " + data.y);
  });
});

// Wake on LAN (Need socket-io)
// var spawn = require('child_process').spawn;
// var macAddress = '00:11:22:33:44:55'
// var ipAddress = '10.0.0.0'
//
// function WOL(event) {
//   var child = spawn('etherwake', ['-b', ipAddress, macAddress],
//       { stdio: [ 'pipe', 'pipe', 2 ] });
//
//   child.stdout.on('data', function(data)
//     {document.getElementById("etherwake-stdout").innerHTML = "Etherwake Magic Packet (stdout): " + data;
//      console.log("stdout: " + data)});
//   child.stderr.on('data', function(data)
//     {document.getElementById("etherwake-stderr").innerHTML = "Etherwake Magic Packet (stderr): " + data;
//      console.log("stderr: " + data)});
//   child.on('close', function(code)
//     {document.getElementById("etherwake-exit").innerHTML = "Child process exited with code: " + code;
//     console.log("Child process exited with code: " + code)});
//   }
