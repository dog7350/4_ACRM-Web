const REDIS = require('redis');
const REDIS_CLIENT = REDIS.createClient(6379, 'localhost');
const util = require('util');

const connect_redis = async ()=>{
    try{
        if(REDIS_CLIENT.isOpen === false){
            await REDIS_CLIENT.connect();
            
        }
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    REDIS: REDIS,
    REDIS_CLIENT: REDIS_CLIENT,

    set_expire: async (expSec, key, value)=>{
        var result = null;

        try{
            await connect_redis();

            await REDIS_CLIENT.SETEX(key, expSec, value);
        }
        catch(error){
            console.log(error);
        }

        return result;
    },
    del: async (key)=>{
        var result = null;

        try{
            await connect_redis();

            result = await REDIS_CLIENT.DEL(key);
        }
        catch(error){
            console.log(error);
        }

        return result;
    },
    del_is_exist: async (key)=>{
        var result = null;

        try{
            await connect_redis();

            if((await REDIS_CLIENT.EXISTS(key)) > 0){
                result = await REDIS_CLIENT.DEL(key);
            } else{
                result = -1;
            }
            
        }
        catch(error){
            console.log(error);
        }

        return result;
    },
    get: async (key)=>{
        var result = null;

        try{
            await connect_redis();

            // console.log(key);

            // result.result = await REDIS_CLIENT.get(key, (err, reply)=>{
                // console.log(err, reply);
                // result.reply = reply;


            // });

            result = await REDIS_CLIENT.get(key);
        }
        catch(error){
            console.log(error);
        }

        return result;
    },
};