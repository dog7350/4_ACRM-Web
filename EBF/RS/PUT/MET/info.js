const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');

module.exports = {
    modify_pw_f: async function(req, res){
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

            if(accessToken === 0){
                result.result = '토큰이 유효하지 않습니다. 다시 로그인하고 시도해주세요.';
                result.code = 400;
            } else if(accessToken === 1){
                result.result = '토큰의 유효기간이 지났습니다. 다시 로그인하고 시도해 주세요.';
                result.code = 400;
            } else{
                let after = req.body.after;

                if(commonFunction.pwRegCheck(after)){ // 바꾸려는 비밀번호가 정규식에 부합한지 확인
                    try{
                        [dbresult, dbfield] = await DBReserved.dynamic_update(
                            "userinfo", 
                            `pw='${after}'`,
                            `id='${accessToken.id}'`);
    
                        if(dbresult > 0){
                            result.result = '비밀번호 변경에 성공했습니다.';
                            result.code = 200;
                        } else{
                            result.result = '비밀번호 변경에 실패했습니다.';
                            result.code = 200;
                        }
                    }
                    catch(error){
                        result.result = '비밀번호 변경중 문제가 발생했습니다.';
                        result.code = 500;
                    }
                } else{
                    result.result = '비밀번호 변경에 실패했습니다. (형식을 확인해 주세요.)';
                    result.code = 400;
                }
            }
        }
        commonFunction.sendResult(res, result);
    },
    modify_email_f: async function(req, res){
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
            } else{
                let after = req.body.after;

                if(commonFunction.emailRegCheck(after) || after.trim().length === 0){ // 바꾸려는 이메일이 정규식에 부합한지 확인 또는 없는경우
                    try{
                        console.log(after);
                        [dbresult, dbfield] = await DBReserved.dynamic_select('*', 'moreinfo', `email='${after}'`);

                        if(!dbresult){
                            result.result = '이메일 변경중 문제가 발생했습니다.';
                            result.code = 400;
                        } else if(dbresult.length > 0){
                            result.result = '이미 사용중인 이메일은 사용할 수 없습니다.';
                            result.code = 400;
                        } else{
                            [dbresult, dbfield] = await DBReserved.dynamic_update(
                                "moreinfo", 
                                `email='${after}'`,
                                `id='${accessToken.id}'`);
        
                            if(dbresult > 0){
                                result.result = '이메일 변경에 성공했습니다.';
                                result.code = 200;
                            } else{
                                result.result = '이메일 변경에 실패했습니다.';
                                result.code = 200;
                            }
                        }

                        
                    }
                    catch(error){
                        result.result = '이메일 변경중 문제가 발생했습니다.';
                        result.code = 500;
                    }
                } else{
                    result.result = '이메일 변경에 실패했습니다. (형식을 확인해 주세요.)';
                    result.code = 400;
                }
            }
        }
        commonFunction.sendResult(res, result);
    },
    modify_name_f: async function(req, res){
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

            if(accessToken === 0){
                result.result = '토큰이 유효하지 않습니다. 다시 로그인하고 시도해주세요.';
                result.code = 400;
            } else if(accessToken === 1){
                result.result = '토큰의 유효기간이 지났습니다. 다시 로그인하고 시도해 주세요.';
                result.code = 400;
            } else{
                let after = req.body.after;

                if(commonFunction.nameRegCheck(after)){ // 바꾸려는 이름이 정규식에 부합한지 확인
                    try{
                        [dbresult, dbfield] = await DBReserved.dynamic_update(
                            "moreinfo", 
                            `name='${after}'`,
                            `id='${accessToken.id}'`);


                        if(dbresult > 0){
                            result.result = '이름 변경에 성공했습니다.';
                            result.code = 200;
                        } else{
                            result.result = '이름 변경에 실패했습니다.';
                            result.code = 200;
                        }
                    }
                    catch(error){
                        result.result = '이름 변경중 문제가 발생했습니다.';
                        result.code = 500;
                    }
                } else{
                    result.result = '이름 변경에 실패했습니다. (형식을 확인해 주세요.)';
                    result.code = 400;
                }
            }
        }
        commonFunction.sendResult(res, result);
    },
    modify_phone_f: async function(req, res){
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

            if(accessToken === 0){
                result.result = '토큰이 유효하지 않습니다. 다시 로그인하고 시도해주세요.';
                result.code = 400;
            } else if(accessToken === 1){
                result.result = '토큰의 유효기간이 지났습니다. 다시 로그인하고 시도해 주세요.';
                result.code = 400;
            } else{
                let after = req.body.after;

                if(commonFunction.phoneRegCheck(after) || after.trim().length === 0){ // 바꾸려는 휴대폰 번호가 정규식에 부합한지 확인 또는 길이가 0인 경우
                    try{
                        [dbresult, dbfield] = await DBReserved.dynamic_update(
                            "moreinfo", 
                            `phone='${after}'`,
                            `id='${accessToken.id}'`);
    

                        if(dbresult > 0){
                            result.result = '휴대폰번호 변경에 성공했습니다.';
                            result.code = 200;
                        } else{
                            result.result = '휴대폰번호 변경에 실패했습니다.';
                            result.code = 200;
                        }
                    }
                    catch(error){
                        result.result = '휴대폰번호 변경중 문제가 발생했습니다.';
                        result.code = 500;
                    }
                } else{
                    result.result = '휴대폰번호 변경에 실패했습니다. (형식을 확인해 주세요.)';
                    result.code = 400;
                }
            }
        }
        commonFunction.sendResult(res, result);
    },
    modify_address_f: async function(req, res){
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

            if(accessToken === 0){
                result.result = '토큰이 유효하지 않습니다. 다시 로그인하고 시도해주세요.';
                result.code = 400;
            } else if(accessToken === 1){
                result.result = '토큰의 유효기간이 지났습니다. 다시 로그인하고 시도해 주세요.';
                result.code = 400;
            } else{
                let after = req.body.after;

                try{
                    [dbresult, dbfield] = await DBReserved.dynamic_update(
                        "moreinfo", 
                        `address='${after}'`,
                        `id='${accessToken.id}'`);

                    if(dbresult > 0){
                        result.result = '주소 변경에 성공했습니다.';
                        result.code = 200;
                    } else{
                        result.result = '주소 변경에 실패했습니다.';
                        result.code = 200;
                    }
                }
                catch(error){
                    result.result = '주소 변경중 문제가 발생했습니다.';
                    result.code = 500;
                }
            }
        }
        commonFunction.sendResult(res, result);
    },
};