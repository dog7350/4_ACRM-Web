const express = require('express');
const router = express.Router();


router.use(function(req, res, next){
    var tempIp = req.headers['x-forwarded-for'] || req.ip;
    // if(['127.0.0.1', '52.78.100.19', '52.78.48.223', '192.168.219.1', '106.102.142.185'].indexOf(tempIp) === -1){
    //     console.log(req.protocol, req.headers['x-forwarded-for'] || req.ip, req.method, req.url, "접근차단!");
    //     res.status(404).end('');
    // } else{
    //     if(req.url !== '/checkToken' && req.url !== '/info/base' && !/^\/images\/board/.test(req.url))
        console.log(req.protocol, req.headers['x-forwarded-for'] || req.ip, req.method, req.url);

        next();
    // }
});

module.exports = router;