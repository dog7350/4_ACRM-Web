const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');

module.exports = {
    info_admin_update_f: async function(req, res){
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
                        colname: req.body.colname,
                        condition: req.body.condition
                    };

                    if(querySon.table === null || querySon.table === undefined){ // 테이블 이름이 없는 경우 종료
                        result.result = '테이블 명을 입력해야 합니다.';
                        result.code = 400;
                    } else if(querySon.colname === null || querySon.colname === undefined || querySon.colname.trim().length === 0){ // 수정내용이 없는 경우 종료
                        result.result = '수정할 값을 입력해야 합니다.';
                        result.code = 400;
                    } else if(querySon.condition === null || querySon.condition === undefined || querySon.condition.trim().length === 0){ // 조건이 없는 경우 종료
                        result.result = '수정할 조건을 입력해야 합니다.';
                        result.code = 400;
                    } else{ // 테이블 명이 존재하는 경우 실행
                        [dbresult, dbfield] = await DBReserved.dynamic_update(querySon.table, querySon.colname, querySon.condition);
                        
                        if(!Number.isInteger(dbresult) || !dbresult && !dbfield){
                            throw new Error("에러발생");
                        }

                        result.result = `${dbresult}개의 행을 수정하는데 성공했습니다.`;
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
    info_admin_ban_f: async function(req, res){
        var result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;

        if(accessToken === null){ // 로그인 안함
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else{
            accessToken = await TokenManager.verifyToken(accessToken, req);
            
            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(['o', 'm'].indexOf(accessToken.auth) === -1){ // admin이 o나 m이아님
                result.result = '접근 권한이 없습니다.';
                result.code = 400;
            } else{
                if(req.body){
                    try{
                        let querySon = {
                            id: req.body.targetid? req.body.targetid: null,
                            because: req.body.because? req.body.because: '',
                            ban_type: req.body.bantype? req.body.bantype.trim(): '',
                        };
    
                        if(querySon.id === null || querySon.id === undefined || !commonFunction.idRegCheck(querySon.id)){ // 정지 ID가 없는경우, 정규식에 맞지않는 경우
                            result.result = '정지할 아이디를 확인해주세요.';
                            result.code = 400;
                        } else if(querySon.ban_type === null || querySon.ban_type === undefined || querySon.ban_type.length === 0){ // 정지타입이 없는 경우 종료
                            result.result = '정지타입을 입력해야 합니다.';
                            result.code = 400;
                        } else if(dotEnv.BAN_TYPES.indexOf(querySon.ban_type) === -1){ // 정지타입이 없는 경우 종료
                            result.result = '유효하지 않은 정지타입 입니다.';
                            result.code = 400;
                        } else{
                            PA1 = '*';
                            PA2 = 'userinfo';
                            PA3 = `id='${querySon.id}'`;

                            [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '쿼리실행중 오류가 발생했습니다 입력한 정보를 다시 확인해 주세요. (102)';
                                result.code = 500;
                            } else if(dbresult.length === 0){
                                result.result = '존재하지않는 ID입니다.';
                                result.code = 400;
                            } else{
                                var tempAuth = dbresult[0].admin;

                                if(dbresult[0].id === accessToken.id){
                                    result.result = '자신의 정지값은 수정할 수 없습니다.';
                                    result.code = 400;
                                } else if(accessToken.auth === 'm'){
                                    if(['o', 'm'].indexOf(tempAuth) !== -1){
                                        result.result = '정지, 정지해제를 할 수 없는 ID입니다.';
                                        result.code = 400;
                                    }
                                }
                            }
                            
                            if(result.code !== 400){
                                PA1 = '*';
                                PA2 = '(SELECT a.*, b.timeStamp, b.ban_type, b.because FROM userinfo AS a LEFT OUTER JOIN banUser AS b ON a.id=b.id) AS c';
                                PA3 = `c.id='${querySon.id}'`;
    
                                [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
                                
                                if(dbresult === null){
                                    result.result = '쿼리실행중 오류가 발생했습니다 입력한 정보를 다시 확인해 주세요. (101)';
                                    result.code = 500;
                                } else if(dbresult.length === 0){
                                    result.result = '존재하지않는 ID입니다.';
                                    result.code = 400;
                                } else{
                                    if(dbresult[0].ban_type === null && dbresult[0].because === null){
                                        PA1 = dotEnv.BAN_TABLE;
                                        PA2 = '(id, ban_type, because)';
                                        PA3 = `'${querySon.id}', '${querySon.ban_type}', '${querySon.because}'`;
    
                                        [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);
    
                                        if(dbresult === null){
                                            result.result = '쿼리실행중 오류가 발생했습니다 입력한 정보를 다시 확인해 주세요. (101)';
                                            result.code = 500;
                                        } else if(dbresult === 0){
                                            result.result = '유저를 정지하지 못했습니다.';
                                            result.code = 400;
                                        } else{
                                            if(querySon.ban_type === 'x'){
                                                result.result = '유저 정지를 취소했습니다.';
                                                result.code = 200;
                                            } else if(querySon.ban_type === 'p'){
                                                result.result = '유저를 영구정지했습니다.';
                                                result.code = 200;
                                            } else{
                                                result.result = '유저를 정지했습니다.';
                                                result.code = 200;
                                            } 
                                        }
                                    } else{
                                        PA1 = dotEnv.BAN_TABLE;
                                        PA2 = `ban_type='${querySon.ban_type}'`;
                                        PA3 = `id='${querySon.id}'`;
    
                                        [dbresult, dbfield] = await DBReserved.dynamic_update(PA1, PA2, PA3);
    
                                        if(dbresult === null){
                                            result.result = '쿼리실행중 오류가 발생했습니다 입력한 정보를 다시 확인해 주세요. (101)';
                                            result.code = 500;
                                        } else if(dbresult === 0){
                                            result.result = '유저를 정지하지 못했습니다.';
                                            result.code = 400;
                                        } else{
                                            if(querySon.ban_type === 'x'){
                                                result.result = '유저 정지를 취소했습니다.';
                                                result.code = 200;
                                            } else if(querySon.ban_type === 'p'){
                                                result.result = '유저를 영구정지했습니다.';
                                                result.code = 200;
                                            } else{
                                                result.result = '유저를 정지했습니다.';
                                                result.code = 200;
                                            } 
                                        }
                                    }
                                }
                            }

                            
                        }
                    }
                    catch(error){
                        result.result = '쿼리실행중 오류가 발생했습니다 입력한 정보를 다시 확인해 주세요.';
                        result.code = 500;
                    }
                }
            } 
        }

        commonFunction.sendResult(res, result);
    },
    info_admin_authorize_f: async (req, res)=>{
        var result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;
        
        if(accessToken === null){ // 로그인 안함
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else{
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(['o', 'm'].indexOf(accessToken.auth) === -1){ // admin이 o임
                result.result = '접근 권한이 없습니다.';
                result.code = 400;
            } else{
                if(req.body){
                    try{
                        let tempBody = {
                            userid: req.body.userid,
                            changeAuth: req.body.changeauth,
                        };
    
                        if(!commonFunction.idRegCheck(tempBody.userid)){
                            result.result = '입력할 수 없는 ID 형식 입니다. 다시 확인해 주세요.';
                            result.code = 400;
                        } else if(tempBody.userid === accessToken.id){
                            result.result = '자신의 권한은 수정할 수 없습니다.';
                            result.code = 400;
                        } else if(tempBody.changeAuth === 'm' && accessToken.auth === 'm'){
                            result.result = '해당 권한으로는 부여할 수 없는 권한 값 입니다.';
                            result.code = 400;
                        } else if(['m', 'x'].indexOf(tempBody.changeAuth) !== -1){
                            PA1 = '*';
                            PA2 = 'userinfo';
                            PA3 = `id='${tempBody.userid}'`;

                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '쿼리 실행중 문제가 발생했습니다.';
                                result.code = 400;
                            } else if(dbresult.length === 0){
                                result.result = '해당 ID를 가진 유저가 존재하지 않습니다.';
                                result.code = 400;
                            } else {
                                PA1 = 'userinfo';
                                PA2 = `admin='${tempBody.changeAuth}'`;
                                PA3 = `id='${tempBody.userid}'`;

                                [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                                if(dbresult === null){
                                    result.result = '쿼리 실행중 문제가 발생했습니다.';
                                    result.code = 400;
                                } else if(dbresult === 0){
                                    result.result = '권한 부여에 실패했습니다. ID가 존재하는지 확인해주세요.';
                                    result.code = 400;
                                } else {
                                    result.result = '권한 부여에 성공했습니다.';
                                    result.code = 200;
                                }
                            }
                        } else{
                            result.result = '부여할 수 없는 권한입니다.';
                            result.code = 400;
                        }
                        
                    }
                    catch(error){
                        console.log(error);
                        result.result = '권한 부여중 오류가 발생했습니다.';
                        result.code = 500;
                    }
                } else{
                    result.result = '권한 부여를 위한 정보가 부족합니다.';
                    result.code = 400;
                }
            } 
        }

        commonFunction.sendResult(res, result);
    },
    info_admin_renamed_f: async (req, res)=>{
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
            } else if(['o', 'm'].indexOf(accessToken.auth) === -1){ // 'o', 'm' 권한을 가진 사람만 가능
                result.result = '접근 권한이 없습니다.';
                result.code = 400;
            } else{
                if(req.body){
                    try{
                        var PA1, PA2, PA3;

                        let tempBody = {
                            userid: req.body.userid,
                            changeName: req.body.changename,
                        };
    
                        if(!commonFunction.idRegCheck(tempBody.userid)){
                            result.result = '입력할 수 없는 ID 형식 입니다. 다시 확인해 주세요.';
                            result.code = 400;
                        } else if(commonFunction.nameRegCheck(tempBody.changeName)){
                            PA1 = '*';
                            PA2 = 'userinfo';
                            PA3 = `id='${tempBody.userid}'`;

                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '쿼리 실행중 문제가 발생했습니다.';
                                result.code = 400;
                            } else if(dbresult.length === 0){
                                result.result = '해당 ID를 가진 유저가 존재하지 않습니다.';
                                result.code = 400;
                            } else {
                                PA1 = 'moreinfo';
                                PA2 = `name='${tempBody.changeName}'`;
                                PA3 = `id='${tempBody.userid}'`;

                                [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                                if(dbresult === null){
                                    result.result = '쿼리 실행중 문제가 발생했습니다.';
                                    result.code = 400;
                                } else if(dbresult === 0){
                                    result.result = '이름 변경에 실패했습니다. ID가 존재하는지 확인해주세요.';
                                    result.code = 400;
                                } else {
                                    result.result = '이름 변경에 성공했습니다.';
                                    result.code = 200;
                                }
                            }
                        } else{
                            result.result = '바꿀 수 없는 이름입니다.';
                            result.code = 400;
                        }
                        
                    }
                    catch(error){
                        console.log(error);
                        result.result = '이름 변경중 오류가 발생했습니다.';
                        result.code = 500;
                    }
                } else{
                    result.result = '이름을 바꾸기 위한 정보가 부족합니다.';
                    result.code = 400;
                }
            } 
        }

        commonFunction.sendResult(res, result);
    },
};