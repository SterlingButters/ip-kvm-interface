#!/usr/bin/env node

const path = require('path');
const pty = require('node-pty');
const argv = require('yargs').argv;
const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const socket = require('socket.io')(server);

const PORT = 80;
app.use(express.static(path.join(__dirname + '/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// const port = argv.port || PORT;
// const host = '127.0.0.1';
// const ALLOWED_ORIGINS = [
//   '0.0.0.0',
//   '127.0.0.1',
//   'home.localhost',
//   'chrome-extension://'
// ];

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//
//   let origin = req.get('origin');
//   let host = req.get('host');
//   let foundOrigin = ALLOWED_ORIGINS.find(o => (origin && origin.indexOf(o) >= 0));
//   let foundHost = ALLOWED_ORIGINS.find(h => (host && host.indexOf(h) >= 0));
//
//   if (!foundOrigin && !foundHost) {
//     res.status(403);
//     res.send('Go away!');
//     res.end();
//     return;
//   }
//   next();
// });
// app.use('/', express.static(__dirname + '/build'));
//
// require('express-ws')(app);

var terminals = {},
    logs = {};

var xterm;

let shell = argv.shell && argv.shell !== '' ? argv.shell : process.platform === 'win32' ? 'cmd.exe' : 'bash';
let ptyterm = pty.spawn(shell, [], {
  name: 'xterm',
  cols: 80,
  rows: 24,
  cwd: process.env.PWD,
  env: process.env,
  //handleFlowControl: true
});

console.log(ptyterm);

socket.on('connection', function(client) {
  console.log("Client communication established");
  xterm = client;

  xterm.on('data', function(data) {
    // if data == upArrow -> read .bash_history
    console.log("Data to execute in pty: ", data);
    ptyterm.write(data+'\r');
  });
});

console.log('Created terminal with PID: ' + ptyterm.pid);
terminals[ptyterm.pid] = ptyterm;
logs[ptyterm.pid] = '';

ptyterm.on('data', function (data) {
  logs[ptyterm.pid] += data;
  console.log('Data transmitted TO xterm = ' + data);
  try {
      socket.emit('data', data);
  } catch (ex) {
      console.log("Web socket not available");
    }
});

// Receive xterm data
//xterm.on('data', function(data){
//  console.log("Data to execute in pty = " + data);
// ptyterm.write(data+'\r');
//});

  //   ws.on('close', function () {
  //     term.kill();
  //     console.log('Closed terminal ' + term.pid);
  //     // Clean things up
  //     delete terminals[term.pid];
  //     delete logs[term.pid];
  //   });
  // });

// app.post('/terminals/:pid/size', function (req, res) {
//   let pid = parseInt(req.params.pid, 10);
//   let cols = parseInt(req.query.cols, 10);
//   let rows = parseInt(req.query.rows, 10);
//   let term = terminals[pid];
//
//   term.resize(cols, rows);
//   console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
//   res.end();
// });
//
// if (!port) {
//   console.error('Please provide a port: node ./src/server.js --port=XXXX');
//   process.exit(1);
// } else {

server.listen(PORT); // host
console.log('Server listening at http://127.0.0.1:' + PORT);
