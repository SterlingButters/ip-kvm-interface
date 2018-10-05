var spawn = require('child_process').spawn;
var macAddress = '00:11:22:33:44:55'
var ipAddress = '10.0.0.0'

function WOL(event) {
  var child = spawn('etherwake', ['-b', ipAddress, macAddress],
      { stdio: [ 'pipe', 'pipe', 2 ] });

  child.stdout.on('data', function(data)
    {document.getElementById("etherwake-stdout").innerHTML = "Etherwake Magic Packet (stdout): " + data;
     console.log("stdout: " + data)});
  child.stderr.on('data', function(data)
    {document.getElementById("etherwake-stderr").innerHTML = "Etherwake Magic Packet (stderr): " + data;
     console.log("stderr: " + data)});
  child.on('close', function(code)
    {document.getElementById("etherwake-exit").innerHTML = "Child process exited with code: " + code;
    console.log("Child process exited with code: " + code)});
  }
