const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const maillSender = require('../../../T/mailsender');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');

module.exports = {
    get_qna_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        let PA1, PA2, PA3;

        try {
            if(accessToken){
                accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    await TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    PA1 = `*`;
                    PA2 = `${dotEnv.QNA_TABLE}`;
                    PA3 = `uploader='${accessToken.id}' ORDER BY qindex desc`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){
                        result.result = 'Q&A를 가져오는 과정에서 문제가 발생했습니다. (100)';
                        result.code = 500;
                    } else{
                        for(var i in dbresult){
                            result.result.push({
                                ...dbresult[i],
                                isAnswerd: dbresult[i]['answerer'] !== null
                            });
                        }
                    }
                }
            } else{
                result.result = '로그인 후 이용가능한 서비스입니다.';
                result.code = 400;
            }
        }
        catch (error) {
            console.log(error);
            result.result = 'Q&A를 가져오는 과정에서 문제가 발생했습니다.';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    }, 
    get_qna_all_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        let PA1, PA2, PA3;

        try {
            PA1 = `*`;
            PA2 = `${dotEnv.QNA_TABLE}`;
            PA3 = `1=1 ORDER BY qindex desc`;

            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

            if(dbresult === null){
                result.result = 'Q&A를 가져오는 과정에서 문제가 발생했습니다. (100)';
                result.code = 500;
            } else{
                for(var i in dbresult){
                    result.result.push({
                        ...dbresult[i],
                        isAnswerd: dbresult[i]['answerer'] !== null
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            result.result = 'Q&A를 가져오는 과정에서 문제가 발생했습니다.';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    get_qna_all_a_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
        let PA1, PA2, PA3;

        try {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                PA1 = `*`;
                PA2 = `${dotEnv.QNA_TABLE}`;
                PA3 = `1=1 ${['m', 'o'].indexOf(accessToken.auth) === -1? '': `AND ISNULL(answerer)`} ORDER BY qindex desc`;

                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
                if(dbresult === null){
                    result.result = 'Q&A를 가져오는 과정에서 문제가 발생했습니다. (100)';
                    result.code = 500;
                } else{
                    for(var i in dbresult){
                        result.result.push({
                            ...dbresult[i],
                            isAnswerd: dbresult[i]['answerer'] !== null
                        });
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            result.result = 'Q&A를 가져오는 과정에서 문제가 발생했습니다.';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    }, 
};