const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');

const mongoPartner = require('../../../T/mongooseDir/mongoPartner');

module.exports = {
    get_game_chat: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let query = req.query ?? {whereCond: null, selectCond: null, etcCond: null};
        let accessToken = TokenManager.getToken(req);

        try {
            if(accessToken){
                accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    if(['m', 'o'].indexOf(accessToken.auth) != -1){
                        if((await mongoPartner.mongooseState()).state === 1){
                            let 
                                isFindChatOk = true, 
                                where = { $and: [{}], $or: [{}]}, 
                                select = {}, 
                                etc = {};

                            if(query.user ?? false) { // 유저 r == regex, e == eq
                                let value = query.user.split('___').filter((val)=>{
                                    return val.length > 1;
                                }).map((val)=>{
                                    let val0 = val[0] == '=';
                                    val = val.substr(1);

                                    if(val0){
                                        return {'id': {
                                            $eq: val
                                        }};
                                    } else{
                                        return {'id': {
                                            $ne: val
                                        }};
                                    }
                                });

                                where.$and.push(...value);
                            }

                            if(query.updateDate){ // 수정날짜 조회
                                if(query.start && query.end){ // 시작 끝 범위 있을 때

                                } else if(query.start ?? false) {

                                } else{
                                    where.$and.push({updatedAt: {$gt: new Date(Date.now()-90*24*60*60*1000)}});
                                }
                            } else{ // 생성날짜 조회
                                let value = {createdAt: {$gt: new Date(Date.now()-90*24*60*60*1000)}};

                                if(query.start && query.end){ // 시작 끝 범위 있을 때
                                    value.createdAt.$gt = query.start;
                                    where.$and.push({createdAt: {$lte: query.end}});

                                } else if(query.start ?? false) {
                                    value.createdAt.$gt = query.start;
                                }

                                where.$and.push(value);
                            }

                            if(query.cmd ?? false){ // 명령 전체 조회
                                if(query.cmd == 0){
                                    where.$and.push({cmd: '/lobby'});
                                } else if(query.cmd == 1){
                                    where.$and.push({cmd: '/w'});
                                } else if(query.cmd == 2){
                                    where.$and.push({cmd: '/room'});
                                }

                                if(query.opt ?? false){ // 명령 전체 조회
                                    where.$and.push({cmd: {$eq: query.opt}});
                                }
                            } else{
                                if(query.roomName ?? false){
                                    where.$and.push({cmd: '/lobby'});
                                    where.$and.push({opt: {$eq: query.roomName}});
                                } else if(query.whisper ?? false){
                                    where.$and.push({cmd: '/w'});
                                    where.$and.push({opt: {$eq: query.whisper}});
                                } else if(query.lobby ?? false){
                                    where.$and.push({cmd: '/room'});
                                    where.$and.push({opt: {$eq: query.lobby}});
                                } else{
    
                                }
                            }

                            if(query.content ?? false){ // ___='seper'
                                // let isEqOrReg = query.filterContent[0];
                                let filterItems = query.content.split('___').filter((val)=>{
                                    if(val.length > 1 && (val[0] == '-' || val[0] == '=')) return val;
                                });

                                where.$and.push(...(filterItems.map((val)=>{
                                    let val0 = val[0] == '=';
                                    val = val.substr(1);

                                    if(val0){
                                        return {
                                            content: {$regex : val}
                                        };
                                    } else{
                                        return {
                                            content: {$ne : val}
                                        };
                                    }
                                })));
                            }

                            if(query.order ?? false){
                                if(query.order == 1){
                                    etc = {sort: {updatedAt: -1, createdAt: -1}};
                                } else{
                                    etc = {sort: {createdAt: -1, updatedAt: -1}};
                                }
                            }

                            // console.log(where.$and);
                            // console.log(where.$or);

                            if(isFindChatOk)
                                result.result.push(...(await mongoPartner.findChat(where, select, etc)));
                        } else{
                            result.result = '조회중 문제가 발생했습니다. (101)';
                            result.code = 500;
                        }
                    } else{
                        result.result = '조회할 권한이 없습니다.';
                        result.code = 400;
                    }
                }
            } else{
                result.result = '로그인 후 이용하실 수 있는 서비스입니다.';
                result.code = 400;
            }
        }
        catch(e){
            console.log(e);
            
            result.result = '채팅 내역을 가져오는데 실패했습니다.';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    }
}