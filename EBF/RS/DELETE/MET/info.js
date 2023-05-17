const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const path = require('path');

module.exports = {
    delete_info_f: async function(req, res){
        var result = {
            result: null,
            code: 200
        };

        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        
        if(accessToken === null){ // 로그인 안함
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else{
            try{
                accessToken = await TokenManager.verifyToken(accessToken, req);
            
                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    try{
                        var PA1, PA2, PA3;

                        PA1 = '*';
                        PA2 = 'userinfo';
                        PA3 = `id='${accessToken.id}' AND pw='${req.body.pw}'`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '회원탈퇴중 문제가 발생했습니다. (100)';
                            result.code = 500;
                        } else if(dbresult.length === 0){
                            result.result = '비밀번호를 확인해주세요.';
                            result.code = 400;
                        } else{
                            PA1 = '*';
                            PA2 = dotEnv.LOGO_TABLE;
                            PA3 = `id='${accessToken.id}'`;

                            [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '회원탈퇴중 문제가 발생했습니다. (101)';
                                result.code = 500;
                            } else{
                                if(dbresult.length !== 0){ // 회원탈퇴중 로고를 발견해서 삭제
                                    commonFunction.deleteFile(dbresult[0].logoPath? dbresult[0].logoPath: '', path.join(__dirname, '..', '..', '..', '..', 'public'));
                                } 

                                PA1 = '*';
                                PA2 = dotEnv.BOARD_TABLE;
                                PA3 = `uploadId='${accessToken.id}'`;
                                
                                [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                                if(dbresult === null){
                                    result.result = '회원탈퇴중 문제가 발생했습니다. (104)';
                                    result.code = 500;
                                } else{
                                    if(dbresult.length !== 0){ // 회원탈퇴중 게시글에서 올린 이미지 확인후 삭제
                                        for(var i = 0; i < dbresult.length; i++){
                                            commonFunction.deleteFile(dbresult[i].imgPath? dbresult[i].imgPath: '', path.join(__dirname, '..', '..', '..', '..', 'public'));
                                        }
                                    }

                                    PA1 = 'userinfo';
                                    PA2 = `id='${accessToken.id}'`;

                                    [dbresult, dbfield] = await DBReserved.dynamic_delete(PA1, PA2);

                                    if(dbresult > 0){
                                        result.result = '회원탈퇴가 성공적으로 실행되었습니다.';
                                        result.code = 200;
                                        res.clearCookie('accessToken');
                                    } else{
                                        throw new Error("회원탈퇴 실패");
                                    }
                                }
                            }
                        }
                    }
                    catch(error){
                        console.log(error);
                        result.result = '회원탈퇴중 문제가 발생했습니다. (102)';
                        result.code = 500;
                    }
                }
            }
            catch(error){
                console.log(error);
                result.result = '회원탈퇴중 문제가 발생했습니다.';
                result.code = 500;
            }
        }
        commonFunction.sendResult(res, result);
    }
};