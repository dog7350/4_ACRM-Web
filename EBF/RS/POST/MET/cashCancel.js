const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const crypto = require('crypto-js');
const IMPORTER = require('../../../T/IMPORTER');
const { default: axios } = require('axios');

module.exports = {
    cancle_pay_f: async(req, res)=>{
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
                result.result = '고유번호와 주문번호 모두를 포함하여 호출해야합니다.';
                result.code = 400;
            } else{
                try {
                    if(req.body && (req.body.merchant_uid || req.body.imp_uid)){ 
                        var bodyData = { 
                            merchant_uid: commonFunction.base64RegCheck(req.body.merchant_uid)? req.body.merchant_uid: false, 
                            imp_uid: commonFunction.base64RegCheck(req.body.imp_uid)? req.body.imp_uid: false, 
                        };
                        
                        PA1 = '*';
                        PA2 = `${dotEnv.CASHHISTORY_UNION_CHARGELOG} as cuc`;
        
                        if(bodyData.merchant_uid && bodyData.imp_uid || bodyData.imp_uid) PA3 = `cuc.id='${accessToken.id}' AND cuc.imp_uid='${bodyData.imp_uid}' AND cuc.merchant_uid='${bodyData.merchant_uid}'`;
                        else if(bodyData.merchant_uid) PA3 = `cuc.id='${accessToken.id}' AND cuc.merchant_uid='${bodyData.merchant_uid}'`;
                        else if(bodyData.imp_uid) PA3 = `cuc.id='${accessToken.id}' AND cuc.imp_uid='${bodyData.imp_uid}'`;
                        else{
                            PA3 = "cuc.imp_uid='plpdlm'";
                        }
        
                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '실행중 오류가 발생했습니다. (101)';
                            result.code = 500;
                        } else if(dbresult.length === 0){
                            result.result = '결제내역이 존재하지 않습니다. 주문번호나 고유번호를 확인해주세요.';
                            result.code = 400;
                        } else{
                            try{
                                if(dbresult[0].id !== accessToken.id){
                                    result.result = '결제내역에 접근할 권한이 없습니다.';
                                    result.code = 400;
                                } else if(dbresult[0].type === '1c'){
                                    result.result = '이미 취소된 결제내역입니다.';
                                    result.code = 400;
                                } else{
                                    var chindex = dbresult[0].chindex;
                                    var chargePrice = dbresult[0].price;
                                    var tempImpUid = commonFunction.changeStringFromBase64(dbresult[0].imp_uid);
                                    var tempMerchantUid = commonFunction.changeStringFromBase64(dbresult[0].merchant_uid);

                                    PA1 = '*';
                                    PA2 = 'userinfo';
                                    PA3 = `id='${accessToken.id}'`;

                                    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                                    if(dbresult === null){
                                        result.result = '실행중 오류가 발생했습니다. (101)';
                                        result.code = 500;
                                    } else if(dbresult.length === 0){
                                        result.result = '아이디가 존재하지 않습니다.';
                                        result.code = 400;
                                    } else{
                                        if(chargePrice <= dbresult[0].cash){
                                            var importResult = await IMPORTER.cancleOrder(tempImpUid, tempMerchantUid);

                                            if(importResult === null){
                                                result.result = '결제를 취소하는 중 문제가 발생했습니다. (109)';
                                                result.code = 500;
                                            } else if(importResult === 401){
                                                result.result = '결제를 취소하는 중 문제가 발생했습니다. (105)';
                                                result.code = 500;
                                            } else{
                                                if(importResult.code === 0){ // 결제 취소 성공
                                                    PA1 = dotEnv.CASH_HISTORYTABLE;
                                                    PA2 = "type='1c'";
                                                    PA3 = `chindex=${chindex}`;
                
                                                    [dbresult, dbfield] = await DBReserved.dynamic_update(PA1, PA2, PA3);

                                                    if(dbresult === null){
                                                        result.result = '결제를 취소하는 중 문제가 발생했습니다. (111)';
                                                        result.code = 500;
                                                    } else if(dbresult === 0){
                                                        result.result = '결제를 취소하는 중 문제가 발생했습니다. (115)';
                                                        result.code = 500;
                                                    } else{
                                                        PA1 = 'userinfo';
                                                        PA2 = `cash=cash-${chargePrice}`;
                                                        PA3 = `id='${accessToken.id}'`;

                                                        [dbresult, dbfield] = await DBReserved.dynamic_update(PA1, PA2, PA3);

                                                        if(dbresult === null){
                                                            result.result = '결제를 취소하는 중 문제가 발생했습니다. (120)';
                                                            result.code = 500;
                                                        } else if(dbresult === 0){
                                                            result.result = '결제를 취소하는 중 문제가 발생했습니다. (121)';
                                                            result.code = 500;
                                                        } else{
                                                            result.result = '결제를 취소했습니다.';
                                                            result.code = 200;
                                                        }
                                                    }
                                                } else{ // 이미 취소된 결제
                                                    result.result = importResult.message;
                                                    result.code = 400;
                                                }
                                            }
                                        } else{
                                            result.result = '현재 잔액이 부족하여 결제를 취소할 수 없습니다.';
                                            result.code = 400;
                                        }
                                    }
                                } 
                            }
                            catch(error){
                                console.log(error);
            
                                result.result = '결제를 취소하는 중 문제가 발생했습니다. (107)';
                                result.code = 500;
                            }
                        }
                    } else{
                        result.result = '결제를 취소하기 위해서는 주문번호나 고유번호를 입력해야 합니다.';
                        result.code = 400;
                    }
                }
                catch (error) {
                    console.log(error);
                    result.result = '결제 취소중 문제가 발생했습니다. (100)';
                    result.code = 500;
                }
            }
        } else {
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};