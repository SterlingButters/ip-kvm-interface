
require('dotenv').config({path:__dirname+'/runtime.env'});
var twilio = require('twilio');
//https://www.twilio.com/docs/libraries/node

// Your Account SID from www.twilio.com/console
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// Your Auth Token from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
//console.log(client);
client.messages.create({
    body: Math.floor(100000 + Math.random() * 900000),
    to: '+12103609722',  // Text this number
    from: '+12053033616' // From a valid Twilio number
})
.then((message) => console.log(message.sid));
