const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const dbReserved = require('../../../T/dbReserved');

module.exports = {
    purchase_whatever_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;
        let PA1, PA2, PA3;
        

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                if(req.query && Number.isInteger(parseInt(req.query.num)) && Number.isInteger(parseInt(req.query.type)) && (parseInt(req.query.type) >= 0 && parseInt(req.query.type) <= 1)){
                    var num = parseInt(req.query.num);
                    var type = parseInt(req.query.type);
                    var productName = '';

                    var numName = '';
                    var useTableName = '';
                    var infoTableName = '';

                    var isCashUse = false;
                    var priceValue = 0;

                    if(type === 0){ // gun
                        numName = 'gnum';
                        productName = 'gname';
                        useTableName = 'usegun';
                        infoTableName = 'guninfo';
                    } else if(type === 1){ // car
                        numName = 'cnum';
                        productName = 'cname';
                        useTableName = 'usecar';
                        infoTableName = 'carinfo';
                    } else{

                    }

                    PA1 = '*';
                    PA2 = infoTableName;
                    PA3 = `${numName}=${num}`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){
                        result.result = '상품 구매중 문제가 발생했습니다. (100)';
                        result.code = 500;
                    } else if(dbresult.length === 0){
                        result.result = '존재하지 않는 상품입니다.';
                        result.code = 400;
                    } else{ // 무기 있음
                        productName = dbresult[0][productName];
                        isCashUse = dbresult[0].cash === 'o';
                        priceValue = dbresult[0].price;

                        PA1 = '*';
                        PA2 = useTableName;
                        PA3 = `${numName}=${num} AND id='${accessToken.id}'`;
    
                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = `${productName} 구매중 문제가 발생했습니다. (101)`;
                            result.code = 500;
                        } else if(dbresult.length === 1){
                            result.result = `${productName}은(는) 이미 구매한 상품입니다.`;
                            result.code = 400;
                        } else{ // 무기 구매한적 없음
                            PA1 = '*';
                            PA2 = 'userinfo';
                            PA3 = `id='${accessToken.id}'`;
        
                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = `${productName} 구매중 문제가 발생했습니다. (102)`;
                                result.code = 500;
                            } else if(dbresult.length === 0){
                                result.result = `${productName} 구매중 문제가 발생했습니다. 다시 로그인하고 진행해주세요.`;
                                result.code = 400;
                            } else{ // 현재 남은돈 확인
                                // console.log(dbresult[0].id, dbresult[0].cash, (isCashUse && dbresult[0].cash >= priceValue), dbresult[0].money, (!isCashUse && dbresult[0].money >= priceValue));
                                if((isCashUse && dbresult[0].cash >= priceValue) || (!isCashUse && dbresult[0].money >= priceValue)){
                                    var tempName = isCashUse?'cash':'money';
                                    PA1 = 'userinfo';
                                    PA2 = `${tempName}=${tempName}-${priceValue}`;
                                    PA3 = `id='${accessToken.id}' AND ${tempName}>=${priceValue}`;
            
                                    [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                                    if(dbresult === null){
                                        result.result = `${productName} 구매중 문제가 발생했습니다. (103)`;
                                        result.code = 500;
                                    } else if(dbresult === 0){
                                        result.result = `${productName} 구매가 취소되었습니다.`;
                                        result.code = 400;
                                    } else{
                                        PA1 = useTableName;
                                        PA2 = '';
                                        PA3 = `'${accessToken.id}', ${num}`;
                
                                        [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);

                                        if(dbresult === null || dbresult === 0){ // 결제 후 구매실패
                                            result.result = `${productName} 구매가 취소되었습니다. 잠시후 다시 시도해주세요.`;
                                            result.code = 500;

                                            PA1 = 'userinfo';
                                            PA2 = `${tempName}=${tempName}+${priceValue}`;
                                            PA3 = `id='${accessToken.id}'`;
                    
                                            [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);
                                        } else{

                                            // try{
                                            //     PA1 = dotEnv.CASH_HISTORY_TABLE;
                                            //     PA2 = '(id, ip, type, price)';
                                            //     PA3 = `'${accessToken.id}', '${req.headers['x-forwarded-for'] || req.ip}', '0b', ${priceValue}`;
                                            //     [dbresult, dbfield] = await dbReserved.dynamicRInsert(PA1, PA2, PA3);
            
                                            //     if(dbresult === null || dbresult.affectedRows === 0){
                                            //         throw new Error('결제내역 작성중 오류발생');
                                            //     }
            
                                            //     PA1 = dotEnv.PRODUCT_LOG_TABLE;
                                            //     PA2 = '';
                                            //     PA3 = `${dbresult.insertId}, '${type+'_'+num}', '${productName}'`;
                                            //     [dbresult, dbfield] = await dbReserved.dynamicRInsert(PA1, PA2, PA3);
    
                                            //     if(dbresult === null || dbresult.affectedRows === 0){
                                            //         throw new Error('결제내역 작성중 오류발생');
                                            //     }
                                            // }
                                            // catch(error){
                                            //     console.log(error);
                                            // }
                                            

                                            result.result = `${productName}을(를) 구매했습니다.`;
                                            result.code = 200;
                                        }
                                    }
                                } else{
                                    result.result = `${isCashUse? '캐쉬': '게임머니'}가 모자라 ${productName}을(를) 구매할 수 없습니다.`;
                                    result.code = 400;
                                }
                            }
                        }
                    }
                } else{
                    if(parseInt(req.query.type) < 0 || parseInt(req.query.type) > 1 || parseInt(req.query.type) === NaN){
                        result.result = '접근할 수 없는 상점타입입니다.';
                        result.code = 400;
                    } else if(!Number.isInteger(parseInt(req.query.num))){
                        result.result = '상품번호를 확인해주세요.';
                        result.code = 400;
                    } else{
                        result.result = '상점타입과 상품번호를 확인해주세요.';
                        result.code = 400;
                    }
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};