const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const maillSender = require('../../../T/mailsender');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');

module.exports = {
    find_f: async function(req, res){ // body.id, body.email
        let result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;
        let user = {
            id: req.body.id,
            email: req.body.email,
        };

        if(accessToken !== null){
            result.result = '로그아웃 후 이용해 주시기 바랍니다.';
            result.code = 400;
        } else {
            if(!commonFunction.idRegCheck(user.id)){ // id가 형식에 맞음
                result.result = '아이디 형식을 확인해주시기 바랍니다.';
                result.code = 400;
            } else if(!commonFunction.emailRegCheck(user.email)){ // email이 형식에 맞음
                result.result = '이메일 형식을 확인해주시기 바랍니다.';
                result.code = 400;
            } else{
                try{
                    PA1 = 'ui.pw as pw';
                    PA2 = `${dotEnv.USERINFO_UNION_MOREINFO} as ui`;
                    PA3 = `ui.id='${user.id}' AND ui.email='${user.email}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult.length > 0){
                        try {
                            
                            let mailResult = await maillSender.sendMail(user.email, `Accromemories 비밀번호 찾기 입니다.`, `비밀번호는 '${dbresult[0].pw}' 입니다.`);

                            if(mailResult !== null){
                                result.result = '이메일로 비밀번호를 보냈습니다.';
                                result.code = 200;
                            } else{
                                result.result = '유효한 이메일인지 확인해주세요.';
                                result.code = 400;
                            }
                        } catch (error) {
                            console.log(error);
                            result.result = '이메일 전송중 문제가 발생했습니다.';
                            result.code = 500;
                        }
                    } else{
                        result.result = '해당 아이디의 이메일이 일치하지 않습니다.';
                        result.code = 400;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '정보를 찾아오는 중 문제가 발생했습니다.';
                    result.code = 500;
                }
                
            }
        }
        commonFunction.sendResult(res, result);
    },
    find_id_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        var PA1, PA2, PA3;
        let user = {
            id: req.body.id,
            email: req.body.email,
        };

        if(accessToken !== null){
            result.result = '로그아웃 후 이용해 주시기 바랍니다.';
            result.code = 400;
        } else {
            if(!commonFunction.emailRegCheck(user.email)){ // email이 형식에 맞음
                result.result = '이메일 형식을 확인해주시기 바랍니다.';
                result.code = 400;
            } else{
                try{
                    PA1 = 'id';
                    PA2 = `moreinfo`;
                    PA3 = `email='${user.email}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult.length > 0){
                        try {
                            
                            let mailResult = await maillSender.sendMail(user.email, `Accromemories 아이디 찾기 입니다.`, `아이디는 '${dbresult[0].id}' 입니다.`);

                            if(mailResult !== null){
                                result.result = '이메일로 아이디를 보냈습니다.';
                                result.code = 200;
                            } else{
                                result.result = '유효한 이메일인지 확인해주세요.';
                                result.code = 400;
                            }
                        } catch (error) {
                            console.log(error);
                            result.result = '이메일 전송중 문제가 발생했습니다.';
                            result.code = 500;
                        }
                    } else{
                        result.result = '이메일이 맞는지 확인해주세요.';
                        result.code = 400;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '정보를 찾아오는 중 문제가 발생했습니다.';
                    result.code = 500;
                }
                
            }
        }
        commonFunction.sendResult(res, result);
    }
};