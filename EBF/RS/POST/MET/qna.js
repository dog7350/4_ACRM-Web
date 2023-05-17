const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const maillSender = require('../../../T/mailsender');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');
const socketPartner = require('../../../T/socket/socketPartner');

module.exports = {
    add_qna_f: async (req, res)=>{
        let result = {
            result: null,
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
                    if(req.body){
                        if(req.body.title && req.body.title.length >= 5){
                            if(req.body.content && req.body.content.length >= 10){
                                PA1 = `${dotEnv.QNA_TABLE}`
                                PA2 = `(uploader, title, contents)`;
                                PA3 = `'${accessToken.id}', '${req.body.title}', '${req.body.content}'`;

                                [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);

                                if(dbresult === null){
                                    result.result = 'Q&A 등록중 문제가 발생했습니다.';
                                    result.code = 500;
                                } else{
                                    result.result = 'Q&A 등록에 성공했습니다.';
                                    result.code = 200;
                                }
                            } else{
                                result.result = '내용을 확인해주세요.';
                                result.code = 400;
                            }
                        } else{
                            result.result = '제목을 확인해주세요.';
                            result.code = 400;
                        }
                    } else{
                        result.result = 'Q&A 등록을 위해서는 제목과 내용이 필요합니다.';
                        result.code = 400;
                    }
                }
            } else{
                result.result = '로그인 후 이용가능한 서비스입니다.';
                result.code = 400;
            }
        }
        catch (error) {
            console.log(error);
            result.result = 'Q&A를 등록하는 과정에서 문제가 발생했습니다.';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    }, 
    answer_qna_f: async (req, res)=>{
        let result = {
            result: null,
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
                    if(['m', 'o'].indexOf(accessToken.auth) !== -1){
                        if(req.body){
                            if(req.body.asnwerContents && req.body.asnwerContents.length >= 10){
                                if(req.body.qindex && Number.isInteger(parseInt(req.body.qindex)) && parseInt(req.body.qindex) > 0){
                                    PA1 = '*';
                                    PA2 = dotEnv.QNA_TABLE;
                                    PA3 = `qindex=${parseInt(req.body.qindex)}`;

                                    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                                    if(dbresult === null){
                                        result.result = 'Q&A 번호 확인중 문제가 발생했습니다.';
                                        result.code = 500;
                                    } else if(dbresult.length === 0){
                                        result.result = '존재하지 않는 Q&A입니다.';
                                        result.code = 400;
                                    } else{
                                        let uploader = dbresult[0]['uploader'];
                                        let title = dbresult[0]['title'];
                                        let msg = {
                                            type: 400,
                                            content: commonFunction.changeBase64FromString(`Q&A [${title}]에 대한 답변이 작성되었습니다.`),
                                        };

                                        

                                        PA1 = dotEnv.QNA_TABLE;
                                        PA2 = `answerDate=now(), answerer='${accessToken.id}', asnwerContents='${req.body.asnwerContents}'`;
                                        PA3 = `qindex=${parseInt(req.body.qindex)}`;

                                        [dbresult, dbfield] = await DBReserved.dynamic_update(PA1, PA2, PA3);

                                        if(dbresult === null){
                                            result.result = 'Q&A 내용 업데이트 중 문제가 발생했습니다.';
                                            result.code = 500;
                                        } else{
                                            PA1 = 'communityNotifi';
                                            PA2 = "(publisher, receiver, content)"; 
                                            PA3 = `'${accessToken.id}', '${uploader}', '${JSON.stringify(msg)}'`;
                                            
                                            [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                                            socketPartner.socket_io_json.socket_io.to(uploader).emit('create_notifi', msg);

                                            result.result = '답변을 성공적으로 작성했습니다.';
                                            result.code = 200;
                                        }
                                    }
                                } else{
                                    result.result = 'Q&A 번호를 확인해주세요.';
                                    result.code = 400;
                                }

                            } else{
                                result.result = 'Q&A 답변 내용은 10글자 이상이여야 합니다.';
                                result.code = 400;
                            }
                        } else{
                            result.result = 'Q&A 답변작성을 위한 정보가 부족합니다.';
                            result.code = 400;
                        }
                    } else{
                        result.result = '권한이 부족합니다.';
                        result.code = 400;
                    }
                }
            } else{
                result.result = '로그인 후 이용가능한 서비스입니다.';
                result.code = 400;
            }
        }
        catch (error) {
            console.log(error);
            result.result = 'Q&A를 등록하는 과정에서 문제가 발생했습니다.';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
};