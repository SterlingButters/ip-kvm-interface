var util = require("util");
var spawn = require("child_process").spawn;
var process = spawn('butterfly.server.py',["--port=57575", "--unsecure"]);

util.log('Reading')
process.stdout.on('data',function(chunk){
    var textChunk = chunk.toString('utf8');// buffer to string
    util.log(textChunk);
});
