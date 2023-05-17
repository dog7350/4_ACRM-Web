const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const dbReserved = require('../../../T/dbReserved');
const socketPartner = require('../../../T/socket/socketPartner');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: async (req, file, callback)=>{
        try{
            callback(null, './public/images/goods');
        }
        catch(error){
            console.log(error);
        }
    },
    filename: (req, file, callback)=>{
        callback(null, commonFunction.changeBase64FromString(`${Date.now()}${file.originalname}`)+`.${file.mimetype.split('/')[1]}`);
    },
});

const upload = multer({
    storage: storage, 
    limits: 5 * 1024 * 1024, 
    fileFilter: (req, file, cb) => {
    if (dotEnv.ALLOW_MIMETYPES.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('dGhpc2lzbm90anBlZ3BuZ2pwZ2ltYWdlISE'));
    }
}});

module.exports = {
    buy_goods_f: async (req, res)=>{
        var result = {
            result: null,
            code: 200
        };

        var PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        try{
            if(accessToken){
                accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);

                res.cookie('mobilePurchase', '', {maxAge: 1, httpOnly:false});

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    if(req.body){
                        if(!req.body.goodsNumber || !Number.isInteger(Number.parseInt(req.body.goodsNumber)) || Number.parseInt(req.body.goodsNumber) <= 0){
                            result.result = '상품 번호를 확인해주세요.';
                            result.code = 400;
                        } else{
                            if(!req.body.value || !Number.isInteger(Number.parseInt(req.body.value)) || Number.parseInt(req.body.value) <= 0){
                                result.result = '상품 수량을 확인해주세요.';
                                result.code = 400;
                            } else{
                                let 
                                    goodsCheck = `(SELECT count(*) AS goodsCheck FROM ${dotEnv.GOODS_TABLE} WHERE goodsNumber=${req.body.goodsNumber}) as goodsCheck`,
                                    goodsSellingCheck = `(SELECT stopSelling FROM ${dotEnv.GOODS_TABLE} WHERE goodsNumber=${req.body.goodsNumber}) as goodsSellingCheck`,
                                    maxCheck = `(SELECT maxNumberOfProduct FROM ${dotEnv.GOODS_TABLE} WHERE goodsNumber=${req.body.goodsNumber}) as maxCheck`,
                                    uploader = `(SELECT uploader FROM ${dotEnv.GOODS_TABLE} WHERE goodsNumber=${req.body.goodsNumber}) as uploader`,
                                    price = `(SELECT price FROM ${dotEnv.GOODS_TABLE} WHERE goodsNumber=${req.body.goodsNumber}) as price`,
                                    goodsName = `(SELECT goodsName FROM ${dotEnv.GOODS_TABLE} WHERE goodsNumber=${req.body.goodsNumber}) as goodsName`;

                                PA1 = `${goodsCheck}, ${goodsSellingCheck}, ${maxCheck}, ${uploader}, ${price}, ${goodsName}`;
                                PA2 = 'DUAL';
                                PA3 = `1=1`;

                                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                if(dbresult === null){
                                    result.result = '상품 구매하는 중 문제가 발생했습니다. (101)';
                                    result.code = 500;
                                } else{
                                    if(dbresult[0].goodsCheck === 0){
                                        result.result = '존재하지 않는 상품입니다.';
                                        result.code = 400;
                                    } else if(dbresult[0].goodsSellingCheck === 1){
                                        result.result = '판매가 중지된 상품입니다.';
                                        result.code = 400;
                                    } else if(dbresult[0].maxCheck < Number.parseInt(req.body.value)){
                                        result.result = '최대수량보다 많은 상품을 구매할 수 없습니다.';
                                        result.code = 400;
                                    } else{
                                        let realPrice = dbresult[0].price * Number.parseInt(req.body.value);
                                        let uploaderName = dbresult[0].uploader + '';
                                        let realGoodsName = dbresult[0].goodsName + '';

                                        PA1 = 'cash'
                                        PA2 = 'userinfo'
                                        PA3 = `id='${accessToken.id}'`;

                                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                        if(dbresult === null){
                                            result.result = '상품 구매하는 중 문제가 발생했습니다. (102)';
                                            result.code = 500;
                                        } else{
                                            if(dbresult[0].cash < realPrice){
                                                result.result = '캐쉬가 모자랍니다.';
                                                // result.gap = parseInt(realPrice) - parseInt(dbresult[0].cash);
                                                // console.log(parseInt(realPrice) - parseInt(dbresult[0].cash), parseInt(realPrice), parseInt(dbresult[0].cash));
                                                // result.result = `${parseInt(realPrice) - parseInt(dbresult[0].cash)}`;
                                                result.gap = parseInt(realPrice) - parseInt(dbresult[0].cash);
                                                result.code = 201;
                                            } else{
                                                PA1 = 'userinfo'
                                                PA2 = `cash=cash-${realPrice}`
                                                PA3 = `id='${accessToken.id}'`;

                                                [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                                                // PA1 = 'userinfo'
                                                // PA2 = `cash=cash+${realPrice}`
                                                // PA3 = `id='${uploaderName}'`;

                                                // [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                                                PA1 = dotEnv.GOODS_LOG_TABLE;
                                                PA2 = '(uploader, purchaser, goodsNumber, numberOfProduct, address)';
                                                PA3 = `'${uploaderName}', '${accessToken.id}', ${req.body.goodsNumber}, ${req.body.value}, '${req.body.address? req.body.address: ''}'`;

                                                [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);

                                                result.result = '상품을 구매했습니다.';
                                                result.code = 200;

                                                var uploaderMsg = {
                                                    'type': 200,
                                                    'content': `${commonFunction.changeBase64FromString(`${accessToken.id}님이 ${realGoodsName}을(를) 구매했습니다.`)}`,
                                                };

                                                var receiverMsg = {
                                                    'type': 201,
                                                    'content': `${commonFunction.changeBase64FromString(`${realGoodsName}을(를) 구매했습니다.`)}`,
                                                };
                
                                                var PA1 = 'communitynotifi';
                                                var PA2 = "(publisher, receiver, content)"; 
                                                var PA3 = `'${accessToken.id}', '${uploaderName}', '${JSON.stringify(uploaderMsg)}'`;
                                                
                                                [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);
                
                                                socketPartner.socket_io_json.socket_io.to(uploaderName).emit('create_notifi', uploaderMsg);

                                                var PA1 = 'communitynotifi';
                                                var PA2 = "(publisher, receiver, content)"; 
                                                var PA3 = `'${accessToken.id}', '${accessToken.id}', '${JSON.stringify(receiverMsg)}'`;
                                                
                                                [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                                                socketPartner.socket_io_json.socket_io.to(accessToken.id).emit('create_notifi', receiverMsg);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else{
                        result.result = '상품을 구매하기 위해서는 상품 번호, 수량이 필요합니다.';
                        result.code = 400;
                    }
                }
            } else{
                result.result = '로그인이 필요한 서비스입니다.';
                result.code = 400;
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품 구매하는 중 문제가 발생했습니다. (100)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    upload_goods: [upload.single('imageFile'), async (req, res)=>{
        var result = {
            result: null,
            code: 200
        };

        let PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var baseImgPath = '/images/goods/';

        try{
            if(accessToken){
                accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    if(req.body){ 
                        if(req.body.goodsName && req.body.goodsName.length > 5){
                            if(req.body.goodsPs && req.body.goodsPs.length > 20){
                                if(req.body.price && Number.isInteger(parseInt(req.body.price)) && parseInt(req.body.price) > 0){
                                    if(req.body.maxNumOfProduct && Number.isInteger(parseInt(req.body.maxNumOfProduct)) && parseInt(req.body.maxNumOfProduct) > 0){
                                        let lastImagePath = '';

                                        if(req.file) lastImagePath = `${baseImgPath}${req.file.filename}`;
                                        else lastImagePath = '';
                                        
                                        PA1 = dotEnv.GOODS_TABLE;
                                        PA2 = '(goodsName, goodsPs, goodsImagePath, uploader, price, maxNumberOfProduct)';
                                        PA3 = `'${req.body.goodsName}', '${req.body.goodsPs}', '${lastImagePath}', '${accessToken.id}', ${req.body.price}, ${req.body.maxNumOfProduct}`;

                                        [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);

                                        if(dbresult === null){
                                            result.result = '상품 업로드하는 중 문제가 발생했습니다. (101)';
                                            result.code = 500;
                                        } else{
                                            result.result = '상품을 성공적으로 업로드 했습니다.';
                                            result.code = 200;
                                        }
                                    } else{
                                        result.result = '최대 판매 갯수는 0개 보다 많아야합니다.';
                                        result.code = 400;
                                    }
                                } else{
                                    result.result = '상품 가격은 0캐쉬 보다 커야합니다.';
                                    result.code = 400;
                                }
                            } else{
                                result.result = '상품 설명은 20자 보다 커야합니다.';
                                result.code = 400;
                            }
                        } else{
                            result.result = '상품 이름은 5자 보다 커야합니다.';
                            result.code = 400;
                        }
                    } else{
                        result.result = '상품을 등록하기 위한 정보가 부족합니다.';
                        result.code = 400;
                    }
                }
            } else{
                result.result = '로그인이 필요한 서비스입니다.';
                result.code = 400;
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품 업로드하는 중 문제가 발생했습니다. (100)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    }],
    change_goods: [upload.single('imageFile'), async (req, res)=>{
        var result = {
            result: null,
            code: 200
        };

        let PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var baseImgPath = '/images/goods/';
        let beforeImagePath = '';
        let currentImagePath = '';

        try{
            if(req.file) currentImagePath = `${baseImgPath}${req.file.filename}`;
            else currentImagePath = '';

            if(accessToken){
                accessToken = accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    if(req.body){
                        if(req.body.stopSelling && (parseInt(req.body.stopSelling) === 0 || parseInt(req.body.stopSelling) === 1)){
                            if(req.body.goodsNumber && parseInt(req.body.goodsNumber) > 0){
                                PA1 = 'count(*) as cnt, goodsImagePath';
                                PA2 = dotEnv.GOODS_TABLE;
                                PA3 = `uploader='${accessToken.id}' AND goodsNumber=${req.body.goodsNumber}`;
    
                                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
                                if(dbresult === null){
                                    result.result = '상품 변경하는 중 문제가 발생했습니다. (102)';
                                    result.code = 500;
                                } else{
                                    if(!(dbresult[0]['cnt'] > 0)){
                                        result.result = '상품이 존재하지 않습니다. (100)';
                                        result.code = 400;
                                    } else{
                                        beforeImagePath = dbresult[0]['goodsImagePath'];

                                        if(req.body.goodsName && req.body.goodsName.length > 5){
                                            if(req.body.goodsPs && req.body.goodsPs.length > 20){
                                                if(req.body.price && Number.isInteger(parseInt(req.body.price)) && parseInt(req.body.price) > 0){
                                                    if(req.body.maxNumOfProduct && Number.isInteger(parseInt(req.body.maxNumOfProduct)) && parseInt(req.body.maxNumOfProduct) > 0){
                                                        let
                                                            changeName = `goodsName='${req.body.goodsName}'`,
                                                            changePs = `goodsPs='${req.body.goodsPs}'`,
                                                            price = `price=${req.body.price}`,
                                                            maxNumberOfProduct = `maxNumberOfProduct=${req.body.maxNumOfProduct}`,
                                                            imagePath = `goodsImagePath='${currentImagePath}'`,
                                                            stopSelling = `stopSelling=${req.body.stopSelling}`;
    
                                                        PA1 = dotEnv.GOODS_TABLE;
                                                        PA2 = `${changeName}, ${changePs}, ${price}, ${maxNumberOfProduct}, ${imagePath}, ${stopSelling}`;
                                                        PA3 = `uploader='${accessToken.id}' AND goodsNumber=${req.body.goodsNumber}`;
    
                
                                                        [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);
                
                                                        if(dbresult === null){
                                                            result.result = '상품을 변경하는 중 문제가 발생했습니다. (102)';
                                                            result.code = 500;
                                                        } else{
                                                            result.result = '상품을 성공적으로 변경 했습니다.';
                                                            result.code = 200;

                                                            commonFunction.deleteFile(beforeImagePath, path.join(__dirname, '..', '..', '..', '..', 'public'));
                                                        }
                                                    } else{
                                                        result.result = '최대 판매 갯수는 0개 보다 많아야합니다.';
                                                        result.code = 400;
                                                    }
                                                } else{
                                                    result.result = '상품 가격은 0캐쉬 보다 커야합니다.';
                                                    result.code = 400;
                                                }
                                            } else{
                                                result.result = '상품 설명은 20자 보다 커야합니다.';
                                                result.code = 400;
                                            }
                                        } else{
                                            result.result = '상품 이름은 5자 보다 커야합니다.';
                                            result.code = 400;
                                        }
                                    }
                                }
                            } else{
                                result.result = '상품이 존재하지 않습니다. (101)';
                                result.code = 400;
                            }
                        } else{
                            result.result = '상품 판매 값은 0(판매), 1(판매중지) 이여야합니다.';
                            result.code = 400;
                        }
                    } else{
                        result.result = '상품을 변경하기 위한 정보가 부족합니다.';
                        result.code = 400;
                    }
                }
            } else{
                result.result = '로그인이 필요한 서비스입니다.';
                result.code = 400;
            }
        }
        catch(error){
            console.log(error);
            result.result = '상품을 변경하는 중 문제가 발생했습니다. (100)';
            result.code = 500;
        }

        if(result.code >= 400){
            commonFunction.deleteFile(currentImagePath, path.join(__dirname, '..', '..', '..', '..', 'public'));
        }

        commonFunction.sendResult(res, result);
    }]
}