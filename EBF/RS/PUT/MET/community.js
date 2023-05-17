const DBReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dbReserved = require('../../../T/dbReserved');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const { NONAME } = require('dns');

const logoStorage = multer.diskStorage({
    destination: async (req, file, callback)=>{
        try{
            // console.log(file);
            callback(null, './public/images/board/logos');
        }
        catch(error){
            console.log(error);
        }
    },
    filename: (req, file, callback)=>{
        callback(null, commonFunction.changeBase64FromString(`${Date.now()}${file.originalname}`)+`.${file.mimetype.split('/')[1]}`);
    },
});

const boardStorage = multer.diskStorage({
    destination: async (req, file, callback)=>{
        try{
            // console.log(file);
            callback(null, './public/images/board/contents');
        }
        catch(error){
            console.log(error);
        }
    },
    filename: (req, file, callback)=>{
        callback(null, commonFunction.changeBase64FromString(`${Date.now()}${file.originalname}`)+`.${file.mimetype.split('/')[1]}`);
    },
});

const logoUpload = multer({
    storage: logoStorage, 
    limits: 5 * 1024 * 1024, 
    fileFilter: (req, file, cb) => {
    if (dotEnv.ALLOW_MIMETYPES.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('dGhpc2lzbm90anBlZ3BuZ2pwZ2ltYWdlISE'));
    }
}});

const boardUpload = multer({
    storage: boardStorage, 
    limits: 5 * 1024 * 1024, 
    fileFilter: (req, file, cb) => {
    if (dotEnv.ALLOW_MIMETYPES.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('dGhpc2lzbm90anBlZ3BuZ2pwZ2ltYWdlISE'));
    }
}});

const updateRecco = async (req, result)=>{
    let dbresult, dbfield;
    let accessToken = TokenManager.getToken(req);
    accessToken = await TokenManager.verifyToken(accessToken, req);

    let rtype = req.body.rtype;
    let index = parseInt(req.body.index);
    let isUpdateBoard = req.body.isupdate;
    var PA1, PA2, PA3;

    isUpdateBoard = isUpdateBoard === 'b';

    PA1 = '*';
    PA2 = isUpdateBoard? dotEnv.BOARD_TABLE: dotEnv.COMMENT_TABLE;
    PA3 = `${isUpdateBoard? dotEnv.BOARD_TABLE: dotEnv.COMMENT_TABLE}.index=${index}`;

    try {
        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

        if(dbresult === null){ // 게시글 또는 댓글 select중 문제발생
            result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다.(102)`;
            result.code = 500;
        } else if(dbresult.length === 0){ // 게시글 또는 댓글이 없는 경우
            result.result = `${isUpdateBoard? '게시': '댓'}글이 존재하지 않습니다.`;
            result.code = 400;
        } else if(isUpdateBoard? (dbresult[0].hideLevel === 3 && accessToken.auth !== 'o'): false){ // 게시글의 숨김레벨이 3이면서 권한 'o'가 아닌경우
            result.result = `수정할 수 없는 게시글 입니다.`;
            result.code = 400;
        } else{ // 게시글 또는 댓글 존재
            PA1 = '*';
            PA2 = isUpdateBoard? dotEnv.BOARD_REC_TABLE: dotEnv.COMMENT_REC_TABLE;
            PA3 = `id='${accessToken.id}' AND ${isUpdateBoard? 'bindex': 'cindex'}=${index}`;

            try{
                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
                if(dbresult === null){ // 게시글 또는 댓글 추천 확인중 문제발생
                    result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다.`;
                    result.code = 500;
                } else if(dbresult.length === 0){ // 해당 게시글 또는 댓글에 추천 또는 비추천 하지 않은상태
                    PA1 = isUpdateBoard? dotEnv.BOARD_REC_TABLE: dotEnv.COMMENT_REC_TABLE;
                    PA2 = '';
                    PA3 = `'${accessToken.id}', ${index}, '${rtype}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);
    
                    if(dbresult === null || dbresult === 0){
                        result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (100)`;
                        result.code = 500;
                    } else{
                        result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}을 성공했습니다.`;
                        result.teeback = 0;
                        result.code = 200;
                    }
                } else{ // 해당 게시글 또는 댓글에 추천 또는 비추천이 있는 상태
                    PA1 = '*';
                    PA2 = isUpdateBoard? dotEnv.BOARD_REC_TABLE: dotEnv.COMMENT_REC_TABLE;
                    PA3 = `id='${accessToken.id}' AND ${isUpdateBoard? 'bindex': 'cindex'}=${index} AND recType='${rtype}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){ // 게시글 또는 댓글 추천 확인중 문제발생
                        result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (104)`;
                        result.code = 500;
                    } else if(dbresult.length === 1){ // 추천된 상태에서 추천하거나, 비추천 상태에서 비추천한 경우
                        PA1 = isUpdateBoard? dotEnv.BOARD_REC_TABLE: dotEnv.COMMENT_REC_TABLE;
                        PA2 = `id='${accessToken.id}' AND ${isUpdateBoard? 'bindex': 'cindex'}=${index}`;

                        [dbresult, dbfield] = await dbReserved.dynamic_delete(PA1, PA2);

                        if(dbresult === null){ // 게시글 또는 댓글 추천 확인중 문제발생
                            result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (107)`;
                            result.code = 500;
                        } else if(dbresult === 0){
                            result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (109)`;
                            result.code = 500;
                        } else{
                            result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}을 취소했습니다.`;
                            result.teeback = 2;
                            result.code = 200;
                        }
                    } else{ // 추천된 상태에서 비추천하거나, 비추천 상태에서 추천한 경우 update함
                        PA1 = isUpdateBoard? dotEnv.BOARD_REC_TABLE: dotEnv.COMMENT_REC_TABLE;
                        PA2 = `recType='${rtype}'`;
                        PA3 = `id='${accessToken.id}' AND ${isUpdateBoard? 'bindex': 'cindex'}=${index}`;

                        [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                        if(dbresult === null){ // 게시글 또는 댓글 추천 확인중 문제발생
                            result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (110)`;
                            result.code = 500;
                        } else if(dbresult === 0){
                            result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (111)`;
                            result.code = 500;
                        } else{
                            result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}을 성공했습니다.`;
                            result.teeback = 1;
                            result.code = 201;
                        }
                    }

                    
                }
            }
            catch(error){
                console.log(error);
                result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (100)`;
                result.code = 500;
            } 
        }
    } 
    catch (error) {
        result.result = `${isUpdateBoard? '게시': '댓'}글 ${rtype==='x'?'비추천':'추천'}중 문제가 발생했습니다. (101)`;
        result.code = 500;
    }
}

const updateObjec = async (req, result)=>{
    let dbresult, dbfield;
    let accessToken = TokenManager.getToken(req);
    accessToken = await TokenManager.verifyToken(accessToken, req);

    let objectiontext = req.body.objectiontext;
    let index = parseInt(req.body.index);
    let isUpdateBoard = req.body.isupdate;
    var PA1, PA2, PA3;

    isUpdateBoard = isUpdateBoard === 'b';

    PA1 = '*';
    PA2 = isUpdateBoard? dotEnv.BOARD_TABLE: dotEnv.COMMENT_TABLE;
    PA3 = `${isUpdateBoard? dotEnv.BOARD_TABLE: dotEnv.COMMENT_TABLE}.index=${index}`;

    try {
        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

        if(dbresult === null){ // 게시글 또는 댓글 select중 문제발생
            result.result = `${isUpdateBoard? '게시': '댓'}글 신고중 문제가 발생했습니다.(102)`;
            result.code = 500;
        } else if(dbresult.length === 0){ // 게시글 또는 댓글이 없는 경우
            result.result = `신고할 ${isUpdateBoard? '게시': '댓'}글이 존재하지 않습니다.`;
            result.code = 400;
        } else{ // 게시글 또는 댓글 존재
            PA1 = '*';
            PA2 = isUpdateBoard? dotEnv.BOARD_OBJ_TABLE: dotEnv.COMMENT_OBJ_TABLE;
            PA3 = `id='${accessToken.id}' AND ${isUpdateBoard? 'bindex': 'cindex'}=${index}`;

            try{
                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
                if(dbresult === null){ // 게시글 또는 댓글 추천 확인중 문제발생
                    result.result = `${isUpdateBoard? '게시': '댓'}글 신고중 문제가 발생했습니다.`;
                    result.code = 500;
                } else if(dbresult.length === 0){ // 해당 게시글 또는 댓글을 신고 하지 않은상태
                    PA1 = isUpdateBoard? dotEnv.BOARD_OBJ_TABLE: dotEnv.COMMENT_OBJ_TABLE;
                    PA2 = '';
                    PA3 = `'${accessToken.id}', ${index}, '${commonFunction.changeBase64FromString(objectiontext)}'`;

                    [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);
    
                    if(dbresult === null || dbresult === 0){
                        result.result = `${isUpdateBoard? '게시': '댓'}글 신고중 문제가 발생했습니다. (100)`;
                        result.code = 500;
                    } else{
                        result.result = `${isUpdateBoard? '게시': '댓'}글을 신고했습니다.`;
                        result.code = 200;
                    }
                } else{ // 해당 게시글 또는 댓글을 신고한 상태
                    result.result = `이미 신고한 ${isUpdateBoard? '게시': '댓'}글 입니다.`;
                    result.code = 200;
                }
            }
            catch(error){
                console.log(error);
                result.result = `${isUpdateBoard? '게시': '댓'}글을 신고중 문제가 발생했습니다. (100)`;
                result.code = 500;
            } 
        }
    } 
    catch (error) {
        result.result = `${isUpdateBoard? '게시': '댓'}글 신고중 문제가 발생했습니다. (101)`;
        result.code = 500;
    }
};

module.exports = {
    update_board_f: [boardUpload.array('imageFiles', 4), async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 

        let tempBoard = {
            title: req.body? req.body.title: '',
            content: req.body? req.body.content: '',
            hideLevel: req.body? req.body.hideLevel: -1,
            type: req.body? req.body.type: -1,
            updateIndex: req.body? Number.isInteger(parseInt(req.body.boardIndex))? parseInt(req.body.boardIndex): 0: 0,
            imgPath: '',
            beforeImgPath: '',
        };

        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        let baseImgPath = '/images/board/contents/';
        let fileExist = false;
        
        if(req.files){
            for(var i = 0; i < req.files.length; i++) {
                if(tempBoard.imgPath === '') tempBoard.imgPath = `${baseImgPath}${req.files[i].filename}`;
                else tempBoard.imgPath = tempBoard.imgPath.concat(`c3BhY2VcdA==${baseImgPath}${req.files[i].filename}`);
                fileExist = true;
            }
        }  
        
        tempBoard.imgPath = tempBoard.imgPath.trim();

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    // console.log(tempBoard);
                    [dbresult, dbfield] = await dbReserved.dynamic_select('*', `${dotEnv.BOARD_TABLE} as a`, `a.index=${tempBoard.updateIndex? tempBoard.updateIndex: 0}`);
                    // console.log(dbresult);

                    if(dbresult === null || dbresult.length === 0){ // 게시글이 없는 경우
                        result.result = '게시글이 존재하지 않습니다.';
                        result.code = 400;
                    } else if(dbresult[0].uploadId === accessToken.id || ['o', 'm'].indexOf(accessToken.auth) !== -1){// 업로드한 사람이거나 관리자인 경우
                        tempBoard.title = tempBoard.title? commonFunction.changeBase64FromString(tempBoard.title): dbresult[0].title;
                        tempBoard.content = tempBoard.content? commonFunction.changeBase64FromString(tempBoard.content): dbresult[0].content;
                        tempBoard.type = tempBoard.type? tempBoard.type: dbresult[0].type;
                        tempBoard.hideLevel = tempBoard.hideLevel? tempBoard.hideLevel: dbresult[0].hideLevel;
                        tempBoard.beforeImgPath = fileExist ? dbresult[0].imgPath: '';

                        result.code = 200;
                    } else{ // 게시글은 있으나 업로드한 사람도 아니고 권한도 없음
                        result.result = '게시글을 수정할 권한이 없습니다.';
                        result.code = 400;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '게시글정보를 수정하는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }

                if(result.code === 200){ // 게시글 수정이 허용된 경우
                    if(!(tempBoard.title.trim().length > 0)){ // 제목이 0보다 커야함
                        result.result = "제목은 앞뒤공백을 제외한 1글자 이상이여야 합니다.";
                        result.code = 400;
                    } else if(!(tempBoard.content.trim().length > 0)){ // 게시글 크기가 0보다 커야함
                        result.result = "게시글은 앞뒤공백을 제외한 1글자 이상이여야 합니다.";
                        result.code = 400;
                    } else if(!Number.isInteger(parseInt(tempBoard.hideLevel))){ // 공개범위가 숫자가 아닌경우
                        // 0 all, 1 friend,follower, 2 friend, 
                        // 게시글 공개범위 설정은 숫자이고 0~3 사이의 정수여야함
                        result.result = "유효하지 않은 게시글 공개범위입니다. (100)";
                        result.code = 400;
                    } else if(!(parseInt(tempBoard.hideLevel) > -1 && parseInt(tempBoard.hideLevel) < 3)){ // 공개범위가 값을 넘어선 경우
                        // 0 all, 1 friend,follower, 2 friend, 
                        // 게시글 공개범위 설정은 숫자이고 0~3 사이의 정수여야함
                        result.result = "유효하지 않은 게시글 공개범위입니다. (101)";
                        result.code = 400;
                    } else if(!Number.isInteger(parseInt(tempBoard.type))){ // 게시글 타입이 숫자가 아닌경우 
                        // 1 none, 2 humor, 3 info, 4 notice
                        // 게시글 타입은 숫자이고 1~4 사이의 정수여야함
                        result.result = "유효하지 않은 게시글 타입입니다. (102)";
                        result.code = 400;
                    } else if(!(parseInt(tempBoard.type) > 0 && parseInt(tempBoard.type) < 5)){ // 게시글 타입이 값을 넘어선 경우
                        // 1 none, 2 humor, 3 info, 4 notice
                        // 게시글 타입은 숫자이고 1~4 사이의 정수여야함
                        result.result = "유효하지 않은 게시글 타입입니다. (103)";
                        result.code = 400;
                    } else if(accessToken.auth !== 'o' && tempBoard.type === 4){
                        result.result = "유효하지 않은 게시글 타입입니다. (104)";
                        result.code = 400;
                    } else{
                        try{
                            var PA1, PA2, PA3;

                            PA1 = `${dotEnv.BOARD_TABLE} as a`;
                            PA2 = `title='${tempBoard.title}', content='${tempBoard.content}', type='${tempBoard.type}', hideLevel='${tempBoard.hideLevel}' ${fileExist? `, imgpath='${tempBoard.imgPath}'`: ''}`;
                            PA3 = `a.index=${tempBoard.updateIndex}`;

                            [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);
                            
                            if(dbresult === 0 || dbresult === null){ // 수정실패 
                                result.result = "게시글 수정에 실패했습니다.";
                                result.code = 400;
                            } else{ // 수정성공
                                result.result = "게시글을 수정했습니다.";
                                result.code = 200;

                                if(fileExist){ // 파일을 바꿧다면 기존의 파일삭제
                                    commonFunction.deleteFile(tempBoard.beforeImgPath, path.join(__dirname, '..', '..', '..', '..', 'public'));

                                    // let beforeImgPathArray = tempBoard.beforeImgPath.split('c3BhY2VcdA==');
                                    // for(var i = 0; i < beforeImgPathArray.length; i++){
                                    //     fs.unlink(path.join(__dirname, '..', '..', '..', '..', 'public', beforeImgPathArray[i]), (err)=>{
                                    //         if(err){
                                    //             console.log("community.js에서 이전파일을 지우는 중 문제발생 asdsad");
                                    //             console.log(err);
                                    //         }
                                    //     });
                                    // }
                                }
                            }
                        }
                        catch(error){
                            console.log(error);
                            result.result = '게시글정보를 수정하는 중 오류가 발생했습니다. (100)'
                            result.code = 500;
                        }
                    }
                } else{
                    // 수정을 못하는 경우
                }
                
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }
        
        if(result.code != 200){ // 수정에 실패했으므로 수정하려 했던 파일 삭제
            var filePath = path.join(__dirname, '..', '..', '..', '..', 'public', baseImgPath);

            if(req.files){

                commonFunction.deleteFile(tempBoard.imgPath, path.join(__dirname, '..', '..', '..', '..', 'public'));

                // for(var i = 0; i < req.files.length; i++){
                //     fs.unlink(`${filePath}${req.files[i].filename}`, (err)=>{
                //         if(err){
                //             console.log("community.js에서 파일을 지우는 중 문제발생");
                //             console.log(err);
                //         }
                //     });
                // }
            }
        }

        commonFunction.sendResult(res, result);
    }],
    update_comment_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;
        var PA1, PA2, PA3;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                let tempComment4Write = {
                    cindex: req.body? req.body.cindex? parseInt(req.body.cindex): 0: 0,
                    content: req.body? req.body.content? req.body.content.trim(): '': '',
                };
                
                if(!Number.isInteger(tempComment4Write.cindex) || !(tempComment4Write.cindex > 0)){
                    result.result = '유효하지 않은 댓글번호입니다.';
                    result.code = 400;
                } else if(!(tempComment4Write.content.length > 0)){ // 게시글 크기가 0보다 커야함
                    result.result = "댓글 내용은 앞뒤공백을 제외한 1글자 이상이여야 합니다.";
                    result.code = 400;
                } else{
                    PA1 = '*';
                    PA2 = dotEnv.COMMENT_TABLE;
                    PA3 = `${dotEnv.COMMENT_TABLE}.index=${tempComment4Write.cindex}`;

                    try{
                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){ // 글번호로 게시글 조회중 문제발생
                            result.result = '댓글 수정중 문제가 발생했습니다. (100)';
                            result.code = 500;
                        } else if(dbresult.length === 0){ // 글번호를 가진 댓글이 존재하지 않음
                            result.result = '존재하지 않는 댓글번호입니다. (100)';
                            result.code = 400;
                        } else if(accessToken.auth !== 'o' && dbresult[0].hideLevel !== 0){
                            result.result = '권한이 부족하여 수정할 수 없는 댓글입니다.';
                            result.code = 400;
                        } else if(dbresult[0].uploadId === accessToken.id || ['o', 'm'].indexOf(accessToken.auth) !== -1){ // 댓글을 작성한 사람이거나 권한이 'o'인 경우 수정
                            PA1 = dotEnv.COMMENT_TABLE;
                            PA2 = `content='${commonFunction.changeBase64FromString(tempComment4Write.content)}'`;
                            PA3 = `${dotEnv.COMMENT_TABLE}.index=${tempComment4Write.cindex}`;

                            [dbresult, dbfield] = await DBReserved.dynamic_update(PA1, PA2, PA3);

                            if(dbresult === null){ // 글번호로 게시글 조회중 문제발생
                                result.result = '댓글 수정중 문제가 발생했습니다. (101)';
                                result.code = 500;
                            } else if(dbresult=== 0){ // 글번호를 가진 게시글이 존재하지 않음
                                result.result = '댓글 수정에 실패했습니다.';
                                result.code = 400;
                            } else{
                                result.result = '댓글 수정에 성공했습니다.';
                                result.code = 200;
                            }
                        }
                    }
                    catch(error){
                        console.log(error);
                        result.result = '댓글 수정중 문제가 발생했습니다.';
                        result.code = 500;
                    }
                } 
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    update_logo_f: [logoUpload.array('imageFiles', 1), async (req, res)=>{ // 최초 글 호출
        let result = {
            result: null,
            code: 200
        }; 

        let imgPath = '';
        let beforeImgPath = '';
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        let baseImgPath = '/images/board/logos/';
        let fileExist = false;
        
        var PA1, PA2, PA3;

        // console.log(req.files);

        if(req.files && req.files.length > 0){
            fileExist = true;
            imgPath = `${baseImgPath}${req.files[0].filename}`;
        }  
        
        imgPath = imgPath.trim();

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(!req.files){ // 수정할 로고 파일이 없는 경우
                // result.result = '로고 수정을 위한 파일이 없습니다.';
                // result.code = 400;
                PA1 = '*';
                PA2 = dotEnv.LOGO_TABLE;
                PA3 = `id='${accessToken.id}'`;

                try{
                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
        
                    if(dbresult === null){ // 아이디가 없는 경우
                        result.result = '로고 업로드를 위한 확인중 문제가 발생했습니다. (117)';
                        result.code = 500;
                    } else if(dbresult.length === 0){ // 현재 로고가 없는 상태
                        
                    } else{ // 기존 로고가 있는 상태
                        beforeImgPath = dbresult[0].logoPath;

                        PA1 = dotEnv.LOGO_TABLE;
                        PA2 = `logoPath='/images/board/logos/none.png'`;
                        PA3 = `id='${accessToken.id}'`;

                        [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '로고 수정중 문제가 발생했습니다. (202)';
                            result.code = 500;

                            PA1 = dotEnv.LOGO_TABLE;
                            PA2 = `logoPath='${beforeImgPath}'`;
                            PA3 = `id='${accessToken.id}'`;
    
                            [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);
                        } else if(dbresult === 0){
                            result.result = '로고 수정을 실패했습니다.';
                            result.code = 500;
                        } else{
                            result.result = '로고를 수정했습니다.';
                            result.code = 200;

                            commonFunction.deleteFile(beforeImgPath, path.join(__dirname, '..', '..', '..', '..', 'public'));
                        }
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '로고를 수정하는 중 오류가 발생했습니다. (113)'
                    result.code = 500;
                }  
            } else{
                

                PA1 = '*';
                PA2 = dotEnv.LOGO_TABLE;
                PA3 = `id='${accessToken.id}'`;

                try{
                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
        
                    if(dbresult === null){ // 아이디가 없는 경우
                        result.result = '로고 업로드를 위한 확인중 문제가 발생했습니다.';
                        result.code = 500;
                    } else if(dbresult.length === 0){ // 현재 로고가 없는 상태
                        PA1 = dotEnv.LOGO_TABLE;
                        PA2 = '';
                        PA3 = `'${accessToken.id}', '${imgPath}'`;

                        [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);
        
                        if(dbresult === null || dbresult === 0){
                            result.result = '로고 수정중 문제가 발생했습니다. (100)';
                            result.code = 500;
                        } else{
                            result.result = '로고를 수정했습니다.';
                            result.code = 200;
                        }
                    } else{ // 현재 로고가 있는 상태
                        beforeImgPath = dbresult[0].logoPath;

                        PA1 = dotEnv.LOGO_TABLE;
                        PA2 = `logoPath='${imgPath}'`;
                        PA3 = `id='${accessToken.id}'`;

                        [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '로고 수정중 문제가 발생했습니다. (102)';
                            result.code = 500;
                        } else if(dbresult === 0){
                            result.result = '로고 수정을 실패했습니다.';
                            result.code = 500;
                        } else{
                            result.result = '로고를 수정했습니다.';
                            result.code = 200;

                            commonFunction.deleteFile(beforeImgPath, path.join(__dirname, '..', '..', '..', '..', 'public'));
                        }
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '로고를 수정하는 중 오류가 발생했습니다. (103)'
                    result.code = 500;
                }  
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }
        
        if(result.code != 200){ // 수정에 실패했으므로 수정하려 했던 파일 삭제
            if(req.files){
                commonFunction.deleteFile(imgPath, path.join(__dirname, '..', '..', '..', '..', 'public'));
            }
        }

        commonFunction.sendResult(res, result);
    }],
    update_recommend_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 

        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);

        let rtype = req.body? req.body.rtype: false;
        let index = req.body? parseInt(req.body.index): false;
        let isUpdateBoard = req.body? req.body.isupdate: null;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else if(isUpdateBoard !== 'b' && isUpdateBoard !== 'c'){
                result.result = '추천타입을 확인해주세요. (isupdate)';
                result.code = 400;
            } else if(rtype !== 'x' && rtype !== 'o'){
                result.result = '추천타입을 확인해주세요. (rtype)';
                result.code = 400;
            } else if(!Number.isInteger(index) || !(index > 0)){
                result.result = '게시글 번호를 확인해주세요.';
                result.code = 400;
            } else{
                try{
                    var p = await updateRecco(req, result);
                }
                catch(error){
                    console.log(error);
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    update_objection_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req);

        let objectiontext = req.body? req.body.objectiontext? req.body.objectiontext: '': '';
        let index = req.body? parseInt(req.body.index): false;
        let isUpdateBoard = req.body? req.body.isupdate: null;
        
        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            try{
                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else if(isUpdateBoard !== 'b' && isUpdateBoard !== 'c'){
                    result.result = '신고타입을 확인해주세요. (isupdate)';
                    result.code = 400;
                } else if(!(objectiontext.trim().length > 0)){
                    result.result = '신고내용을 작성해주세요. (objectiontext)';
                    result.code = 400;
                } else if(!Number.isInteger(index) || !(index > 0)){
                    result.result = '게시글 번호를 확인해주세요.';
                    result.code = 400;
                } else{
                    try{
                        var p = await updateObjec(req, result);
                    }
                    catch(error){
                        console.log(error);
                    }
                }
            }
            catch(error){
                console.log(error);
                result.result = '신고중 문제가 발생했습니다.';
                result.code = 500;
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};