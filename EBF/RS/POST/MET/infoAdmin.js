const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');

module.exports = {
    info_admin_select_f: async function(req, res){
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
                        page: req.query.page,
                        pageSize: req.query.pageSize,
                        table: req.body.table,
                        colname: req.body.colname,
                        condition: req.body.condition
                    };

                    if(querySon.page === null || querySon.page === undefined){ // 페이지가 없는경우 1로 바꿈
                        querySon.page = 1;
                    } else{ // 있는 경우 파싱
                        try {
                            if(!Number.isInteger(parseInt(querySon.page))) querySon.page = 1; // 숫자가 아니면 1 페이지
                            else{
                                querySon.page = parseInt(querySon.page);
    
                                if(querySon.page < 1) querySon.page = 1; // 파싱했는데 1보다 작으면 변경
                            }
                        } catch (error) {
                            console.log(error);
                            querySon.page = 1;
                        }
                    }
    
                    if(querySon.pageSize === null || querySon.pageSize === undefined){ // 페이지크기가 없는경우 1로 바꿈
                        querySon.pageSize = 1;
                    } else{ // 있는경우 파싱
                        try {
                            if(querySon.pageSize === "*") querySon.pageSize = 1000; // * 이면 크기 1000으로 변경
                            else if(!Number.isInteger(parseInt(querySon.pageSize))) querySon.pageSize = 1;  // 숫자가 아니면 사이즈 페이지 1
                            else{
                                querySon.pageSize = parseInt(querySon.pageSize);
    
                                if(querySon.pageSize < 1) querySon.pageSize = 1; // 파싱했는데 1보다 작으면 변경
                            }
                        } catch (error) {
                            console.log(error);
                            querySon.pageSize = 1;
                        }
                    }

                    if(querySon.colname === null || querySon.colname === undefined || querySon.colname.trim().length === 0){ // 컬럼네임이 없는 경우 '*'로 변경
                        querySon.colname = '*';
                    }
    
                    if(querySon.condition === null || querySon.condition === undefined || querySon.condition.trim().length === 0){ // 조건이 없는 경우 '1'로 변경
                        querySon.condition = '1';
                    } 
    
                    if(querySon.table === null || querySon.table === undefined || querySon.table.trim().length === 0){ // 테이블 이름이 없는 경우 종료
                        result.result = '테이블 명을 입력해야 합니다.';
                        result.code = 400;
                    } else{ // 테이블 명이 존재하는 경우 실행
                        [dbresult, dbfield] = await DBReserved.dynamic_select(
                            querySon.colname,
                            querySon.table,
                            `${querySon.condition} LIMIT ${0+(querySon.pageSize*(querySon.page-1))}, ${querySon.pageSize}`
                        );
                        
                        result.result = dbresult;
                        
                        if(dbfield === 0){
                            throw new Error("에러발생");
                        }
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
    info_admin_insert_f: async function(req, res){
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
                        valueName: req.body.valueName,
                        value: req.body.value
                    };

                    if(querySon.valueName === null || querySon.valueName === undefined || querySon.valueName.trim().length === 0){ // 테이블 이름이 없는 경우 종료
                        querySon.valueName = '';
                    }

                    if(querySon.table === null || querySon.table === undefined || querySon.table.trim().length === 0){ // 테이블 이름이 없는 경우 종료
                        result.result = '테이블 명을 입력해야 합니다.';
                        result.code = 400;
                    } else if(querySon.value === null || querySon.value === undefined || querySon.value.trim().length === 0){ // 넣을 값이 없는 경우 종료
                        result.result = '넣을 데이터를 입력해야 합니다.';
                        result.code = 400;
                    } else{
                        [dbresult, dbfield] = await DBReserved.dynamic_insert(
                            querySon.table,
                            querySon.valueName,
                            querySon.value
                        );

                        if(!Number.isInteger(dbresult) && !dbresult && !dbfield){
                            throw new Error("에러발생");
                        }

                        result.result = `${dbresult}개의 행을 삽입하는데 성공했습니다.`;
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
    
};