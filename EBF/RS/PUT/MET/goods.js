const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const dbReserved = require('../../../T/dbReserved');
const socketPartner = require('../../../T/socket/socketPartner');




module.exports = {
    update_goods_stat_f: async (req, res)=>{
        var result = {
            result: null,
            code: 200
        };

        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        let PA1, PA2, PA3;


        try{
            if(accessToken === null){
                result.result = '로그인이 필요한 서비스입니다.';
                result.code = 400;
            } else{
                accessToken = await TokenManager.verifyToken(accessToken, req);
    
                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    if(req.body){
                        if(req.body.goodsLogNumber !== null && req.body.goodsLogNumber !== undefined && Number.isInteger(parseInt(req.body.goodsLogNumber)) && parseInt(req.body.goodsLogNumber) > 0){
                            if(req.body.status !== null && req.body.status !== undefined && Number.isInteger(parseInt(req.body.status)) && parseInt(req.body.status) >= 0){
                                PA1 = `*, (SELECT email FROM moreinfo WHERE id=glt.purchaser) as email, (SELECT address FROM moreinfo WHERE id=glt.purchaser) as baseAddress, (SELECT phone FROM moreinfo WHERE id=glt.purchaser) as phone, (SELECT name FROM moreinfo WHERE id=glt.purchaser) as purName`;
                                PA2 = `${dotEnv.GOODS_LOG_TABLE} as glt`;
                                PA3 = `goodsLogNumber=${req.body.goodsLogNumber} AND uploader='${accessToken.id}'`;

                                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                if(dbresult === null){
                                    result.result = '상품 배송 정보 변경 중 문제가 발생했습니다. (100)';
                                    result.code = 500;
                                } else{
                                    if(dbresult.length !== 0){
                                        let tempItem = {
                                            ...dbresult[0]
                                        }

                                        if(tempItem.productStatus >= 20){
                                            result.result = '이미 처리가 완료된 배송정보 입니다.';
                                            result.code = 400;
                                        } else{
                                            PA1 = `*`;
                                            PA2 = `${dotEnv.GOODS_TABLE} as gt`;
                                            PA3 = `gt.goodsNumber=${tempItem.goodsNumber}`;
    
                                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
                                            if(dbresult === null){
                                                result.result = '상품 배송 정보 변경 중 문제가 발생했습니다. (101)';
                                                result.code = 500;
                                            } else{
                                                if(dbresult.length !== 0){
    
                                                    let defaultMessage = '';
                                                    let stat = parseInt(req.body.status);
                                                    let currentTime = new Date().toISOString().split('.')[0].replace('T', ' ');
                                                    let currentPrice = parseInt(tempItem.numberOfProduct) * dbresult[0].price;
    
                                                    // switch(stat){
                                                    //     case 0: defaultMessage = `[${currentTime}] 상품 [${dbresult[0].goodsName}] 배송이 접수되었습니다.`; break;
                                                    //     case 1: defaultMessage = `[${currentTime}] 상품 [${dbresult[0].goodsName}] 을(를) 준비중입니다.`; break;
                                                    //     case 2: defaultMessage = `[${currentTime}] 상품 [${dbresult[0].goodsName}] 출고를 준비중입니다.`; break;
                                                    //     case 3: defaultMessage = `[${currentTime}] 상품 [${dbresult[0].goodsName}] 배송을 시작했습니다.`; break;
                                                    //     case 20: defaultMessage = `[${currentTime}] 상품 [${dbresult[0].goodsName}] 배송을 완료했습니다.`; break;
                                                    //     case 22: defaultMessage = `[${currentTime}] 상품 [${dbresult[0].goodsName}] 접수가 취소됐습니다.`; break;
                                                    // }
                                                    
                                                    switch(stat){
                                                        case 0: defaultMessage = `상품 [${dbresult[0].goodsName}] 배송이 접수되었습니다.`; break;
                                                        case 1: defaultMessage = `상품 [${dbresult[0].goodsName}] 을(를) 준비중입니다.`; break;
                                                        case 2: defaultMessage = `상품 [${dbresult[0].goodsName}] 출고를 준비중입니다.`; break;
                                                        case 3: defaultMessage = `상품 [${dbresult[0].goodsName}] 배송을 시작했습니다.`; break;
                                                        case 20: defaultMessage = `상품 [${dbresult[0].goodsName}] 배송을 완료했습니다.`; break;
                                                        case 22: defaultMessage = `상품 [${dbresult[0].goodsName}] 접수가 취소됐습니다.`; break;
                                                    }

                                                    PA1 = `${dotEnv.GOODS_LOG_TABLE}`;
                                                    PA2 = `productStatus=${stat}`; 
                                                    PA3 = `goodsLogNumber=${req.body.goodsLogNumber} AND uploader='${accessToken.id}'`;
                                                    
                                                    [dbresult, dbfield] = await DBReserved.dynamic_update(PA1, PA2, PA3);
            
                                                    if(dbresult === null){
                                                        result.result = '상품 배송 정보 변경 중 문제가 발생했습니다. (102)';
                                                        result.code = 500;
                                                    } else if(stat == 22){
                                                        PA1 = `userinfo`;
                                                        PA2 = `cash=cash+${currentPrice}`; 
                                                        PA3 = `id='${tempItem.purchaser}'`;
                                                        
                                                        [dbresult, dbfield] = await DBReserved.dynamic_update(PA1, PA2, PA3);
    
                                                        if(dbresult === null){
                                                            result.result = '상품 배송 정보 변경 중 문제가 발생했습니다. (103)';
                                                            result.code = 500;
                                                        }
                                                    }
    
                                                    if(result.code === 500){
    
                                                    } else{
                                                        let receiverMsg = {
                                                            type: 300,
                                                            content: commonFunction.changeBase64FromString(`${defaultMessage}${req.body.message? ` (${req.body.message})`: ``}`),
                                                        };
                
                                                        PA1 = 'communitynotifi';
                                                        PA2 = "(publisher, receiver, content)"; 
                                                        PA3 = `'${accessToken.id}', '${tempItem.purchaser}', '${JSON.stringify(receiverMsg)}'`;
                                                        
                                                        [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);
                        
                                                        socketPartner.socket_io_json.socket_io.to(tempItem.purchaser).emit('create_notifi', receiverMsg);

                                                        result.result = '배송 정보 업데이트에 성공했습니다.';
                                                        result.code = 200;
                                                    }                                 
                                                } else{
                                                    result.result = '존재하지 않는 배송 상품입니다.';
                                                    result.code = 400;
                                                }
                                            }
                                        }
                                    } else{
                                        result.result = '존재하지 않는 배송 정보입니다.';
                                        result.code = 400;
                                    }
                                }

                            } else{
                                result.result = '상품 배송 정보를 업데이트 하기위한 상태번호를 다시 입력해주세요.';
                                result.code = 400;
                            }
                        } else{
                            result.result = '상품 배송 정보를 업데이트 하기위한 번호를 다시 입력해주세요.';
                            result.code = 400;
                        }
                    } else{
                        result.result = '상품 배송 정보를 업데이트 하기위한 데이터가 부족합니다.';
                        result.code = 400;
                    }
                }
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품 배송 정보 변경 중 문제가 발생했습니다. (104)';
            result.code = 500;
        }

        
        commonFunction.sendResult(res, result);
    }
}