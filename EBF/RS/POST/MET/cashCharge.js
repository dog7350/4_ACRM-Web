const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const maillSender = require('../../../T/mailsender');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');
const hashMaker = require('../../../T/hash');
const IMPORTER = require('../../../T/IMPORTER');
const crypto = require('crypto-js');
const { default: axios } = require('axios');
const socketPartner = require('../../../T/socket/socketPartner');


const resultHookMehtod = ()=>{

}

module.exports = {
    request_uid_f: async (req, res)=>{ // body.id, body.email
        let result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;

        if(accessToken !== null){
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(!req.body || !req.body.price || !req.body.phone){
                result.result = '금액 또는 휴대폰 번호를 인자로 넘겨야 합니다.';
                result.code = 400;
            } else{
                var bodyData = {
                    price: req.body.price? req.body.price: null,
                    email: req.body.email? req.body.email: '',
                    phone: req.body.phone? req.body.phone: '',
                    address: req.body.address? req.body.address: '',
                };
                
                if(!Number.isInteger(parseInt(bodyData.price))){
                    result.result = '금액은 숫자만 입력할 수 있습니다.';
                    result.code = 400;
                } else if(parseInt(bodyData.price) <= 0){
                    result.result = '충전금액은 0 보다 커야합니다.';
                    result.code = 400;
                } else if(parseInt(bodyData.price) > 1000000){
                    result.result = '충전 금액은 1000000보다 작아야 합니다.';
                    result.code = 400;
                } else if(!commonFunction.phoneRegCheck(bodyData.phone)){
                    result.result = '휴대폰 번호를 확인해주세요.';
                    result.code = 400;
                } else{
                    bodyData.price = parseInt(bodyData.price);

                    // console.log(bodyData);
                    bodyData.id = accessToken.id;
                    bodyData.ip = req.headers['x-forwarded-for'] || req.ip;
                    bodyData.timeStamp = Date.now();

                    var uid_is_signature = null;
                    
                    try{
                        uid_is_signature = await crypto.AES.encrypt(JSON.stringify(bodyData), dotEnv.AES_SECRET_KEY).toString();

                        result.result = commonFunction.changeBase64FromString(uid_is_signature);
                        result.code = 200;
                    }
                    catch(error){
                        console.log(error);

                        result.result = '주문번호 생성중 문제가 발생했습니다.';
                        result.code = 400;
                    } 
                }
            }
        } else {
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    pay_success_f: async(req, res)=>{
        let result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;

        if(accessToken !== null){
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(!req.body || !req.body.merchant_uid || !req.body.imp_uid){
                result.result = '결제번호와 주문번호 모두를 포함하여 호출해야합니다.';
                result.code = 400;
            } else{
                var bodyData = {
                    custom_data: req.body.merchant_uid,
                    merchant_uid: req.body.merchant_uid.substring(0, 39),
                    imp_uid: req.body.imp_uid,
                    name: req.body.name,
                    orderName: req.body.orderName,
                    phone: req.body.phone,
                    email: req.body.email,
                    address: req.body.address,
                    price: req.body.price,
                };
                
                var uid_is_signature = commonFunction.changeStringFromBase64(bodyData.custom_data);
                uid_is_signature = await crypto.AES.decrypt(uid_is_signature, dotEnv.AES_SECRET_KEY).toString(crypto.enc.Utf8);
                uid_is_signature = JSON.parse(uid_is_signature);

                try{
                    if(uid_is_signature.id !== accessToken.id){
                        result.result = '주문한 ID가 로그인 중인 ID와 같지 않습니다.';
                        result.code = 400;
                    } else{
                        importResponse = await IMPORTER.orderCheck(bodyData.imp_uid);

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
                            if(importResponse.response.status !== 'paid'||
                                bodyData.price !== importResponse.response.amount ||
                                bodyData.imp_uid !== importResponse.response.imp_uid || 
                                bodyData.merchant_uid !== importResponse.response.merchant_uid){ 

                                if(importResponse.response.status !== 'paid'){
                                    result.result = '결제가 정상적으로 진행되지 않았습니다.';
                                    result.code = 450;
                                } else if(bodyData.price !== importResponse.response.amount){ // 결제금액과 충전금액이 일치하지 않음
                                    result.result = '결제금액과 충전금액이 일치하지 않습니다.';
                                    result.code = 450;
                                } else if(bodyData.imp_uid !== importResponse.response.imp_uid){ // 주문번호가 일치하지 않음
                                    result.result = '주문번호가 일치하지 않습니다.';
                                    result.code = 450;
                                } else if(bodyData.merchant_uid !== importResponse.response.merchant_uid){ // 가맹점 주문번호가 일치하지 않음
                                    result.result = '가맹점 주문번호가 일치하지 않습니다.';
                                    result.code = 450;
                                }
                            } else{
                                // PA1 = dotEnv.CASH_CHARGE_TABLE;
                                // PA2 = '(id, ip, imp_uid, order_name, merchant_uid, res_email, res_phone, res_address, charge_price)';
                                // PA3 = `'${accessToken.id}', '${req.headers['x-forwarded-for'] || req.ip}', '${commonFunction.changeBase64FromString(bodyData.imp_uid)}', '${bodyData.orderName}', '${commonFunction.changeBase64FromString(bodyData.merchant_uid)}', '${bodyData.email}', '${bodyData.phone}', '${bodyData.address}', ${bodyData.price}`;
                                // [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);

                                try{
                                    PA1 = dotEnv.CASH_HISTORY_TABLE;
                                    PA2 = '(id, ip, type, price)';
                                    PA3 = `'${accessToken.id}', '${req.headers['x-forwarded-for'] || req.ip}', '1w', ${bodyData.price}`;
                                    [dbresult, dbfield] = await dbReserved.dynamicRInsert(PA1, PA2, PA3);

                                    if(dbresult === null || dbresult.affectedRows === 0){
                                        throw new Error('결제내역 작성중 오류발생');
                                    }

                                    PA1 = dotEnv.CHARGE_LOG_TABLE;
                                    PA2 = '(chindex, imp_uid, order_name, merchant_uid, res_email, res_phone, res_address)';
                                    PA3 = `${dbresult.insertId}, '${commonFunction.changeBase64FromString(bodyData.imp_uid)}', '${bodyData.orderName}', '${commonFunction.changeBase64FromString(bodyData.merchant_uid)}', '${bodyData.email}', '${bodyData.phone}', '${bodyData.address}'`;
                                    [dbresult, dbfield] = await dbReserved.dynamicRInsert(PA1, PA2, PA3);

                                    if(dbresult === null || dbresult.affectedRows === 0){
                                        throw new Error('결제내역 작성중 오류발생');
                                    } else{
                                        result.result = '결제에 성공했습니다.';
                                        result.code = 200;
                                    }
                                } catch(error){
                                    console.log(error);
                                    result.result = '결제내역 작성중 오류가 발생했습니다.';
                                    result.code = 500;
                                }
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
        } else {
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        // if(result.code > 200){
        //     console.log("결제취소");

        //     if(req.body && req.body.imp_uid || req.body.merchant_uid){
        //         console.log("결제취소성공");
        //         importResponse = await IMPORTER.cancleOrder(req.body.imp_uid, req.body.merchant_uid);
        //     }
        // }

        if(result.code > 200 && accessToken && !Number.isInteger(accessToken) && accessToken.id && req.body && req.body.imp_uid && req.body.merchant_uid){
            [dbresult, dbfield] = await dbReserved.dynamic_select('cuc.*', `${dotEnv.CASHHISTORY_UNION_CHARGELOG} as cuc`, `id='${accessToken.id}' AND imp_uid='${commonFunction.changeBase64FromString(req.body.imp_uid)}' AND merchant_uid='${commonFunction.changeBase64FromString(req.body.merchant_uid)}'`);

            if(dbresult === null){
                result.result = 'DB조회중 문제가 발생했습니다.';
            } else if(dbresult.length === 0){
                importResponse = await IMPORTER.cancleOrder(req.body.imp_uid, req.body.merchant_uid);
                console.log("결제취소성공");
            } else{
                result.result = '이미 처리된 결제내역 입니다. 관리자에게 문의해주세요.';
            }
        }

        commonFunction.sendResult(res, result);
    },
    pay_result_hook_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        };

        var itemJson = null;
        var ip = req.headers['x-forwarded-for'] || req.ip;
        itemJson = Object.assign({}, req.body);
        
        if(['52.78.100.19', '52.78.48.223', '52.78.5.241'].indexOf(ip) != -1){
            if(itemJson.status === "paid"){
                setTimeout(async ()=>{
                    var result = true;
                    let dotEnv = require('../../../CP/envHell');
                    let chindex = null;
                    try{
                        console.log('Hook 시작');
                        var tempItemJson = itemJson;
                        var dbr, dbf, dbrTemp;
        
                        var id = null;
                        var price = null;
        
                        var tempMerchant_uid = commonFunction.changeBase64FromString(tempItemJson.merchant_uid);

                        [dbr, dbf] = await dbReserved.dynamic_select('*', `${dotEnv.CASHHISTORY_UNION_CHARGELOG} as cuc`, `cuc.merchant_uid='${tempMerchant_uid}'`);
                        
                        if(dbr && dbr.length === 1 && dbr[0]['type'] === '1w'){
                            dbrTemp = dbr[0];

                            chindex = dbr[0]['chindex'];
                            id = dbr[0]['id'];
                            price = dbr[0]['price'];
        
                            [dbr, dbf] = await dbReserved.dynamic_update(dotEnv.CASH_HISTORY_TABLE, "type='1d'", `chindex=${chindex}`);
        
                            if (dbr && dbr === 1){
                                [dbr, dbf] = await dbReserved.dynamic_update('userinfo', `cash=cash+${price}`, `id='${id}'`);
        
                                console.log(`충전완료 충전한 ID=${id}, 충전금액=${price}`);
                                result = false;

                                let items = ["모자란 금액 충전", "현금 결제"];

                                items.forEach((item)=>{
                                    if(dbrTemp['order_name'].indexOf(item) != -1){
                                        socketPartner.socket_io_json.socket_io.emit(`buy_now_${dbrTemp['id']}`, {result: 'go'});
                                    }
                                })
                            }
                        } else{
                            console.log(`충전실패`);
                        }
                    } catch(error){
                        console.log(error);
                    }

                    if(result){
                        try{
                            await IMPORTER.cancleOrder(itemJson.imp_uid, itemJson.merchant_uid);

                            if(chindex){
                                [dbr, dbf] = await dbReserved.dynamic_update(dotEnv.CASH_HISTORY_TABLE, "type='1c'", `chindex=${chindex}`);
                            }
                        }
                        catch(error){
                            console.log(error);
                        }
                    }
                }, 4000);
                result.result = '충전훅';
                result.code = 200;
            } else if(itemJson.status === "cancelled"){
                var tempItemJson = itemJson;
                var tempMerchant_uid = commonFunction.changeBase64FromString(tempItemJson.merchant_uid);
                var tempImp_uid = commonFunction.changeBase64FromString(tempItemJson.imp_uid);

                [dbresult, dbfield] = await dbReserved.dynamic_select('*', `${dotEnv.CASHHISTORY_UNION_CHARGELOG} as cuc`, `cuc.merchant_uid='${tempMerchant_uid}'`);

                    if(dbresult && dbresult.length === 1 && dbresult[0]['type'] !== '1c'){
                        let chindex = dbresult[0]['chindex'];
                        let id = dbresult[0]['id'];
                        let price = dbresult[0]['price'];

                        [dbresult, dbfield] = await dbReserved.dynamic_select('*', "userinfo", `id='${id}'`);

                        if(dbresult && dbresult.length === 1 && (dbresult[0].cash >= price)){
                            [dbresult, dbfield] = await dbReserved.dynamic_update('userinfo', `cash=cash-${price}`, `id='${id}'`);

                            if(dbresult && dbresult === 1){
                                [dbresult, dbfield] = await dbReserved.dynamic_update(dotEnv.CASH_HISTORY_TABLE, "type='1c'", `chindex=${chindex}`);

                                if(dbresult && dbresult === 1){
                                    result.result = '결제를 성공적으로 취소했습니다.';
                                    result.code = 200;
                                } else if(dbresult === null){
                                    result.result = '취소중 문제가 발생했습니다. (102)';
                                    result.code = 400;
                                } else{
                                    result.result = '취소중 문제가 발생했습니다. (103)';
                                    result.code = 400;
                                }
                            } else if(dbresult === null){
                                result.result = '취소중 문제가 발생했습니다.';
                                result.code = 400;
                            } else{
                                result.result = '취소중 문제가 발생했습니다. (101)';
                                result.code = 400;
                            }
                        } else{
                            result.result = '잔액이 모자라 취소를 진행하지 못했습니다.';
                            result.code = 400;
                        }
                    }
            } else{
                result.result = `${req.body.status}훅`;
                result.code = 200;
            }
        } else{
            result.result = '404 Not Found';
            result.code = 404;
        }
        
        commonFunction.sendResult(res, result);
    },
};