const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const spawn = require('child_process').spawn;



app.use(express.static(path.join(__dirname + '/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

console.log("Listening");
server.listen(8080);
// Open browser to http://localhost:8080/testing.m3u8
