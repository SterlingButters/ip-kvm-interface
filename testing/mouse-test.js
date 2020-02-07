console.log("Initiating mouse attempt");

const fs = require('fs');
var file = '/dev/hidg0';

x_move = parseInt(-100, 8);
y_move = parseInt(-100, 8);

click = 1 // 2: right-click; 3: middle-click; 1: left-click

const data0 = Buffer.from([0, 0, 0]);
const data1 = Buffer.from([1, 0, 0]);
const data2 = Buffer.from([0, 10, 10]);

function writeReport(data) {
        fs.writeFile(file, data, (err) => {
                if (err) throw err;
        });
}

writeReport(data2);
//writeReport(data1);
//writeReport(data0);
