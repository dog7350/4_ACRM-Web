const mongoose = require('mongoose');
const dotEnv = require('../../CP/envHell');
const chatLogSchema = require('./schemes/chatScaheme');

const mongoUrl = dotEnv.MONGO_URL.replace("???", dotEnv.MONGO_IP);
const MongoDB = {
    Mongoose: null
};

const connectMongoose = async ()=>{
    try {
        MongoDB.Mongoose = await mongoose.connect(mongoUrl,  { useNewUrlParser: true });
        
        console.log(
            `${mongoUrl} is ${(await mongooseState()).value}`
        );
    } catch (error) {
        console.log(error);
    }
}

const mongooseState = async ()=>{
    return {
        state: mongoose.connection.readyState,
        value: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
    }
}

const findChat = async (whereCond, selectCond, etcCond)=>{
    let result = [];

    // arg0 = {$and: [{id: {$eq: 'kim'}}, {cmd: {$regex: /^\//}}]}

    try {
        let 
            where = {$and : [
                {createdAt: {$ne: null}}, 
                {createdAt: {$gt: new Date(Date.now()-90*24*60*60*1000)}}
            ], ...(whereCond ?? {})},
            select = { _id: 0, cmd: 1, opt: 1, id: 1, content: 1, createdAt: 1, updatedAt: 1, ...(selectCond ?? {})},
            etc = {sort: {createdAt: -1, updatedAt: -1}, ...(etcCond ?? {})};

        result = await chatLogSchema.find(where, select, etc).exec();

    } catch (error) {
        console.log(error);
    }

    return result;
}

const disConnectMongoose = async ()=>{
    try {
        await mongoose.disconnect();
        MongoDB.Mongoose = null;
        
        console.log(
            `${mongoUrl} is ${(await mongooseState()).value}`
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    'connectMongoose': connectMongoose,
    'findChat': findChat,
    'disConnectMongoose': disConnectMongoose,
    'mongooseState': mongooseState,
};