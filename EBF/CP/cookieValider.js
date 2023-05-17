const express = require('express');
const router = express.Router();
const tokenManager = require('../T/tokenManager');
const socketPartner = require('../T/socket/socketPartner');

router.use( async function(req, res, next){
    let accessToken = tokenManager.getToken(req);

    if(accessToken != null){
        let decryptToken = await tokenManager.verifyToken(accessToken, req);
        
        if(Number.isInteger(decryptToken)){
            res.clearCookie("accessToken");
        } else{
            
        }
    }

    next();
});

module.exports = router;