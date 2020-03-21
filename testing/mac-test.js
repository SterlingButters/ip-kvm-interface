// Without using a transpiler
const find = require('local-devices');

// Find all local network devices.
find().then(devices => {
	for (let i=0; i<devices.length; i++) {
		console.log(devices[i]['ip']);
		console.log(devices[i]['mac']);
	}
})

