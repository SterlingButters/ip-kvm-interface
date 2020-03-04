
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

require('dotenv').config({path:__dirname+'/runtime.env'});

// Start Interface WebServer
const express = require('express');
var SocketIOFileUpload = require('socketio-file-upload');
var app = express().use(express.static(__dirname + '/')).use(SocketIOFileUpload.router);

const net = require('net');
const http = require('http');
const https = require('https');
const server = http.Server(app);
const socket = require('socket.io')(server);
const WebSocket = require('ws');
const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;
const fs = require('fs');

const PORT = 80;

// we will pass our 'app' to 'https' server
// const server = https.createServer({
//     key: fs.readFileSync(__dirname+'/configuration/key.pem'),
//     cert: fs.readFileSync(__dirname+'/configuration/cert.pem'),
//     passphrase: process.env.SSL_PASSPHRASE
// }, app);
//
// server.listen(PORT, function(){
//     console.log(`Listening on http://localhost:${PORT}`);
//   vncClient = new WebSocket.Server({port: 3000});
//   vncClient.on('connection', new_client);
// });
// const socket = require('socket.io')(server);

server.listen(PORT, function(){
  console.log(`Listening on http://localhost:${PORT}`);
  // vncClient = new WebSocket.Server({server: server});
  vncClient = new WebSocket.Server({port: 3000});
  vncClient.on('connection', new_client);
});

// ------------------ Websockify Start ------------------ //
// Handle new WebSocket client
var onConnectedCallback = null;
var onDisconnectedCallback = null;


var new_client = function(client, req) {
	var clientAddr = client._socket.remoteAddress;
	console.log(req ? req.url : client.upgradeReq.url);
	var log = function (msg) {
		console.log(' ' + clientAddr + ': '+ msg);
	};
	log('WebSocket connection from : ' + clientAddr);
	log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol);

	var target = net.createConnection(5900,'localhost', function() {
		log('connected to target');
		if (onConnectedCallback)
		{
			try {
				onConnectedCallback(client, target);
			} catch(e) {
				log("onConnectedCallback failed, cleaning up target");
				target.end();
			}
		}
	});
	target.on('data', function(data) {
		//log("sending message: " + data);
		try {
			client.send(data);
		} catch(e) {
			log("Client closed, cleaning up target");
			target.end();
		}
	});
	target.on('end', function() {
		log('target disconnected');
		client.close();
	});
	target.on('error', function() {
		log('target connection error');
		target.end();
		client.close();
	});

	client.on('message', function(msg) {
		//log('got message: ' + msg);
		target.write(msg);
	});
	client.on('close', function(code, reason) {

		if (onDisconnectedCallback)
		{
			try {
				onDisconnectedCallback(client, code, reason);
			} catch(e) {
				log("onDisconnectedCallback failed");
			}
		}

		log('WebSocket client disconnected: ' + code + ' [' + reason + ']');
		target.end();
	});
	client.on('error', function(a) {
		log('WebSocket client error: ' + a);
		target.end();
	});
};
// ------------------ Websockify End ------------------ //

// ------------------ Video Start ------------------ //

// Websocket Server
var videoServer = new WebSocket.Server({port: WEBSOCKET_PORT, perMessageDeflate: false});
videoServer.connectionCount = 0;
videoServer.on('connection', function(socket, upgradeReq) {
	videoServer.connectionCount++;
	console.log(
		'New WebSocket Connection: ',
		(upgradeReq || socket.upgradeReq).socket.remoteAddress,
		(upgradeReq || socket.upgradeReq).headers['user-agent'],
		'('+videoServer.connectionCount+' total)'
	);
	socket.on('close', function(code, message){
		videoServer.connectionCount--;
		console.log(
			'Disconnected WebSocket ('+videoServer.connectionCount+' total)'
		);
	});
});
videoServer.broadcast = function(data) {
	videoServer.clients.forEach(function each(client) {
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
		videoServer.broadcast(data);
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
		console.log(textChunk);
	});

	ffmpeg.stderr.on('data', function(chunk){
		var textChunk = chunk.toString('utf8');
		console.log(textChunk);
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

// ------------------ Terminal Start ------------------ //
const pty = require('node-pty');
const argv = require('yargs').argv;

var terminals = {},
    logs = {};

var xterm;
let ptyterm;

socket.on('connect', function(client) {
  console.log("Connection Made");
  xterm = client;

  if (!ptyterm) {
  let shell = argv.shell && argv.shell !== '' ? argv.shell : process.platform === 'win32' ? 'cmd.exe' : 'bash';
  ptyterm = pty.spawn(shell, [], {
    name: 'xterm-color',
    // sync rows and cols from index.html
    cols: 250,
    rows: 250,
    cwd: process.env.PWD,
    env: process.env,
    //handleFlowControl: true
  });

  console.log('Created terminal with PID: ' + ptyterm.pid);
  terminals[ptyterm.pid] = ptyterm;
  logs[ptyterm.pid] = '';

  ptyterm.on('data', function (data) {
    logs[ptyterm.pid] += data;
    try {
	socket.emit('data', data);
    } catch (ex) {
        console.log("Web socket not available");
      }
  });

  };

  // Receive xterm data
  xterm.on('data', function(data) {
    //console.log(data);
    ptyterm.write(data);
  });

  socket.on('close', function() {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});
// ------------------ Terminal End ------------------ //

// ------------------ HID Start ------------------ //

const { pamAuthenticate, pamErrors } = require('node-linux-pam');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

var twilio = require('twilio'); //https://www.twilio.com/docs/libraries/node
var twilioKey = Math.floor(100000 + Math.random() * 900000);
// var sms = new twilio(accountSid, authToken);
// //console.log(client);
// sms.messages.create({
//     body: twilioKey,
//     to: '+12103609722',  // Text this number
//     from: '+12053033616' // From a valid Twilio number
// })
// .then((message) => console.log(message.sid));

var contents = fs.readFileSync(__dirname + "/configuration/gpioConfig.json");
var Relays = JSON.parse(contents).Relay;
var Switchs = JSON.parse(contents).Switch;
var Hubs = JSON.parse(contents).Hub;
var Lircs = JSON.parse(contents).LIRC;
console.log("Relay Pins:", Relays);
console.log("Switch Pins:", Switchs);
console.log("Hub:", Hubs);
console.log("LIRC Pins:", Lircs);

const Gpio = require('onoff').Gpio;  					// Include onoff to interact with the GPIO

let RELAYS = [];
for (let i = 0; i < Relays.length; i++) {
	const relay = new Gpio(Relays[i], 'out');
	RELAYS.push({"gpio": Relays[i], "object": relay});
};

// TODO: Throw error if peripherals not detected
var mouse = '/dev/hidg0';
var keyboard = '/dev/hidg1';

const SerialPort = require('serialport');
const ttyPort = new SerialPort('/dev/ttyUSB0', {baudRate:115200})

function writeReport(device, data) {
  fs.writeFile(device, data, (err) => {
    if (err) console.log(err);
  });
}

var fileTracker = {};

// Make browser connection
socket.on('connection', function(client) {
  //console.log("Client communication established");

  // Receive and Handle authentication data
  client.on('authChannel', function(data) {
    console.log(data);
		// Add twilio mfa code to data and handle here;
    pamAuthenticate(data, function(err, code) {
    if (!err) {
        console.log("Authenticated!");
				socket.emit('authChannel', true);
				return;
    } else {socket.emit('authChannel', false); return;}

    if (err && code === pamErrors.PAM_NEW_AUTHTOK_REQD) {
        console.log('Authentication token is expired');
				socket.emit('authChannel', false);
				return;
    }

    });
  });

  // Receive keyboard data from browser and log in node console
  client.on('keyboardChannel', function(data){
    console.log(data);
		ttyPort.write(String(data));
    //writeReport(keyboard, Buffer.from(data));
  });

  // Receive mouse data from browser and log in node console
  client.on('mouseChannel', function(data){
    console.log(data);
    writeReport(mouse, Buffer.from(data));
  });

  client.on('fileChannel', function(data){
	console.log(data);

	if (data == "RESET") {
		let uploads = fs.readdirSync(__dirname + '/uploads');
		var message = {Status: "Refreshed", Files: uploads};
		socket.emit('fileChannel', message);
	}
	else {
		udcPath = '/sys/kernel/config/usb_gadget/kvm-gadget/UDC';
		// UDC not recognized by the filesystem as a file -> must use echo (try removing configs also)
		disconnect = spawnSync('bash', [__dirname+"/configuration/disconnectUDC.sh"]);
		console.log(disconnect);
		console.log('UDC Halted');

		let confirmWrite = fs.readFileSync(udcPath, 'utf-8');
		// console.log(confirmWrite);

		// Attach file to libcomposite
		if (data.Command === "Attach") {

			fs.unlinkSync('/sys/kernel/config/usb_gadget/kvm-gadget/configs/c.1/mass_storage.usb');

			numAttachedFiles = Object.keys(fileTracker).length;
			lunNum = 'lun.'+numAttachedFiles;
			fileTracker[lunNum] = {File: data.File,
							 CDRom: data.CDRom,
					 Removable: data.Removable,
					   ReadOnly: data.ReadOnly,
						        FUA: data.FUA};

			lunPath = '/sys/kernel/config/usb_gadget/kvm-gadget/functions/mass_storage.usb/'+lunNum;
			if (!fs.existsSync(lunPath)) {
				fs.mkdirSync(lunPath);
			}

			if (numAttachedFiles > 8) {
				socket.emit('fileChannel', "Greater than 8 files attached");
			} else {
				try {
					fs.writeFileSync(lunPath+'/file', __dirname+'/uploads/'+data.File);
					fs.writeFileSync(lunPath+'/cdrom', data.CDRom);
					fs.writeFileSync(lunPath+'/removable', data.Removable);
					//fs.writeFileSync(lunPath+'/ro', data.ReadOnly); // Find out why read-only doesn't work
					fs.writeFileSync(lunPath+'/nofua', data.FUA);
					console.log('File Attached');

					console.log(fileTracker);
					socket.emit('fileChannel', fileTracker);
				} catch (err) {console.log(err)}
			}

		}

		// Detach file from libcomposite
		if (data.Command === "Detach") {
			// Will need revision
			var key = Object.keys(fileTracker).find(key => fileTracker[key] === data.File);
			delete fileTracker[key];
			file = '/sys/kernel/config/usb_gadget/kvm-gadget/functions/mass_storage.usb/'+key+'/file';

			try {
				fs.writeFileSync(file, "");
				fs.writeFileSync(lunPath+'/cdrom', "");
				fs.writeFileSync(lunPath+'/removable', "");
				//fs.writeFileSync(lunPath+'/ro', ""); // Find out why read-only doesn't work
				fs.writeFileSync(lunPath+'/nofua', "");
				console.log('File Detached');
				socket.emit('fileChannel', fileTracker);
			} catch (err) {console.log(err)}
		}

		// Reconnect UDC
		if (!fs.existsSync('/sys/kernel/config/usb_gadget/kvm-gadget/configs/c.1/mass_storage.usb')) {
		fs.symlinkSync('/sys/kernel/config/usb_gadget/kvm-gadget/functions/mass_storage.usb', '/sys/kernel/config/usb_gadget/kvm-gadget/configs/c.1/mass_storage.usb');
		}

		let dirContents = fs.readdirSync('/sys/class/udc')

		try {
			fs.writeFileSync(udcPath, dirContents[0]);
			console.log('UDC Reconnected');
		} catch (err) {console.log(err)};
	};
  });

  // Receive stream reset instructions from browser and reset the stream
  client.on('streamChannel', function(data){
		console.log("Request for stream reset received");
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

	// Receive request for process PID
	client.on('debugChannel', function(data){
		console.log("Request for PID received");
		socket.emit('debugChannel', process.pid);
	});

  // Receive request for mac address population
  const detect = require('local-devices');
  client.on('networkChannel', function(data) {
    console.log("Request for MACs received");
    detect().then(devices => {
      socket.emit('networkChannel', devices);
    });
  });

  // Receive wake on LAN request
  client.on('powerChannel', function(data){

    if (data.Method === "WOL") {
      console.log("Requesting WOL for " + data.MAC);
      var macAddress = data.MAC;

      var etherwake = spawnSync('etherwake', ['-b', macAddress]);

    } else {
		console.log("Resetting GPIO Connection " + data.Pin);
		for (let j = 0; j < RELAYS.length; j++) {
			console.log(j);
			console.log(RELAYS[j]);
			if (Number(data.Pin) === RELAYS[j]['gpio']) {
				if (RELAYS[j]['object'].readSync() === 0) { 					// Check the pin state, if the state is 0 (or off)
					RELAYS[j]['object'].writeSync(1); 						// Set pin state to 1 (turn LED on)
				} else {
					RELAYS[j]['object'].writeSync(0); 						// Set pin state to 0 (turn LED off)
			  	}
			};

		}
     };
  });
});

// ------------------ HID End ------------------ //


const openURL = require('opn');
// opens the url in the default browser
console.log("Opening Server URL");
openURL('http://127.0.0.1:3000');
