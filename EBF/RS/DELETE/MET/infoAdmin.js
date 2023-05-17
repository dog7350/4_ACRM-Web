const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const path = require('path');

module.exports = {
    info_admin_delete_f: async (req, res)=>{
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
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(accessToken.auth.toLowerCase() !== 'o'){ // admin이 o임
                result.result = '접근 권한이 없습니다.';
                result.code = 400;
            } else{
                try{
                    let querySon = {
                        table: req.body.table,
                        condition: req.body.condition
                    };

                    if(querySon.table === null || querySon.table === undefined || querySon.table.trim().length == 0){ // 테이블 이름이 없는 경우 종료
                        result.result = '삭제할 테이블 명을 입력해야 합니다.';
                        result.code = 400;
                    } else if(querySon.condition === null || querySon.condition === undefined || querySon.condition.trim().length == 0){ // 조건이 없는 경우 종료
                        result.result = '삭제할 조건을 입력해야 합니다.';
                        result.code = 400;
                    } else{ // 삭제 실행
                        [dbresult, dbfield] = await DBReserved.dynamic_delete(querySon.table, querySon.condition);
                        
                        
                        if(!Number.isInteger(dbresult) && !dbresult && !dbfield){
                            throw new Error("에러발생");
                        }


                        result.result = `${dbresult}개의 행을 삭제하는데 성공했습니다.`;
                        result.code = 200;
                    }
                }
                catch(error){
                    result.result = '쿼리실행중 오류가 발생했습니다 입력한 정보를 다시 확인해 주세요.';
                    result.code = 500;
                }
            } 
        }

        commonFunction.sendResult(res, result);
    },
    info_admin_delete_target_f: async (req, res)=>{
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
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(accessToken.auth !== 'o'){ // admin이 o가 아님
                result.result = '접근 권한이 없습니다.';
                result.code = 400;
            } else{
                if(req.body){
                    try{
                        var secessionId = req.body.secessionid? req.body.secessionid: '';
                        var PA1, PA2, PA3;
    
                        if(!commonFunction.idRegCheck(secessionId)){
                            result.result = '삭제할 ID를 다시 확인해주세요.';
                            result.code = 400;
                        } else{
                            PA1 = '*';
                            PA2 = 'userinfo';
                            PA3 = `id='${secessionId}'`;

                            [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '회원을 탈퇴시키는 중 문제가 발생했습니다. (102)';
                                result.code = 500;
                            } else if(dbresult.length === 0){
                                result.result = '존재하지 않는 ID입니다. (103)';
                                result.code = 400;
                            } else if(dbresult[0].admin === 'o'){
                                result.result = '관리자는 탈퇴시킬 수 없습니다.';
                                result.code = 400;
                            } else{
                                PA1 = '*';
                                PA2 = dotEnv.LOGO_TABLE;
                                PA3 = `id='${secessionId}'`;
            
                                [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
            
                                if(dbresult === null){
                                    result.result = '회원탈퇴중 문제가 발생했습니다. (100)';
                                    result.code = 500;
                                } else{
                                    if(dbresult.length !== 0){ // 회원탈퇴중 로고를 발견해서 삭제
                                        commonFunction.deleteFile(dbresult[0].logoPath? dbresult[0].logoPath: '', path.join(__dirname, '..', '..', '..', '..', 'public'));
                                    } 
            
                                    PA1 = '*';
                                    PA2 = dotEnv.BOARD_TABLE;
                                    PA3 = `uploadId='${secessionId}'`;
                                    
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
                                        PA2 = `id='${secessionId}'`;
            
                                        [dbresult, dbfield] = await DBReserved.dynamic_delete(PA1, PA2);
            
                                        if(dbresult > 0){
                                            result.result = '회원탈퇴를 성공적으로 실행했습니다.';
                                            result.code = 200;
                                        } else{
                                            result.result = `회원 ${secessionId}의 탈퇴를 실패했습니다.`;
                                            result.code = 200;
                                        }
                                    }
                                }
                            }
                        }                  
                    }
                    catch(error){
                        console.log(error);
                        result.result = '쿼리실행중 오류가 발생했습니다 입력한 정보를 다시 확인해 주세요.';
                        result.code = 500;
                    }
                }
            } 
        }

        commonFunction.sendResult(res, result);
    },
};