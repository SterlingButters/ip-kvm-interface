const { pamAuthenticate, pamErrors } = require('node-linux-pam');

const options = {
    username: 'pi',
    password: 'blah',
};

pamAuthenticate(options, function(err, code) {
    if (!err) {
        console.log("Authenticated!");
        return;
    }

    if (err && code === pamErrors.PAM_NEW_AUTHTOK_REQD) {
        console.log('Authentication token is expired');
        return;
    }

    console.log(err);
});
