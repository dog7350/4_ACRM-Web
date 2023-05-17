const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const maillSender = require('../../../T/mailsender');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');
const hashMaker = require('../../../T/hash');
const IMPORTER = require('../../../T/IMPORTER');
const crypto = require('crypto-js');
const { default: axios } = require('axios');
const tokenManager = require('../../../T/tokenManager');


module.exports = {
    mobile_pay_success_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = tokenManager.getToken(req);
        let importResponse = null;
        var PA1, PA2, PA3;

        var queryData = {
            merchant_uid: req.query.merchant_uid,
            imp_uid: req.query.imp_uid,
            name: req.query.name,
            orderName: req.query.ordername,
            phone: req.query.phone,
            email: req.query.email,
            address: req.query.addr,
            price: parseInt(req.query.price),
            imp_success: req.query.imp_success,
            custom_data: req.query.custom_data,
            next_url: req.query.next_url? req.query.next_url: '/main',
        };

        // console.log(req.ip);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await tokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                tokenManager.tokenVerifyValue(accessToken, result);
            } else{

                var uid_is_signature = commonFunction.changeStringFromBase64(queryData.custom_data);
                uid_is_signature = await crypto.AES.decrypt(uid_is_signature, dotEnv.AES_SECRET_KEY).toString(crypto.enc.Utf8);
                uid_is_signature = JSON.parse(uid_is_signature);

                if(uid_is_signature.id !== accessToken.id){
                    result.result = '주문한 ID가 로그인 중인 ID와 같지 않습니다.';
                    result.code = 400;
                } else{
                    if(queryData.imp_success != 'true'){
                        result.result = '결제 프로세스처리가 정상적으로 진행되지 않았습니다.';
                        result.code = 403;
                    } else{
                        try{
                            importResponse = await IMPORTER.orderCheck(queryData.imp_uid);
                            
                            if(importResponse === null){
                                result.result = '주문중 문제가 발생했습니다. (100)';
                                result.code = 500;
                            } else if(Number.isInteger(importResponse)){
                                if(importResponse === 404){
                                    result.result = '주문번호를 확인해주시기 바랍니다.';
                                    result.code = importResponse;
                                } else{
                                    result.result = '주문번호 등록중 문제가 발생했습니다. (100)';
                                    result.code = 500;
                                }
                            } else{
                                if(importResponse.response.status.indexOf('paid') === -1||
                                    queryData.price !== importResponse.response.amount ||
                                    queryData.imp_uid !== importResponse.response.imp_uid || 
                                    queryData.merchant_uid !== importResponse.response.merchant_uid){ 
                                    
                                    if(importResponse.response.status.indexOf('paid') === -1){
                                        result.result = '결제가 정상적으로 진행되지 않았습니다.';
                                        result.code = 450;
                                    } else if(queryData.price !== importResponse.response.amount){ // 결제금액과 충전금액이 일치하지 않음
                                        result.result = '결제금액과 충전금액이 일치하지 않습니다.';
                                        result.code = 450;
                                    } else if(queryData.imp_uid !== importResponse.response.imp_uid){ // 주문번호가 일치하지 않음
                                        result.result = '주문번호가 일치하지 않습니다.';
                                        result.code = 450;
                                    } else if(queryData.merchant_uid !== importResponse.response.merchant_uid){ // 가맹점 주문번호가 일치하지 않음
                                        result.result = '가맹점 주문번호가 일치하지 않습니다.';
                                        result.code = 450;
                                    }
                                } else{
                                    try{
                                        [dbresult, dbfield] = await dbReserved.dynamic_select('cuc.*', `${dotEnv.CASHHISTORY_UNION_CHARGELOG} as cuc`, `id='${accessToken.id}' AND imp_uid='${commonFunction.changeBase64FromString(queryData.imp_uid)}' AND merchant_uid='${commonFunction.changeBase64FromString(queryData.merchant_uid)}'`);

                                        if(dbresult === null){
                                            result.result = 'DB조회중 문제가 발생했습니다.';
                                        } else if(dbresult.length > 0){
                                            result.result = '이미 처리된 결제내역 입니다.';
                                        } else{
                                            PA1 = dotEnv.CASH_HISTORY_TABLE;
                                            PA2 = '(id, ip, type, price)';
                                            PA3 = `'${accessToken.id}', '${req.headers['x-forwarded-for'] || req.ip}', '1w', ${queryData.price}`;
                                            [dbresult, dbfield] = await dbReserved.dynamicRInsert(PA1, PA2, PA3);
                    
                                            if(dbresult === null || dbresult.affectedRows === 0){
                                                throw new Error('결제내역 작성중 오류발생');
                                            }
                    
                                            PA1 = dotEnv.CHARGE_LOG_TABLE;
                                            PA2 = '(chindex, imp_uid, order_name, merchant_uid, res_email, res_phone, res_address)';
                                            PA3 = `${dbresult.insertId}, '${commonFunction.changeBase64FromString(queryData.imp_uid)}', '${queryData.orderName}', '${commonFunction.changeBase64FromString(queryData.merchant_uid)}', '${queryData.email}', '${queryData.phone}', '${queryData.address}'`;
                                            [dbresult, dbfield] = await dbReserved.dynamicRInsert(PA1, PA2, PA3);
                    
                                            if(dbresult === null || dbresult.affectedRows === 0){
                                                throw new Error('결제내역 작성중 오류발생');
                                            } else{
                                                result.result = '결제에 성공했습니다.';
                                                result.code = 200;
                                            }
                                        }
                                    } catch(error){
                                        console.log(error);
                                        result.result = '결제내역 작성중 오류가 발생했습니다.';
                                        result.code = 500;
                                    }
                                }    
                            }
                             
                        }
                        catch(error){
                            console.log(error);
                
                            result.result = '주문번호 등록중 문제가 발생했습니다. (101)';
                            result.code = 400;
                        }
                    }
                }
            }
        }

        if(result.code > 200 && accessToken && !Number.isInteger(accessToken) && accessToken.id && req.query && req.query.imp_uid && req.query.merchant_uid){
            [dbresult, dbfield] = await dbReserved.dynamic_select('cuc.*', `${dotEnv.CASHHISTORY_UNION_CHARGELOG} as cuc`, `id='${accessToken.id}' AND imp_uid='${commonFunction.changeBase64FromString(queryData.imp_uid)}' AND merchant_uid='${commonFunction.changeBase64FromString(queryData.merchant_uid)}'`);

            if(dbresult === null){
                result.result = 'DB조회중 문제가 발생했습니다.';
            } else if(dbresult.length === 0){
                importResponse = await IMPORTER.cancleOrder(req.query.imp_uid, req.query.merchant_uid);
                console.log("결제취소성공");
            } else{
                result.result = '이미 처리된 결제내역 입니다.';
            }
        }

        // commonFunction.sendResult(res, result);
        // console.log(`before ==> ${queryData.next_url}`, req.query.next_url);

        if(queryData.next_url.indexOf('_____') != -1){

            while(queryData.next_url.indexOf('_____') != -1) queryData.next_url = queryData.next_url.replace('_____', '&');
            while(queryData.next_url.indexOf('____') != -1) queryData.next_url = queryData.next_url.replace('____', '=');
            while(queryData.next_url.indexOf('___') != -1) queryData.next_url = queryData.next_url.replace('___', '?');
            while(queryData.next_url.indexOf('__') != -1) queryData.next_url = queryData.next_url.replace('__', '/');
            
            res.cookie(
                'mobilePurchase',
                queryData.next_url,
                {
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                    httpOnly: false,
                }
            );
        }

        // console.log(`after ==> ${queryData.next_url}`, req.query.next_url);

        res.redirect(queryData.next_url);
    }
};