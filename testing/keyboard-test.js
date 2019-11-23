const fs = require('fs');

var keyboard = '/dev/hidg1';
type = Buffer.from([0, 0, 15, 0, 0, 0, 0, 0]);
type1 = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);

function writeReport(device, data) {
  fs.writeFile(device, data, (err) => {
    if (err) throw err;
  });
}

writeReport(keyboard, type);
writeReport(keyboard, type1);

