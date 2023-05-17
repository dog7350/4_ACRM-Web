#!/usr/local/bin/node

console.log('index.js start');

const http = require('http');
const https = require('https');
const fs = require('fs');
const fav = require('serve-favicon');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const dotEnv = require('./EBF/CP/envHell');
const DB = require('./EBF/T/db');
const redisPartner = require('./EBF/T/RedisPartener');
const mongoPartner = require('./EBF/T/mongooseDir/mongoPartner');
const socket = require('./EBF/T/socket/socketPartner');
const app = express();
const host = dotEnv.HOST;
const port = dotEnv.PORT || 3000;


var httpServer = null;
var httpsServer = null;
var socketio = null;

var privateKey  = fs.readFileSync('rsakeys/private.key', 'utf8');
var certificate = fs.readFileSync('rsakeys/mycommoncrt.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

// setInterval(async ()=>{ // DB야 죽지마!
//     try{
//         await DB.query('SELECT 1 FROM userinfo;');
//     }
//     catch(error){
//         console.log(error);
//     }
    
// }, 1000);

mongoPartner.connectMongoose();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(fav(path.join(__dirname, 'public', 'favicon.ico')));
app.set('trust proxy', true)

// app.use(require('cors')({
//     origin: true,
//     credentials: true
// }));
app.use(require('cors')());

app.use(require('./EBF/CP/requestChecker'));
app.use(require('./EBF/CP/sessionPolicy'));
app.use(require('./EBF/CP/cookieValider'));
app.use(require('./EBF/RS/GET/getRouter'));
app.use(require('./EBF/RS/POST/postRouter'));
app.use(require('./EBF/RS/PUT/putRouter'));
app.use(require('./EBF/RS/DELETE/deleteRouter'));
app.use(require('./EBF/RS/lostRouter'));

app.use(require('connect-history-api-fallback')());

httpServer = http.createServer(app);
httpsServer = https.createServer(credentials, app);

httpServer.listen(port, '0.0.0.0', ()=>{
    console.log(`Server Start  =>  http://${host}:${port}`);
});

httpsServer.listen(443, '0.0.0.0', ()=>{
    console.log(`Server Start  =>  https://${host}:443`);
});

socket.new_socket(httpsServer);
socket.socket_on();