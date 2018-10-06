var express = require('express')
var app = express();
var http = require('http').Server(app);
var socketTx = require('socket.io')(http);

app.use(express.static(__dirname + '/'))

http.listen(3000, function(){
  console.log('listening on http://127.0.0.1:3000');
});

var io = require('socket.io-client');
io.connect('http://localhost:3000', {reconnect: true});

// 4) Receive data from browser and log in node console
socketTx.on('connection', function(socketRx) {
  socketRx.on('keyBoard', function(data){
    console.log(data.toString('utf8'))

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
});
