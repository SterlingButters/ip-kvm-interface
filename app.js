
if (process.argv.length < 3) {
	console.log(
		'Usage: \n' +
		'node websocket-relay.js <secret> [<stream-port> <websocket-port>]'
	);
	//process.exit();
}

var STREAM_SECRET = process.argv[2] || "DEFAULT",
    STREAM_PORT = process.argv[3] || 8081,
    WEBSOCKET_PORT = process.argv[4] || 8082,
    RECORD_STREAM = false;

// Start Interface WebServer
const express = require('express');
var SocketIOFileUpload = require('socketio-file-upload');
var app = express().use(express.static(__dirname + '/')).use(SocketIOFileUpload.router);

const http = require('http');
const server = http.Server(app);
const socket = require('socket.io')(server);
const WebSocket = require('ws');

server.listen(3000, function(){
  console.log('Listening on http://127.0.0.1:3000');
});

// Start Butterfly for User
//var spawn = require("child_process").spawn;
//var instance = spawn('butterfly.server.py',["--port=57575", "--unsecure"]);

//console.log('Starting Butterfly Server on port 57575...');
//instance.stdout.on('data', function(chunk){
//    var textChunk = chunk.toString('utf8');
//    console.log(textChunk);
//});

// ------------------ Video Start ------------------ //

// Websocket Server
var socketServer = new WebSocket.Server({port: WEBSOCKET_PORT, perMessageDeflate: false});
socketServer.connectionCount = 0;
socketServer.on('connection', function(socket, upgradeReq) {
	socketServer.connectionCount++;
	console.log(
		'New WebSocket Connection: ',
		(upgradeReq || socket.upgradeReq).socket.remoteAddress,
		(upgradeReq || socket.upgradeReq).headers['user-agent'],
		'('+socketServer.connectionCount+' total)'
	);
	socket.on('close', function(code, message){
		socketServer.connectionCount--;
		console.log(
			'Disconnected WebSocket ('+socketServer.connectionCount+' total)'
		);
	});
});
socketServer.broadcast = function(data) {
	socketServer.clients.forEach(function each(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};

// HTTP Server to accept incomming MPEG-TS Stream from ffmpeg
var streamServer = http.createServer( function(request, response) {
	var params = request.url.substr(1).split('/');

	if (params[0] !== STREAM_SECRET) {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + ':' +
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}

	response.connection.setTimeout(0);
	console.log(
		'Stream Connected: ' +
		request.socket.remoteAddress + ':' +
		request.socket.remotePort
	);
	request.on('data', function(data){
		socketServer.broadcast(data);
		if (request.socket.recording) {
			request.socket.recording.write(data);
		}
	});
	request.on('end',function(){
		console.log('close');
		if (request.socket.recording) {
			request.socket.recording.close();
		}
	});

	// Record the stream to a local file?
	if (RECORD_STREAM) {
		var path = 'recordings/' + Date.now() + '.ts';
		request.socket.recording = fs.createWriteStream(path);
	}
}).listen(STREAM_PORT);

console.log('Listening for incomming MPEG-TS Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');

// ------------------ Video End ------------------ //

function resetStream(input) {

	// Terminate Existing process here first

	var spawn = require("child_process").spawn;
	var ffmpeg = spawn('ffmpeg', ["-f","v4l2",
		                     "-framerate","30",
		                     "-video_size","1920x1080",
		                     "-i", input,
		                     "-f","mpegts",
		                     "-codec:v","mpeg1video",
		                     "-s","1920x1080",
		                     "-b:v","3000k",
	//                       "qscale:v","20",
		                     "-bf","0",
		                     "http://localhost:8081/DEFAULT"]);

	ffmpeg.stdout.on('data', function(chunk){
		var textChunk = chunk.toString('utf8');
		//console.log(textChunk);
	});

	ffmpeg.stderr.on('data', function(chunk){
		var textChunk = chunk.toString('utf8');
		//console.log(textChunk);
	});
};

// ------------------ Upload Start ------------------ //

socket.on("connection", function(socket){

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

// ------------------ Upload End ------------------ //

// ------------------ HID Start ------------------ //

// TODO: Throw error if peripherals not detected
const fs = require('fs');
var spawn = require('child_process').spawnSync;

const Gpio = require('onoff').Gpio;  					// Include onoff to interact with the GPIO
const relayTwo = new Gpio(2, 'out'); 					// Can this be implemented dynamically?
const relayThree = new Gpio(3, 'out');
const relayFour = new Gpio(4, 'out');

var mouse = '/dev/hidg0';
var keyboard = '/dev/hidg1';

function writeReport(device, data) {
  fs.writeFile(device, data, (err) => {
    if (err) throw err;
  });
}

var fileTracker = {};

// Make browser connection
socket.on('connection', function(client) {
  console.log("Client communication established");

  // Receive keyboard data from browser and log in node console
  client.on('keyboardChannel', function(data){
    console.log(data);
    writeReport(keyboard, Buffer.from(data));
  });

  // Receive mouse data from browser and log in node console
  client.on('mouseChannel', function(data){
    console.log(data);
    writeReport(mouse, Buffer.from(data));
  });

  client.on('fileChannel', function(data){
	console.log(data);
	
	udcPath = '/sys/kernel/config/usb_gadget/kvm-gadget/UDC';
	// UDC not recognized by the filesystem as a file -> must use echo
	disconnect = spawn('bash', [__dirname+"/configuration/disconnectUDC.sh"]);
	console.log(disconnect);
	console.log('UDC Halted');	
	
	let confirmWrite = fs.readFileSync(udcPath, 'utf-8');
	// console.log(confirmWrite);	

	// Attach file to libcomposite
	if (data.Command === "Attach") {

		numAttachedFiles = Object.keys(fileTracker).length;
		
		lunNum = 'lun.'+numAttachedFiles;
		fileTracker[lunNum] = data.Argument;
		editFile = '/sys/kernel/config/usb_gadget/kvm-gadget/functions/mass_storage.usb/'+lunNum+'/file';

		if (numAttachedFiles > 8) {
			socket.emit('fileChannel', "Greater than 8 files attached");
		} else {
			lunNum = 'lun.'+numAttachedFiles;
			fileTracker[lunNum] = data.Argument;
			editFile = '/sys/kernel/config/usb_gadget/kvm-gadget/functions/mass_storage.usb/'+lunNum+'/file';
			
			try {			
				fs.writeFileSync(editFile, __dirname+'/uploads/'+data.Argument);
				console.log('File Attached');
			} catch (err) {console.log(err)}
		}

	}

	// Detach file from libcomposite
	if (data.Command === "Detach") {
		var key = Object.keys(fileTracker).find(key => fileTracker[key] === data.Argument);
		delete fileTracker[key];
		editFile = '/sys/kernel/config/usb_gadget/kvm-gadget/functions/mass_storage.usb/'+key+'/file';

		try {			
			fs.writeFileSync(editFile, "");
			console.log('File Attached');
		} catch (err) {console.log(err)}
	}
	
	// Reconnect UDC
	let dirContents = fs.readdirSync('/sys/class/udc')
	console.log(dirContents);
	
	try {
		fs.writeFileSync(udcPath, dirContents[0]);
		console.log('UDC Reconnected');
	} catch (err) {console.log(err)};

  });

  // Receive stream reset instructions from browser and reset the stream
  client.on('streamChannel', function(data){
		resetStream(data);
  });

  // Receive source refresh instructions from browser and repopulate menu
  client.on('sourceChannel', function(data){
	if (data === "RefreshVideo") {
		const glob = require('glob');

		  	glob("/dev/video*", function(err, files) {

				if (err) {
						return console.log('Unable to scan directory: ' + err);
					}

					files.forEach(function (file) {
						// Do whatever you want to do with the file
						console.log(file);
						socket.emit('sourceChannel', file);
					});
				});

			};
  	});

  // Receive wake on LAN request
  client.on('powerChannel', function(data){

    if (data.Method === "WOL") {
      console.log("Requesting WOL for " + data.IP + " & " + data.MAC);
      var spawn = require('child_process').spawn;
      var macAddress = data.MAC;
      var ipAddress = data.IP;

      process.on('uncaughtException', function (err) {
        var etherwake = spawn('etherwake', ['-b', ipAddress, macAddress]);
        console.log('Caught exception: ', err);

        etherwake.stdout.on('data', function(output){console.log("stdout: " + output)});
        etherwake.stderr.on('data', function(output){console.log("stderr: " + output)});
        etherwake.on('close', function(code){console.log("Exited with code: " + code)});
      });
    } else {
		console.log("Resetting GPIO Connection " + data.Pin);
	    if (Number(data.Pin) === 2) {
			if (relayTwo.readSync() === 0) { 					// Check the pin state, if the state is 0 (or off)
				relayTwo.writeSync(1); 						// Set pin state to 1 (turn LED on)
		    } else {
				relayTwo.writeSync(0); 						// Set pin state to 0 (turn LED off)
		  	}
			relayTwo.unexport(); 							// Unexport GPIO to free resources
		};

		if (Number(data.Pin) === 3) {
			if (relayThree.readSync() === 0) { 					// Check the pin state, if the state is 0 (or off)
				relayThree.writeSync(1); 						// Set pin state to 1 (turn LED on)
			} else {
				relayThree.writeSync(0); 						// Set pin state to 0 (turn LED off)
		  	}
			relayThree.unexport(); 							// Unexport GPIO to free resources
		};

		if (Number(data.Pin) === 4) {
			if (relayFour.readSync() === 0) { 					// Check the pin state, if the state is 0 (or off)
				relayFour.writeSync(1); 						// Set pin state to 1 (turn LED on)
			} else {
				relayFour.writeSync(0); 						// Set pin state to 0 (turn LED off)
		  	}
			relayFour.unexport(); 							// Unexport GPIO to free resources
		};
     };
  });
});

// ------------------ HID End ------------------ //


const openURL = require('opn');
// opens the url in the default browser
console.log("Opening Server URL");
openURL('http://127.0.0.1:3000');
