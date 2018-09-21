// http://www.zerorpc.io/
var zerorpc = require("zerorpc");

var server = new zerorpc.Server({
    data: function(reply) {
      var times = [];
      var timeStamp = Math.floor(Date.now());
      if (timeStamp != times[times.length - 1]) {
        times.push(timeStamp)
        reply(null, "Time: " + timeStamp);
      }
    }

});

server.bind("tcp://0.0.0.0:4242");
server.run();
