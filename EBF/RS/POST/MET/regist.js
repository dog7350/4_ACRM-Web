const DBReserved = require('./../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const maillSender = require('../../../T/mailsender');
const tokenManager = require('../../../T/tokenManager');
const dbReserved = require('./../../../T/dbReserved');

module.exports = {
    regist_f: async function(req, res){
        let result = {
            result: null,
            code: 200
        };
        var PA1, PA2, PA3;
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        
        if(accessToken === null){ // 로그인이 안되있는 경우
            let user = {
                id: req.body.id,
                pw: req.body.pw,
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                address: (req.body.address === undefined? null: req.body.address),
                auth: null,
                expTime: (Date.now()+(5*60*1000)),
            };
            
            let valid = commonFunction.checkUserVaild(user);

            if(valid){ // 정규식으로 점검한 결과 에러 없음
                try{
                    PA1 = '*';
                    PA2 = 'moreinfo';
                    PA3 = `id='${user.id}' OR email='${user.email}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult.length === 0){ // id 없음
                        try{
                            var [certToken, certifi] = TokenManager.makeRegistToken(user, req);

                            let mailResult = await maillSender.sendMail(user.email, '회원가입 인증토큰',`인증코드:<br>${certifi}<hr>유효기간은 5분입니다.`);

                            if(mailResult !== null){
                                res.clearCookie('registToken');
                                res.cookie('registToken', certToken, {maxAge: 10 * 60 * 1000, httpOnly: true});

                                result.result = '이메일로 인증토큰을 전송했습니다. 유효기간은 5분입니다.'
                                result.code = 200;
                            } else{
                                result.result = '인증토큰 전송을 실패했습니다. 다른 이메일을 사용해주세요.';
                                result.code = 400;
                            }
                        }
                        catch(error){
                            console.log(error);
                            result.result = '회원가입중 오류가 발생했습니다. 이메일을 확인해주세요. (100)'
                            result.code = 500;
                        }
                    } else{ // id 있음
                        result.result = '이미 존재하는 아이디 입니다.'
                        result.code = 400;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '회원가입중 오류가 발생했습니다. (101)'
                    result.code = 500;
                }
            } else { // 정규식으로 점검한 결과 에러 발견
                var validError = commonFunction.validProblemIsHere(user);
                if(validError === 1) result.result = 'ID 형식을 다시 확인해주세요.';
                else if(validError === 2) result.result = 'PW 형식을 다시 확인해주세요.';
                else if(validError === 3) result.result = 'Email 형식을 다시 확인해주세요.';
                else if(validError === 4) result.result = 'Name 형식을 다시 확인해주세요.';
                else if(validError === 5) result.result = 'PhoneNumber 형식을 다시 확인해주세요.';
                else {
                    console.log('regist.js에서 정규식으로 점검못하는 문제 발생');
                    result.result = '회원가입중 오류가 발생했습니다.  (102)';
                }
                result.code = 400;
            }
        } else { // 로그인된 경우
            result.result = '로그아웃후 이용해 주시기 바랍니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    regist_cert_f: async function(req, res){
        let result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;

        let accessToken = TokenManager.getToken(req);

        if(accessToken === null){ // 로그인이 안되있는 경우
            let cert = req.cookies.registToken? req.cookies.registToken: false;
            let mailSignature = req.body.cert? req.body.cert: false;

            if(cert && mailSignature){ // 가입용 토큰과 인증 토큰이 존재하는지 확인
                try{
                    var certIsSuccess = false;

                    try{
                        cert = await tokenManager.verifyRegistToken(cert, req, mailSignature);
                        certIsSuccess = true;
                    }
                    catch(error){
                        console.log(error);
                        certIsSuccess = false;
                    }
                    
                    if(!certIsSuccess){ // 인증코드 해석중 문제가 발생한경우
                        result.result = '인증코드 해석중 문제가 발생했습니다.';
                        result.code = 400;
                    } else if(Number.isInteger(cert)){ // 인증코드가 만료된 경우
                        if(cert === 0){
                            result.result = '유효하지 않은 토큰입니다.';
                        } else if(cert === 1){
                            result.result = '토큰과 인증코드가 맞지않습니다.';
                        }
                        
                        result.code = 400;
                    } else{
                        let timeCheck = cert.expTime >= Date.now();

                        if(timeCheck){ // 토큰 유효기간이 안지났음
                            [dbresult, dbfield] = await DBReserved.select_userinfo_by_id(cert.id);

                            if(dbresult.length === 0){ // id 없음
                                [dbresult, dbfield] = await DBReserved.dynamic_select('*', 'moreinfo', `email='${cert.email}'`);
                                
                                if(dbresult.length === 0){ // 이메일 사용가능
                                    try{
                                        [dbresult, dbfield] = await DBReserved.insert_userinfo_instance(cert);
    
                                        if(dbresult === 3){
                                            result.result = '회원가입 성공'
                                            result.code = 200;
                                            res.clearCookie('registToken');
                                        } else if(dbresult === null){
                                            throw new Error('회원가입 실패');
                                        }
                                    }
                                    catch(error){
                                        console.log(error);
                                        result.result = '회원가입중 오류가 발생했습니다. (100)'
                                        result.code = 500;
                                    }
                                } else{
                                    result.result = '이미 사용된 토큰이므로 다시 발급받아야 합니다. (102)'
                                    result.code = 400;
                                }
                            } else{ // id 있음
                                result.result = '이미 사용된 토큰이므로 다시 발급받아야 합니다.'
                                result.code = 400;
                            }
                        } else{
                            result.result = '인증코드의 유효기간이 만료되었습니다.';
                            result.code = 400;
                        }
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '인증토큰 확인중 오류가 발생했습니다. (101)'
                    result.code = 500;
                }
            } else{
                result.result = '유효하지 않은 인증코드입니다.';
                result.code = 400;
            }
        } else { // 로그인된 경우
            result.result = '로그아웃후 이용해 주시기 바랍니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};