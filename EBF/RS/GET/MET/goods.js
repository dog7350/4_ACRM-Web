const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const dbReserved = require('../../../T/dbReserved');

const orderString = (order)=>{
    let result = '';

    switch (order) {
        case 0:
            result = 'order by gtp.goodsNumber desc';
            break;

        case 1:
            result = 'order by gtp.rec desc';
            break;

        case 2:
            result = 'order by gtp.unrec desc';
            break;

        case 3:
            result = 'order by gtp.uploadDate desc';
            break; 
    
        default:
            result = 'order by gtp.goodsNumber desc';
            break;
    }

    return result;
};

module.exports = {
    getGoods: async (req, res)=>{
        var result = {
            result: null,
            code: 200
        };

        var PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        let query = {name: '.*', title: '.*', order: 0, page: 1, pageSize: 7};
        let jump = true;

        try{
            if(req.query){
                query.name = req.query.name === "NULL"? null: req.query.name;
                query.title = req.query.title === "NULL"? null: req.query.title;
                query.content = req.query.content === "NULL"? null: req.query.content;
                query.order = Number.isInteger(req.query.order)? req.query.order: 0;
                query.page = Number.isInteger(Number.parseInt(req.query.page))? Number.parseInt(req.query.page): Number.MAX_SAFE_INTEGER;
                


                if(query.page === -1) query.page = Number.MAX_SAFE_INTEGER;

                if(req.query.isMine === 'o'){
                    jump = false;
                    if(accessToken){
                        accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);
        
                        if(Number.isInteger(accessToken)){
                            TokenManager.tokenVerifyValue(accessToken, result);
                        } else{
                            let 
                                count = `(SELECT count(*) FROM ${dotEnv.GOODS_LOG_TABLE} as glt WHERE glt.uploader='${accessToken.id}' AND glt.goodsNumber=gt.goodsNumber AND gt.stopSelling=0 AND glt.productStatus<20) as realCount`;
    
                            
                            
                            PA1 = `gt.*, ${count}`;
                            PA2 = `${dotEnv.GOODS_TABLE} AS gt`;
                            PA3 = `uploader='${accessToken.id}' AND gt.goodsNumber<${query.page} ORDER BY gt.goodsNumber DESC LIMIT 7`;

                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '상품 조회 중 문제가 발생했습니다.';
                                result.code = 500;
                            } else{
                                result.result = [];

                                for(var i in dbresult){
                                    result.result.push(dbresult[i]);
                                }
                                result.code = 200;
                            }
                        }
                    } else{
                        result.result = '로그인이 필요한 서비스입니다.';
                        result.code = 400;
                    }
                }
            }
            
            if(jump){
                PA1 = '*';

                if(accessToken){
                    accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);
    
                    if(Number.isInteger(accessToken)){
                        accessToken = null;
                    } else{
                        PA2 = `(SELECT *, (SELECT COUNT(*) FROM ${dotEnv.GOODS_RECOMMEND_TABLE} AS gr WHERE gr.goodsNumber=gtp1.goodsNumber AND recType='o') AS rec, (SELECT COUNT(*) FROM ${dotEnv.GOODS_RECOMMEND_TABLE} AS gr WHERE gr.goodsNumber=gtp1.goodsNumber AND recType='x') AS unrec, (SELECT mi.name FROM moreinfo AS mi WHERE gtp1.uploader=mi.id) AS uploaderName, (SELECT ulp.logoPath FROM ${dotEnv.LOGO_TABLE} AS ulp WHERE gtp1.uploader=ulp.id) AS uploaderLogoPath, (SELECT COUNT(*) FROM ${dotEnv.GOODS_RECOMMEND_TABLE} AS gr WHERE gr.goodsNumber=gtp1.goodsNumber AND gr.id='${accessToken.id}') AS imRec FROM ${dotEnv.GOODS_TABLE} AS gtp1 ORDER BY goodsNumber DESC) AS gtp`;
                    }
                } else{
                    accessToken = null;
                }
    
                if(query.name){
                    PA3 = `(REGEXP_INSTR(gtp.uploaderName, '${query.name}')) AND gtp.goodsNumber < ${query.page} ${orderString(query.order)} LIMIT 7`;
                } else if(query.title){
                    PA3 = `(REGEXP_INSTR(gtp.goodsName, '${query.title}')) AND gtp.goodsNumber < ${query.page} ${orderString(query.order)} LIMIT 7`;
                } else if(query.content){
                    PA3 = `(REGEXP_INSTR(gtp.goodsPs, '${query.content}')) AND gtp.goodsNumber < ${query.page} ${orderString(query.order)} LIMIT 7`;
                } else{
                    PA3 = `(REGEXP_INSTR(gtp.uploaderName, '${query.name}') OR REGEXP_INSTR(gtp.goodsName, '${query.title}') OR REGEXP_INSTR(gtp.goodsPs, '${query.content}')) AND gtp.goodsNumber < ${query.page} ${orderString(query.order)} LIMIT 7`;
                }
    
                
    
                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
                // console.log(`SELECT ${PA1} FROM ${PA2} WHERE ${PA3}`)s
    
                if(dbresult === null){
                    result.result = '상품 목록을 가져오는 중 문제가 발생했습니다. (101)';
                    result.code = 500;
                } else{
                    result.result = [];
                    for(var i in dbresult){
                        result.result.push(dbresult[i]);
                    }
                }
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품 목록을 가져오는 중 문제가 발생했습니다. (100)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    get_goods_log_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };

        var PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        try{
            if(req.query && req.query.goodsNumber !== null && req.query.goodsNumber !== undefined && Number.isInteger(parseInt(req.query.goodsNumber)) && parseInt(req.query.goodsNumber) > 0){
                if(accessToken){
                    accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);
    
                    if(Number.isInteger(accessToken)){
                        TokenManager.tokenVerifyValue(accessToken, result);
                    } else{
                        PA1 = `*, (SELECT email FROM moreinfo WHERE id=glt.purchaser) as email, (SELECT address FROM moreinfo WHERE id=glt.purchaser) as baseAddress, (SELECT phone FROM moreinfo WHERE id=glt.purchaser) as phone, (SELECT name FROM moreinfo WHERE id=glt.purchaser) as purName`;
                        PA2 = `${dotEnv.GOODS_LOG_TABLE} as glt`;
                        PA3 = `uploader='${accessToken.id}' AND goodsNumber=${req.query.goodsNumber} AND productStatus<20`;

                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '상품 로그를 가져오는 중 문제가 발생했습니다. (100)';
                            result.code = 500;
                        } else{
                            for(var i in dbresult){
                                result.result.push(dbresult[i]);
                            }

                            result.code = 200;
                        }
                    }
                } else{
                    result.result = '로그인이 필요한 서비스입니다.';
                    result.code = 400;
                }
            } else{
                result.result = '상품 번호를 확인해주세요.';
                result.code = 400;
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품 로그를 가져오는 중 문제가 발생했습니다. (101)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    get_goods_my_purchase_log_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };

        var PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        try{
            if(accessToken){
                accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    PA1 = `*, (SELECT name FROM moreinfo WHERE id=glt.purchaser) as purName, (SELECT name FROM moreinfo WHERE id=glt.uploader) as uplName, ((SELECT price FROM ${dotEnv.GOODS_TABLE} as gt WHERE gt.goodsNumber=glt.goodsNumber)*glt.numberOfProduct) as totalPrice, (SELECT goodsName FROM ${dotEnv.GOODS_TABLE} as gt WHERE gt.goodsNumber=glt.goodsNumber) as goodsName, (SELECT goodsImagePath FROM ${dotEnv.GOODS_TABLE} as gt WHERE gt.goodsNumber=glt.goodsNumber) as goodsImagePath`;
                    PA2 = `${dotEnv.GOODS_LOG_TABLE} as glt`;
                    PA3 = `purchaser='${accessToken.id}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){
                        result.result = '상품 로그를 가져오는 중 문제가 발생했습니다. (100)';
                        result.code = 500;
                    } else{
                        for(var i in dbresult){
                            result.result.push(dbresult[i]);
                        }

                        result.code = 200;
                    }
                }
            } else{
                result.result = '로그인이 필요한 서비스입니다.';
                result.code = 400;
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품 로그를 가져오는 중 문제가 발생했습니다. (101)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    get_goods_info_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };

        var PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        try{
            if(accessToken){
                accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    PA1 = `*`;
                    PA2 = `${dotEnv.GOODS_TABLE} as gt`;
                    PA3 = `gt.goodsNumber='${req.query?req.query.goodsNumber?req.query.goodsNumber: '-1': '-2'}'`;

                    // console.log(PA1, PA2, PA3);

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){
                        result.result = '상품 로그를 가져오는 중 문제가 발생했습니다. (100)';
                        result.code = 500;
                    } else{
                        for(var i in dbresult){
                            result.result.push(dbresult[i]);
                        }

                        result.code = 200;
                    }
                }
            } else{
                result.result = '로그인이 필요한 서비스입니다.';
                result.code = 400;
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품 로그를 가져오는 중 문제가 발생했습니다. (101)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
}