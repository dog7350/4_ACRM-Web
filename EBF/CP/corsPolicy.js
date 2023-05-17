const cors = require('cors');

const whiteList = ['http://127.0.0.1:3000', 'http://localhost:3000'];

const corsOption = {
    origin: function(origin, callback){
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true);
        }
        else{
            callback(new Error(`Not Allowed Origin [${origin}]`));
        }
    }
}

module.exports = cors(corsOption);