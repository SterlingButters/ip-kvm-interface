async function authenticateUser() {
   let authenticated = false;
   socketTx = io();
   socketRx = io.connect();

 var user = prompt("Please enter username", "");
 var pass = prompt("Please enter your password", "");
 //var mfaCode = prompt("Please enter your 6 digit code", "");

 socketTx.emit('authChannel', {username: user, password: pass});

 let promise = new Promise((resolve, reject) => {
   socketRx.on('authChannel', function(auth) {
     resolve(auth);
   });
 });

 setTimeout(function() {
     alert("Authenticating... Please wait a few seconds");
 });
 authenticated = await promise;

 if (authenticated == false) {
     authenticateUser();
   } else {
     authenticated == true;
     document.getElementById('pre-auth').classList.toggle('hide');
 }
     }
