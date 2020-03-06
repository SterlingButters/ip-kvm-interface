var socketTx = io();
var socketRx = io.connect();

var options = {'rows': 55, 'cols': 175};
var term = new Terminal(options);
term.welcome = function() {
  term.write('Hello from \x1B[1;3;31mR(p)ipMI\x1B[0m\r\n');
};
term.open(document.getElementById('terminal'));
term.welcome();

//Initialize Terminal
socketTx.emit('data', 'su pi\r');

term.onKey(function(e) {
  console.log(e);
  socketTx.emit('data', e.key);
});

// Capture Pasting
term.onData(function (e) {
    if (e.length > 1) {
      socketTx.emit('data', e);
    }
})

socketRx.on('data', function(data){
  term.write(data);
});
