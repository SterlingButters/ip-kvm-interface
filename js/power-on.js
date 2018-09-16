var spawn = require('child_process').spawn;
var macAddress = '00:11:22:33:44:55'
var ipAddress = '10.0.0.0'

// Check 'spawn' documentation
var child = spawn('etherwake', ['-b', ipAddress, macAddress],
    { stdio: [ 'pipe', 'pipe', 2 ] });

child.stdout.on('data', function(data){console.log("stdout: " + data)});
