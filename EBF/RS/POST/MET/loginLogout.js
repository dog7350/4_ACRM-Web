const DBPool = require('../../../T/db');
const dbReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');

module.exports = {
    login_f: async function(req, res){
        let result = {
            result: null,
            code: 200
        }; 
        var PA1, PA2, PA3;

        let user = {
            id: req.body.id,
            pw: req.body.pw
        };
        
        let dbresult, dbfield;

        if(TokenManager.getToken(req) === null){ // 토큰이 없는 경우
            
            let valid = commonFunction.isAcceptLogin(user);

            if(valid){ // body를 통해 들어온 id와 pw를 정규식으로 점검한 결과 에러 없음
                try{
                    PA1 = '*';
                    PA2 = 'userinfo';
                    PA3 = `id='${user.id}' AND pw='${user.pw}' LIMIT 1`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
                    
                    if(dbresult === null){
                        result.result = 'DB조회를 실패했습니다. (105)';
                        result.code = 500;
                    }
                    else if(dbresult.length === 1){ // id랑 pw 일치
                        user.auth = dbresult[0]['admin'];

                        PA1 = '*';
                        PA2 = dotEnv.BAN_TABLE;
                        PA3 = `id='${user.id}'`;

                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null) {
                            result.result = 'DB조회를 실패했습니다. (106)';
                            result.code = 500;
                        } else if(dbresult.length === 0 || dbresult[0].ban_type === 'x'){
                            res.cookie(
                                'accessToken', 
                                TokenManager.makeToken(user, req), 
                                {
                                    maxAge: 365 * 24 * 60 * 60 * 1000,
                                    httpOnly: false
                                });
    
                            result.result = '로그인 성공';
                            result.code = 200;
                        } else{
                            result.result = `현재 정지된 계정입니다.`;
                            result.because = dbresult[0].because;
                            result.timeStamp = dbresult[0].timeStamp;
                            result.code = 400;
                        }
                    } else{ // id나 pw가 일치하지 않음
                        result.result = '아이디나 비밀번호가 일치하지 않습니다.';
                        result.code = 400;
                    }
                }
                catch(error){ // db 조회중 오류발생
                    console.log(error);
                    result.result = '로그인중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            } else { // 정규식으로 점검한 결과 에러 발견
                var validError = commonFunction.validProblemIsHere(user);

                if(validError === 1) result.result = 'ID 형식을 다시 확인해주세요.';
                else if(validError === 2) result.result = 'PW 형식을 다시 확인해주세요.';
                else result.result = '아이디나 비밀번호가 일치하지 않습니다.'

                result.code = 400;
            }
        } else { // 토큰이 존재하는 경우
            result.result = '이미 로그인된 상태입니다.';
            result.code = 400;
        }
            
        commonFunction.sendResult(res, result);
    },
    logout_f: async function(req, res){
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req);

        if(accessToken){ // 토큰이 있는경우
            res.clearCookie('accessToken');
            result.result = '로그아웃 성공';
            result.code = 200;
        } else{ // 토큰이 없는 경우
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};