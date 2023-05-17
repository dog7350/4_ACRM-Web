const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');

module.exports = {
    /**
     * 현재 브라우저가 쿠키를 가지는지 값을 확인하는 url
     */
    cookie_check_f: async (req, res)=>{
        var result = {
            result: {loginStatus:null, loginValid: null},
            code: 200
        };
        var fakeResult = {
            result: null
        };

        let accessToken = TokenManager.getToken(req);
        let verifyToken = null;

        if(accessToken) {
            verifyToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(verifyToken)){
                TokenManager.tokenVerifyValue(verifyToken, fakeResult);
                result.result.loginValid = fakeResult.result;
                result.result.loginStatus = false;
            } else{
                result.result.loginValid = verifyToken.auth;
                result.result.loginStatus = true;
            }
        }
        else {
            result.result.loginStatus = false;
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};