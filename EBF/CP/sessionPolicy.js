const expressSession = require('express-session');
const dotEnv = require('./envHell');

const sessionOption = {
    secret: 'session-secret',
    resave: true,
    saveUninitialized: false,
    secure: true,
    // cookie : {
    //     sameSite: 'None',
    //     secure: true,
    // },
};

module.exports = expressSession(sessionOption);