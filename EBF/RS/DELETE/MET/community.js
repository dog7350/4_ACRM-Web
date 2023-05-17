const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');
const fs = require('fs');
const path = require('path');

const deleteFollowOrBlock = async (req, accesstoken, result, targetId, type)=>{
    var PA1, PA2;
    let dbresult, dbfield;

    if(type === 0){ // follower delete
        PA1 = dotEnv.FOLLOW_TABLE;
        PA2 = `id='${accesstoken.id}' AND follow='${targetId}'`;
    } else if(type === 1){
        PA1 = dotEnv.BLOCK_TABLE;
        PA2 = `id='${accesstoken.id}' AND block='${targetId}'`;
    }

    [dbresult, dbfield] = await dbReserved.dynamic_delete(PA1, PA2);

    if(dbresult === null){
        result.result = '삭제중 문제가 발생했습니다.';
        result.code = 500;
    } else if(dbresult === 0){
        result.result = '이미 삭제되었습니다.';
        result.code = 200;
    } else{
        result.result = '삭제되었습니다.';
        result.code = 200;
    }
}

module.exports = {
    delete_board_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;
        
        let queryIndex = null;
        var PA1, PA2, PA3;

        if(accessToken !== null){ // 로그인한 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                if(req.query){
                    queryIndex = parseInt(req.query.bindex);

                    if(Number.isInteger(queryIndex) && queryIndex > 0){
                        PA1 = 'a.uploadId as uploadId, a.imgPath as imgPath';
                        PA2 = `${dotEnv.BOARD_TABLE} as a`;
                        PA3 = `a.index=${queryIndex}`;
                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '글 삭제중 문제가 발생했습니다.';
                            result.code = 500;
                        } else if(dbresult.length === 0){
                            result.result = '존재하지 않는 글 입니다.';
                            result.code = 400;
                        } else{
                            var uploadId = dbresult[0].uploadId;
                            var imgPath = dbresult[0].imgPath;

                            if(uploadId == accessToken.id || ['o', 'm'].indexOf(accessToken.auth) !== -1){
                                PA1 = dotEnv.BOARD_TABLE;
                                PA2 = `${dotEnv.BOARD_TABLE}.index=${queryIndex}`;

                                [dbresult, dbfield] = await dbReserved.dynamic_delete(PA1, PA2);

                                if(dbresult === null){
                                    result.result = '글 삭제중 문제가 발생했습니다.';
                                    result.code = 500;
                                } else if(dbresult === 0){
                                    result.result = '존재하지 않는 글 입니다. (100)';
                                    result.code = 400;
                                } else{
                                    result.result = '성공적으로 글을 삭제했습니다.';
                                    result.code = 200;

                                    commonFunction.deleteFile(imgPath, path.join(__dirname, '..', '..', '..', '..', 'public'));
                                }

                            } else{
                                result.result = '게시글을 삭제할 권한이 없습니다.';
                                result.code = 400;
                            }
                        }
                    }
                    else{
                        result.result = '유효하지 않은 게시글 번호 입니다.';
                        result.code = 400;
                    }
                }
                else{
                    result.result = '삭제할 게시글 번호를 입력해야합니다.';
                    result.code = 400;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    delete_follow_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;

        if(accessToken !== null){ // 로그인한 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                let boardIndex = null;
                let targetId = null;

                if(req.query){
                    boardIndex = parseInt(req.query.bindex);
                    targetId = req.query.targetId;

                    if(commonFunction.idRegCheck(targetId)){ // 아이디가 정규식에 맞는 경우
                        try{
                            var sad = await deleteFollowOrBlock(req, accessToken, result, targetId, 0);
                        }
                        catch(error){
                            console.log(error);
                            result.result = '팔로우 제거중 문제가 발생했습니다. (200)';
                            result.code = 500;
                        }
                        
                    } 
                    else if(Number.isInteger(boardIndex) && boardIndex > 0){ // 글 번호가 양수일 경우
                        PA1 = 'uploadId';
                        PA2 = `${dotEnv.BOARD_TABLE} as a`;
                        PA3 = `a.index=${boardIndex}`;

                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '실행중 오류가 발생했습니다. (109)';
                            result.code = 500;
                        } else if(dbresult.length === 0){
                            result.result = '존재하지 않는 글번호입니다.';
                            result.code = 400;
                        }
                        else{
                            try{
                                targetId = dbresult[0].uploadId;
                                var sad = await deleteFollowOrBlock(req, accessToken, result, targetId, 0);
                            }
                            catch(error){
                                console.log(error);
                                result.result = '팔로우 제거중 문제가 발생했습니다. (201)';
                                result.code = 500;
                            }
                        }
                    } 
                    else{
                        result.result = '글 번호 또는 ID를 확인해주세요.';
                        result.code = 400;
                    }
                }
                else{
                    result.result = '팔로우 제거를 하기 위해서는 올린 글 번호 또는 ID가 필요합니다.';
                    result.code = 400;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    delete_block_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;

        if(accessToken !== null){ // 로그인한 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                let boardIndex = null;
                let targetId = null;

                if(req.query){
                    boardIndex = parseInt(req.query.bindex);
                    targetId = req.query.targetId;

                    if(commonFunction.idRegCheck(targetId)){ // 아이디가 정규식에 맞는 경우
                        try{
                            var sad = await deleteFollowOrBlock(req, accessToken, result, targetId, 1);
                        }
                        catch(error){
                            console.log(error);
                            result.result = '차단목록 제거중 문제가 발생했습니다. (200)';
                            result.code = 500;
                        }
                        
                    } 
                    else if(Number.isInteger(boardIndex) && boardIndex > 0){ // 글 번호가 양수일 경우
                        PA1 = 'uploadId';
                        PA2 = `${dotEnv.BOARD_TABLE} as a`;
                        PA3 = `a.index=${boardIndex}`;

                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '실행중 오류가 발생했습니다. (109)';
                            result.code = 500;
                        } else if(dbresult.length === 0){
                            result.result = '존재하지 않는 글번호입니다.';
                            result.code = 400;
                        }
                        else{
                            try{
                                targetId = dbresult[0].uploadId;
                                var sad = await deleteFollowOrBlock(req, accessToken, result, targetId, 1);
                            }
                            catch(error){
                                console.log(error);
                                result.result = '차단목록 제거중 문제가 발생했습니다. (201)';
                                result.code = 500;
                            }
                        }
                    } 
                    else{
                        result.result = '글 번호 또는 ID를 확인해주세요.';
                        result.code = 400;
                    }
                }
                else{
                    result.result = '차단목록 제거를 하기 위해서는 올린 글 번호 또는 ID가 필요합니다.';
                    result.code = 400;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    delete_comment_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;
        let cindex = req.query? Number.isInteger(parseInt(req.query.cindex))? parseInt(req.query.cindex): 0: 0;

        var PA1, PA2, PA3;

        if(accessToken !== null){ // 로그인한 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                PA1 = '*';
                PA2 = dotEnv.COMMENT_TABLE;
                PA3 = `${dotEnv.COMMENT_TABLE}.index=${cindex}`;
                
                try{
                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){
                        result.result = '댓글 삭제중 문제가 발생했습니다. (100)';
                        result.code = 500;
                    } else if(dbresult.length === 0){
                        result.result = '존재하지 않는 댓글번호입니다.';
                        result.code = 500;
                    } else{
                        if(dbresult[0].uploadId === accessToken.id || ['o', 'm'].indexOf(accessToken.auth) !== -1){
                            PA1 = dotEnv.COMMENT_TABLE;
                            PA2 = `${dotEnv.COMMENT_TABLE}.index=${cindex}`;

                            [dbresult, dbfield] = await dbReserved.dynamic_delete(PA1, PA2);

                            if(dbresult === null){
                                result.result = '댓글 삭제중 문제가 발생했습니다. (101)';
                                result.code = 500;
                            } else if(dbresult === 0){
                                result.result = '댓글을 삭제하지 못했습니다.';
                                result.code = 500;
                            } else{
                                result.result = '댓글을 성공적으로 삭제했습니다.';
                                result.code = 200;
                            }
                        } else{
                            result.result = '댓글을 삭제할 권한이 없습니다.';
                            result.code = 400;
                        }
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '댓글 삭제중 문제가 발생했습니다.';
                    result.code = 500;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};