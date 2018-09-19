var HID = require('node-hid');
var devices = HID.devices();

var keyboard = new HID.HID( 7531,260 );

console.log(devices)
console.log(keyboard)
console.clear
