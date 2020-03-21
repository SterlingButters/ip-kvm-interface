var noble = require('@abandonware/noble');

noble.on('stateChange', function(state) {
  console.log(state);
  if (state == "poweredOn") {
    noble.startScanning(null); // any service UUID, no duplicates
  }

  noble.on('discover', function(peripheral) {
    console.log(peripheral.advertisement.localName);
    console.log(peripheral.address);
  })
})


var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var devices = [];
btSerial.on('found', function(address, name) {
    console.log(name);
    devices.push({Name: name, Address: address})
}, function () {console.log("Found Nothing...")});

// btSerial.inquire();

btSerial.on('finished', function() {
  console.log(devices);
  rl.question("Enter name of desired BT connection device: ", function(name) {
    for (var device in devices) {
      if (name == devices[device].Name) {
        address = devices[device].Address;
        console.log("Match Found")
        console.log(name);
        console.log(address);
        btSerial.findSerialPortChannel(address, function(channel) {
            console.log(channel);
//             btSerial.connect(address, channel, function() {
//                 console.log('connected');
//
//                 btSerial.write(Buffer.from('Test Data', 'utf-8'), function(err, bytesWritten) {
//                     if (err) console.log(err);
//                     console.log(bytesWritten);
//                 });
//
//                 btSerial.on('data', function(buffer) {
//                     console.log(buffer.toString('utf-8'));
//                 });
//             });
//
//           //close the connection when you're ready
//           btSerial.close();
//
      }, function(err) {if (err) throw err});
      };
    }
  });
})


//const bluetooth = require('node-bluetooth');

// create bluetooth device instance
//const device = new bluetooth.DeviceINQ();

//device.listPairedDevices(console.log);

//device
//.on('finished',  console.log.bind(console, 'finished'))
//.on('found', function found(address, name){
//  console.log('Found: ' + address + ' with name ' + name);
//}).scan();

//bluetooth.connect(address, channel, function(err, connection){
//  if(err) return console.error(err);

//  connection.on('data', (buffer) => {
//    console.log('received message:', buffer.toString());
//  });

//  connection.write(new Buffer('Hello!', 'utf-8'), () => {
//    console.log("wrote");
//  });
//});
