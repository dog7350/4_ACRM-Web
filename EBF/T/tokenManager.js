const dotEnv = require('../CP/envHell');
const crypto = require('crypto-js');
const hashMaker = require('./hash');
const DBReserved = require('./dbReserved');

const encrypt = (plainData)=>{
    return crypto.AES.encrypt(plainData, dotEnv.AES_SECRET_KEY).toString();
}

const decrypt = (cipherData)=>{
    let result = crypto.AES.decrypt(cipherData, dotEnv.AES_SECRET_KEY).toString(crypto.enc.Utf8);
    return result;
}

module.exports = {
    makeToken: (plainJson, req)=>{
        plainJson.maketime = Date.now();
        plainJson.ip = req.headers['x-forwarded-for'] || req.ip;

        let signature = plainJson.id+plainJson.pw+plainJson.auth+plainJson.maketime+plainJson.ip;
        
        signature = hashMaker.makeHash(signature);
        plainJson.signature = signature;
        return encrypt(JSON.stringify(plainJson));
    },
    makeRegistToken: (plainJson, req)=>{
        plainJson.maketime = Date.now();
        plainJson.ip = req.headers['x-forwarded-for'] || req.ip;

        let signature = plainJson.id+plainJson.pw+plainJson.auth+plainJson.maketime+plainJson.ip;
        
        signature = hashMaker.makeHash(signature);
        plainJson.signature = signature;

        signature = hashMaker.makeHash(signature);

        return [encrypt(JSON.stringify(plainJson)), signature.slice(0, 3)+signature.slice(-3)];
    },
    /**
     * 
     * @param {} cipherJsonText 
     * @returns 0 이면 토큰이 맞지않음, 1 이면 토큰 유효기간이 끝남, 2 이면 해당ID가 DB에 존재하지 않거나 권한이 변경된 상태
     * , 3, 4 면 db처리중 문제발생, 5인경우 현재 정지된 상태, 6 이면 권한이 변경된 상태, 정상일 경우 Json으로 리턴
     */
    verifyToken: async (cipherJsonText, req)=>{
        let decryptJson = JSON.parse(decrypt(cipherJsonText));
        let signature = decryptJson.id+decryptJson.pw+decryptJson.auth+decryptJson.maketime+(req.headers['x-forwarded-for'] || req.ip);
        let dbResult = null, dbField = null;

        try{
            [dbResult, dbField] = await DBReserved.dynamic_select('count(*) as cnt', 'userinfo', `id='${decryptJson.id}' AND admin='${decryptJson.auth}'`);

            if(dbResult[0].cnt !== 1){
                decryptJson = 2;
            } else{
                try{
                    [dbResult, dbField] = await DBReserved.dynamic_select('*', dotEnv.BAN_TABLE, `id='${decryptJson.id}'`);

                    if(dbResult.length === 0 || dbResult[0].ban_type === 'x' ){
                        if(hashMaker.makeHash(signature) != decryptJson.signature){
                            decryptJson = 0;
                        }
                    } else{
                        decryptJson = 5;
                    }
                }
                catch (error){
                    decryptJson = 4;
                }
            }
        }
        catch (error){
            decryptJson = 3;
        }
        
        return decryptJson;
    },
    /**
     * 웹소켓용
     * @param {} cipherJsonText 
     * @returns 0 이면 토큰이 맞지않음, 1 이면 토큰 유효기간이 끝남, 2 이면 해당ID가 DB에 존재하지 않거나 권한이 변경된 상태
     * , 3, 4 면 db처리중 문제발생, 5인경우 현재 정지된 상태, 6 이면 권한이 변경된 상태, 정상일 경우 Json으로 리턴
     */
    verifyToken2: async (cipherJsonText, ip)=>{
        let decryptJson = JSON.parse(decrypt(cipherJsonText));
        let signature = decryptJson.id+decryptJson.pw+decryptJson.auth+decryptJson.maketime+ip;
        let dbResult = null, dbField = null;

        try{
            [dbResult, dbField] = await DBReserved.dynamic_select('count(*) as cnt', 'userinfo', `id='${decryptJson.id}' AND admin='${decryptJson.auth}'`);

            if(dbResult[0].cnt !== 1){
                decryptJson = 2;
            } else{
                try{
                    [dbResult, dbField] = await DBReserved.dynamic_select('*', dotEnv.BAN_TABLE, `id='${decryptJson.id}'`);

                    if(dbResult.length === 0 || dbResult[0].ban_type === 'x' ){
                        if(hashMaker.makeHash(signature) != decryptJson.signature){
                            decryptJson = 0;
                        }
                    } else{
                        decryptJson = 5;
                    }
                }
                catch (error){
                    decryptJson = 4;
                }
            }
        }
        catch (error){
            decryptJson = 3;
        }
        
        return decryptJson;
    },
    /**
     * DB조회를 안하고 토큰을 얻어내는 함수
     * @param {} cipherJsonText 
     * @returns 0 이면 토큰이 맞지않음, 1 이면 인증코드가 토큰과 맞지않음, 정상일 경우 Json으로 리턴
     */
    verifyRegistToken: async (cipherJsonText, req, mailSignature)=>{
        let decryptJson = JSON.parse(decrypt(cipherJsonText));
        let signature = decryptJson.id+decryptJson.pw+decryptJson.auth+decryptJson.maketime+(req.headers['x-forwarded-for'] || req.ip);

        signature = hashMaker.makeHash(signature);

        if(signature != decryptJson.signature){
            decryptJson = 0;
        }
        
        signature = hashMaker.makeHash(signature);
        signature = signature.slice(0, 3)+signature.slice(-3);

        if(signature != mailSignature){
            decryptJson = 1;
        }

        return decryptJson;
    },
    /**
     * 
     * @param {*} req 
     * @returns 리퀘스트로부터 토큰이 존재한다면 가져오고 없으면 null
     */
    getToken: (req)=>{
    let result = null;
        
        if(req.cookies.accessToken === null || req.cookies.accessToken === undefined){
            result = null;
        } else{
            result = req.cookies.accessToken;
        }

        return result;
    },
    tokenVerifyValue: (tokenValue, resultJson)=>{
        if(tokenValue === 0){
            resultJson.result = '토큰이 유효하지 않습니다. 다시 로그인하고 시도해주세요. - 0';
            resultJson.code = 400;
        } else if(tokenValue === 1){
            resultJson.result = '토큰의 유효기간이 지났습니다. 다시 로그인하고 시도해주세요. - 1';
            resultJson.code = 400;
        } else if(tokenValue === 2){
            resultJson.result = '확인되지 않은 토큰입니다.(권한이 변경됐을 수 있습니다.) 다시 로그인하고 시도해주세요. - 2';
            resultJson.code = 400;
        } else if(tokenValue === 3 || tokenValue === 4){
            resultJson.result = '토큰확인중 문제가 발생했습니다. 다시 로그인하고 시도해주세요. - 3 or 4';
            resultJson.code = 400;
        } else if(tokenValue === 5){
            resultJson.result = '정지된 계정이므로 로그아웃 합니다.';
            resultJson.code = 400;
        }
    }
};