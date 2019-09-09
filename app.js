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
var app = express();
const http = require('http').Server(app);
const socketTx = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

http.listen(3000, function(){
  console.log('Listening on http://127.0.0.1:3000');
});

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
socketTx.on('connection', function(socketRx) {
  // Receive keyboard data from browser and log in node console
  socketRx.on('keyBoard', function(data){
    console.log(data.toString('utf8'));
    writeReport(keyboard, data);
    });

  // Receive mouse data from browser and log in node console
  socketRx.on('mouseMove', function(data){
    console.log("x"+data.x);
    console.log("y"+data.y);
  });

  socketRx.on('mouseClick', function(data){
    console.log(data.toString('utf8'));
  });

  // Receive wake on LAN request
  socketRx.on('poweron', function(data){
    console.log("Requesting Power-on");
    if (data === "ON") {
      var spawn = require('child_process').spawn;
      var macAddress = '00:11:22:33:44:55';
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

const openURL = require('opn');
// opens the url in the default browser
console.log("Opening Server URL")
openURL('http://127.0.0.1:3000');
