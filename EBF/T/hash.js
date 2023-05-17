const dotEnv = require('../CP/envHell');
const crypto = require('crypto');

module.exports = {
    makeHash: function(value){
        var hasher = crypto.createHash('sha256');

        return hasher.update(value+dotEnv.HASH_SECRET_KEY).digest('hex');
        //return value;
    }
};