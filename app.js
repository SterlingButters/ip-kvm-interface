// Start Butterfly for User
var spawn = require("child_process").spawn;
var process = spawn('butterfly.server.py',["--port=57575", "--unsecure"]);

console.log('Starting Butterfly Server on port 57575...');
process.stdout.on('data', function(chunk){
    var textChunk = chunk.toString('utf8');
    console.log(textChunk);
});

// Start WebServer
const express = require('express');
var SocketIOFileUpload = require('socketio-file-upload');
var app = express().use(express.static(__dirname + '/')).use(SocketIOFileUpload.router);

const http = require('http').Server(app);
const socket = require('socket.io')(http);

http.listen(3000, function(){
  console.log('Listening on http://127.0.0.1:3000');
});

// ------------------ upload start ------------------ //

var io = socket.listen(http);
io.sockets.on("connection", function(socket){

    // Make an instance of SocketIOFileUpload and listen on this socket:
    var uploader = new SocketIOFileUpload();
    uploader.dir = "uploads";
    uploader.listen(socket);

    // Do something when a file is saved:
    uploader.on("saved", function(event){
        console.log(event.file);
    });

    // Error handler:
    uploader.on("error", function(event){
        console.log("Error from uploader", event);
    });
});

// ------------------ upload end ------------------ //

// ------------------ HID start ------------------ //
// TODO: Throw error if peripherals not detected
const fs = require('fs');
var mouse = '/dev/hidg0';
var keyboard = '/dev/hidg1';

function writeReport(device, data) {
  fs.writeFile(device, data, (err) => {
    if (err) throw err;
  });
}

// Make browser connection
socket.on('connection', function(socketRx) {
  // Receive keyboard data from browser and log in node console
  socketRx.on('keyboardChannel', function(data){
    console.log(data);
    writeReport(keyboard, Buffer.from(data));
    });

  // Receive mouse data from browser and log in node console
  socketRx.on('mouseChannel', function(data){
    console.log(data);
    writeReport(mouse, Buffer.from(data));
  });

  // Receive wake on LAN request
  socketRx.on('powerChannel', function(data){
    console.log("Requesting Power-on");
    if (data === "ON") {
      var spawn = require('child_process').spawn;
      var macAddress = 'A0:AF:BD:C3:3F:52';
      var ipAddress = '10.0.0.255';

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
// ------------------ HID end ------------------ //


//const openURL = require('opn');
// opens the url in the default browser
console.log("Opening Server URL")
//openURL('http://127.0.0.1:3000');
