const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

module.exports = {
    read_boards_admin_f: async function(req, res){
        var result = {
            result: {
                id: null,
                boards: [],
            },
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;

        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(['o', 'm'].indexOf(accessToken.auth) === -1){
                result.result = '권한이 부족하여 접근할 수 없습니다.';
                result.code = 400;
            } else{
                if(req.query && commonFunction.idRegCheck(req.query.id)){
                    var page = req.query.page;
                    var pageSize = req.query.pagesize;
                    var order = req.query.order;

                    if(!Number.isInteger(parseInt(page)) && !Number.isInteger(parseInt(pageSize))){
                        page = DEFAULT_PAGE;
                        pageSize = DEFAULT_PAGE_SIZE;
                    } else if(!Number.isInteger(parseInt(page)) || parseInt(page) < 1){
                        page = DEFAULT_PAGE;
                    } else if(!Number.isInteger(parseInt(pageSize)) || parseInt(pageSize) < 1){
                        pageSize = DEFAULT_PAGE_SIZE;
                    }

                    page = page - 1;

                    try{
                        PA1 = `a.name AS nickName, b.*, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=b.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=b.index and recType='x') as unRecommendCount, (select count(*) from ${dotEnv.BOARD_OBJ_TABLE} where bindex=b.index) as objectionCount`;
                        PA2 = `moreinfo AS a RIGHT OUTER JOIN ${dotEnv.BOARD_TABLE} AS b ON a.id=b.uploadId`;
                        PA3 = `id='${req.query.id}' ORDER BY b.index ${order? 'asc': 'desc'} LIMIT ${page*pageSize}, ${pageSize}`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
                        
                        if(dbresult === null){ // 정보 불러오기 실패
                            result.result = '정보를 불러오는데 실패했습니다.';
                            result.code = 500;
                        } else{ // 정보 불러오기 성공
                            result.result.id = req.query.id;
                            for(var i = 0; i < dbresult.length; i++){
                                dbresult[i].timeStamp = dbresult[i].timeStamp.getTime();
                                result.result.boards.push(dbresult[i]);
                            }
                            result.code = 200;
                        }
                    }
                    catch(error){
                        console.log(error);
                        result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                        result.code = 500;
                    }
                } else{
                    result.result = '조회할 ID의 형식을 확인해주세요.';
                    result.code = 400;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    read_comments_admin_f: async function(req, res){
        var result = {
            result: {
                id: null,
                comments: [],
            },
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;

        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(['o', 'm'].indexOf(accessToken.auth) === -1){
                result.result = '권한이 부족하여 접근할 수 없습니다.';
                result.code = 400;
            } else{
                if(req.query && commonFunction.idRegCheck(req.query.id)){
                    var page = req.query.page;
                    var pageSize = req.query.pagesize;
                    var order = req.query.order;

                    if(!Number.isInteger(parseInt(page)) && !Number.isInteger(parseInt(pageSize))){
                        page = DEFAULT_PAGE;
                        pageSize = DEFAULT_PAGE_SIZE;
                    } else if(!Number.isInteger(parseInt(page)) || parseInt(page) < 1){
                        page = DEFAULT_PAGE;
                    } else if(!Number.isInteger(parseInt(pageSize)) || parseInt(pageSize) < 1){
                        pageSize = DEFAULT_PAGE_SIZE;
                    }

                    page = page - 1;

                    try{
                        PA1 = `a.name AS nickName, b.*, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=b.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=b.index and recType='x') as unRecommendCount, (select count(*) from ${dotEnv.COMMENT_OBJ_TABLE} where cindex=b.index) as objectionCount`;
                        PA2 = `moreinfo AS a RIGHT OUTER JOIN ${dotEnv.COMMENT_TABLE} AS b ON a.id=b.uploadId`;
                        PA3 = `id='${req.query.id}' ORDER BY b.index ${order? 'asc': 'desc'} LIMIT ${page*pageSize}, ${pageSize}`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
                        
                        if(dbresult === null){ // 정보 불러오기 실패
                            result.result = '정보를 불러오는데 실패했습니다.';
                            result.code = 500;
                        } else{ // 정보 불러오기 성공
                            result.result.id = req.query.id;

                            for(var i = 0; i < dbresult.length; i++){
                                dbresult[i].timeStamp = dbresult[i].timeStamp.getTime();
                                result.result.comments.push(dbresult[i]);
                            }
                            result.code = 200;
                        }
                    }
                    catch(error){
                        console.log(error);
                        result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                        result.code = 500;
                    }
                } else{
                    result.result = '조회할 ID의 형식을 확인해주세요.';
                    result.code = 400;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    why_object_this_board_f: async (req, res)=>{
        var result = {
            result: {
                id: null,
                comments: [],
            },
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;

        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(['o', 'm'].indexOf(accessToken.auth) === -1){
                result.result = '권한이 부족하여 접근할 수 없습니다.';
                result.code = 400;
            } else{
                if(req.query && Number.isInteger(parseInt(req.query.index))){
                    var page = req.query.page;
                    var pageSize = req.query.pagesize;
                    var bindex = parseInt(req.query.index);

                    if(!Number.isInteger(parseInt(page)) && !Number.isInteger(parseInt(pageSize))){
                        page = DEFAULT_PAGE;
                        pageSize = DEFAULT_PAGE_SIZE;
                    } else if(!Number.isInteger(parseInt(page)) || parseInt(page) < 1){
                        page = DEFAULT_PAGE;
                    } else if(!Number.isInteger(parseInt(pageSize)) || parseInt(pageSize) < 1){
                        pageSize = DEFAULT_PAGE_SIZE;
                    }

                    page = page - 1;

                    try{
                        PA1 = `*`;
                        PA2 = `${dotEnv.BOARD_OBJ_TABLE} as bo`;
                        PA3 = `bo.bindex=${bindex} LIMIT ${page*pageSize}, ${pageSize}`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
                        
                        if(dbresult === null){ // 정보 불러오기 실패
                            result.result = '정보를 불러오는데 실패했습니다.';
                            result.code = 500;
                        } else{ // 정보 불러오기 성공
                            result.result.id = req.query.id;

                            for(var i = 0; i < dbresult.length; i++){
                                result.result.comments.push(dbresult[i]);
                            }
                            result.code = 200;
                        }
                    }
                    catch(error){
                        console.log(error);
                        result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                        result.code = 500;
                    }
                } else{
                    result.result = '조회할 게시글 번호를 확인해주세요.';
                    result.code = 400;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    why_object_this_comment_f: async (req, res)=>{
        var result = {
            result: {
                id: null,
                comments: [],
            },
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;

        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(['o', 'm'].indexOf(accessToken.auth) === -1){
                result.result = '권한이 부족하여 접근할 수 없습니다.';
                result.code = 400;
            } else{
                if(req.query && Number.isInteger(parseInt(req.query.index))){
                    var page = req.query.page;
                    var pageSize = req.query.pagesize;
                    var cindex = parseInt(req.query.index);

                    if(!Number.isInteger(parseInt(page)) && !Number.isInteger(parseInt(pageSize))){
                        page = DEFAULT_PAGE;
                        pageSize = DEFAULT_PAGE_SIZE;
                    } else if(!Number.isInteger(parseInt(page)) || parseInt(page) < 1){
                        page = DEFAULT_PAGE;
                    } else if(!Number.isInteger(parseInt(pageSize)) || parseInt(pageSize) < 1){
                        pageSize = DEFAULT_PAGE_SIZE;
                    }

                    page = page - 1;

                    try{
                        PA1 = `*`;
                        PA2 = `${dotEnv.COMMENT_OBJ_TABLE} as co`;
                        PA3 = `co.cindex=${cindex} LIMIT ${page*pageSize}, ${pageSize}`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
                        
                        if(dbresult === null){ // 정보 불러오기 실패
                            result.result = '정보를 불러오는데 실패했습니다.';
                            result.code = 500;
                        } else{ // 정보 불러오기 성공
                            result.result.id = req.query.id;

                            for(var i = 0; i < dbresult.length; i++){
                                result.result.comments.push(dbresult[i]);
                            }
                            result.code = 200;
                        }
                    }
                    catch(error){
                        console.log(error);
                        result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                        result.code = 500;
                    }
                } else{
                    result.result = '조회할 댓글 번호를 확인해주세요.';
                    result.code = 400;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
};