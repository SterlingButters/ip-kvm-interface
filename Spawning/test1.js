var spawn = require('child_process').spawn;

var child = spawn('python', ['-u', 'test
.py'],
    { stdio: [ 'pipe', 'pipe', 2 ] });
  child.stdout.on('data', function(data){console.log("stdout: " + data)});

var i = 0;
setInterval(function(){
    console.log(i);
    child.stdin.write("i = " + i++ + "\n");
}, 1000);
