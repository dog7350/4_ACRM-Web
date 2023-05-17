const SOCKETIO = require('socket.io');
const socket_io_json = {};
const tokenManager = require('../tokenManager');
const redisPartner = require('../RedisPartener');
const dbReserved = require('../dbReserved');
const dotEnv = require('../../CP/envHell');
const { io } = require('socket.io-client');

// dotEnv.NOTIFI_TABLE

const hexChanger = (str)=>{
    return str
    .split('%20').join(' ')
    .split('%21').join('!')
    .split('%22').join('"')
    .split('%23').join('#')
    .split('%24').join('$')
    .split('%25').join('%')
    .split('%26').join('&')
    .split('%27').join('\'')
    .split('%28').join('(')
    .split('%29').join(')')
    .split('%2A').join('*')
    .split('%2B').join('+')
    .split('%2C').join(',')
    .split('%2D').join('-')
    .split('%2E').join('.')
    .split('%2F').join('/')
    .split('%3A').join(':')
    .split('%3B').join(';')
    .split('%3C').join('<')
    .split('%3D').join('=')
    .split('%3E').join('>')
    .split('%3F').join('?')
    .split('%40').join('@')
    .split('%5B').join('[')
    .split('%5C').join('\\')
    .split('%5D').join(']')
    .split('%5E').join('^')
    .split('%5F').join('_')
    .split('%60').join('`')
    .split('%7B').join('{')
    .split('%7C').join('|')
    .split('%7D').join('}')
    .split('%7E').join('~')
    ;
};

const yyyymmdd_HHMMSS = (dateTime)=>{
    let result = 'yyyy-mm-dd HH:MM:ss';
    try{
        var timeZone = new Date(dateTime);
        var time = timeZone.toString().split(' ')[4];
        var date = null;

        var year = timeZone.getFullYear();
        var month = timeZone.getMonth()+1;
        var day = timeZone.getDate();

        date = `${year}-${("00"+month.toString()).slice(-2)}-${("00"+day.toString()).slice(-2)}`;
        result = date + ' ' + time;
    }
    catch(error){
        console.log(error);
    }

    return result;
};

module.exports = {
    new_socket: (httpServer)=>{
        try {
            socket_io_json.socket_io = SOCKETIO(httpServer, {cors: {origin: '*', methods: ["GET", "POST"]}, });
        }
        catch (error) {
            console.log(error);
        }
    },

    socket_on: async ()=>{
        socket_io_json.socket_io.on('connection', async function(socket) {
            // socket.join('test_room_0');
            // socket_io_json.socket_io.to('test_room_0').emit('test_room_0_send', {data: 'data'});

            socket.currentRoom = null;
            

            socket.on('upload_boards', ()=>{
                socket_io_json.socket_io.emit('refreshOn', null);
            });

            socket.on('login_status_on', async (data)=>{
                var result = {
                    result: [],
                    code: 0,
                };

                var cookieList = data.split(';');

                for(var i in cookieList){
                    if(cookieList[i].indexOf('accessToken=') != -1){
                        var tempList = cookieList[i].split('accessToken=');
                        var atk = hexChanger(tempList[1]);

                        socket.atk = atk;

                        try {
                            socket.atkSep = await tokenManager.verifyToken2(socket.atk, socket.handshake.headers['x-forwarded-for'] || socket.handshake.address);

                            if(Number.isInteger(socket.atkSep)){
                                tokenManager.tokenVerifyValue(socket.atkSep, result);

                                socket.atk = null;
                                socket.atkSep = null;
                            } else{
                                await redisPartner.set_expire(Number.MAX_SAFE_INTEGER, socket.atk, JSON.stringify(socket.atkSep));

                                result.result.push(...[socket.atk, socket.atkSep]);
                                result.code = 0;

                                socket.join(socket.atkSep.id);

                                var PA1, PA2, PA3;
                                var dbresult, dbfield;

                                PA1 = '*';
                                PA2 = dotEnv.NOTIFI_TABLE2;
                                PA3 = `receiver='${socket.atkSep.id}' AND isView=0`;

                                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                if(dbresult.length !== 0){
                                    socket.emit("create_notifi", {});
                                }
                            }
                        } 
                        catch (error) {
                            result.code = 1;

                            console.log(error);
                        }  
                        break;
                    }
                }

                socket.emit('login_status_on_result', result);
            });

            socket.on('login_status_off', async (data)=>{
                var result = {
                    result: 'success',
                    code: 0,
                };

                try {
                    await redisPartner.del_is_exist(socket.atk || '');
                    
                    if(socket.atkSep){
                        socket.leave(socket.atkSep.id);
                    }
                    // console.log(await redisPartner.del(socket.atk));
                } 
                catch (error) {
                    console.log(error);
                }

                socket.atk = null;
                socket.atkSep = null;

                socket.emit('login_status_off_result', result);
            });

            socket.on('login_check', async ()=>{
                var result = {
                    result: {},
                    code: 0,
                };

                var PA1, PA2, PA3;
                var dbresult, dbfield;

                // console.log(!socket.atk);

                if(!socket.atk){
                    result.result.loginStatus = false;
                    result.code = -1;

                    socket.emit('login_check_result', result);
                } else{
                    // let item = await redisPartner.get(socket.atk || '');
                    // let loginString = null;
                    let loginString = JSON.parse(await redisPartner.get(socket.atk || ''));
                    // setTimeout(async ()=>{
                        // if(item.reply){
                            // loginString = JSON.parse(item.reply);

                            if(loginString && loginString.id){
                                PA1 = '*';
                                PA2 = 'userinfo';
                                PA3 = `id='${loginString.id}'`;
        
                                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
        
                                if(loginString.auth !== dbresult[0].admin){
                                    loginString.auth = dbresult[0].admin;
                                    await redisPartner.set_expire(Number.MAX_SAFE_INTEGER, socket.atk, JSON.stringify(socket.atkSep));
        
                                    result.result.loginValid = dbresult[0].admin;
                                } else{
                                    result.result.loginValid = loginString.auth;
                                }
        
                                result.result.loginStatus = true;
                            }
        
                            socket.emit('login_check_result', result);
                        // }
                    // }, 200);
                }
            });

            socket.on("joinRoom", async (payload)=>{
                var result = {
                    result: '',
                    code: 0,
                };

                try{
                    // let item = await redisPartner.get(socket.atk || '');
                    // let loginString = null;
                    let loginString = JSON.parse(await redisPartner.get(socket.atk || ''));

                    // setTimeout(async ()=>{
                    //     if(item.reply){
                            // loginString = JSON.parse(item.reply);
                            if(loginString && loginString.id){
                                if(payload.targetID){
        
                                    var PA1, PA2, PA3;
                                    var dbresult, dbfield;
        
                                    PA1 = '*';
                                    PA2 = `${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} as uumg`;
                                    PA3 = `uumg.id='${payload.targetID}'`;
        
                                    dbresult = await dbReserved.dynamic_select(PA1, PA2, PA3);
        
                                    if(!dbresult || dbresult[0].length === 0){
                                        result.result = '존재하지 않는 유저입니다.';
                                        result.code = -1;
                                    } else{
                                        let roomName = (loginString.id+payload.targetID).split('').sort().join('');
                                        socket.currentRoom = roomName;
                                        socket.join(roomName);
        
                                        result.result = dbresult[0][0]['name'];
                                        result.code = 10;
                                    }
                                } else{
                                    if(socket.currentRoom){
                                        let tempRoom = socket.currentRoom;
                                        socket.currentRoom = null;
        
                                        socket.leave(tempRoom);
                                        result.result = '방을 나갔습니다.';
                                        result.code = 20;
                                    } else{
                                        result.result = '접속중인 방이 없습니다.';
                                        result.code = 30;
                                    }
                                }
                            } else{
                                result.result = '로그인 후 이용할 수 있습니다.';
                                result.code = -100;
                            }
    
                            socket.emit("joinRoomResult", result);
                    //     }
                    // }, 200);
                }
                catch(err){
                    console.log(err);
                    result.result = '문제발생';
                    result.code = -2;

                    socket.emit("joinRoomResult", result);
                }
            });

            socket.on("chatSend", async (payload)=>{
                var result = {
                    result: '',
                    code: 0,
                };

                try{
                    // let item = await redisPartner.get(socket.atk || '');
                    // let loginString = null;
                    let loginString = JSON.parse(await redisPartner.get(socket.atk || ''));

                    // setTimeout(async ()=>{
                        // if(item.reply){
                            // loginString = JSON.parse(item.reply);
                            
                            if(loginString && loginString.id){
                                socket_io_json.socket_io.to(socket.currentRoom).emit('chatReceive', {receiveText: payload.sendText, sender: loginString.id, date: yyyymmdd_HHMMSS(Date.now())});
                            }
                        // }
                        
                    // }, 200);
                }
                catch(err){
                    console.log(err);
                }
            })

            socket.on('disconnect', async ()=>{
                try {
                    if(socket.currentRoom){
                        socket.leave(socket.currentRoom);
                        
                        console.log((socket.handshake.headers['x-forwarded-for'] || socket.handshake.address)+" leave room => "+socket.currentRoom);
                    }

                    await redisPartner.del_is_exist(socket.atk || '');
                } 
                catch (error) {
                    console.log(error);
                }
            });
        });
    },
    socket_io_json: socket_io_json,
};