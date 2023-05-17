const DBReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const socketPartner = require('../../../T/socket/socketPartner');

const storage = multer.diskStorage({
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

const upload = multer({
    storage: storage, 
    limits: 5 * 1024 * 1024, 
    fileFilter: (req, file, cb) => {
    if (dotEnv.ALLOW_MIMETYPES.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('dGhpc2lzbm90anBlZ3BuZ2pwZ2ltYWdlISE'));
    }
}});

const followInsert = async (req, result, followId, accessToken)=>{
    let dbresult, dbfield;
    var PA1, PA2, PA3;
    PA1 = 'count(*) as cnt';
    PA2 = 'userinfo';
    PA3 = `id='${followId}'`;

    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

    if(dbresult === null || dbresult.length === 0){
        result.result = '실행중 오류가 발생했습니다. (100)';
        result.code = 500;
    } else if(dbresult[0].cnt === 0){
        result.result = '존재하지 않는 ID입니다.';
        result.code = 400;
    }
    else{ // 아이디가 존재함
        PA1 = 'count(*) as cnt';
        PA2 = dotEnv.FOLLOW_TABLE;
        PA3 = `id='${accessToken.id}' AND follow='${followId}'`;

        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

        if(dbresult === null || dbresult.length === 0){
            result.result = '실행중 오류가 발생했습니다. (101)';
            result.code = 500;
        } else if(dbresult[0].cnt === 1){ // 이미 팔로우한 상태
            result.result = '이미 팔로우한 ID입니다.';
            result.code = 400;
        } else{ // 팔로우 하지 않은 상태
            PA1 = 'count(*) as cnt';
            PA2 = dotEnv.BLOCK_TABLE;
            PA3 = `id='${accessToken.id}' AND block='${followId}'`;

            [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

            if(dbresult === null || dbresult.length === 0){
                result.result = '실행중 오류가 발생했습니다. (102)';
                result.code = 500;
            } else if(dbresult[0].cnt === 1){
                result.result = '차단을 풀고 팔로우를 진행해주시기 바랍니다.';
                result.code = 400;
            } else{ // 차단하지 않은 상태
                PA1 = dotEnv.FOLLOW_TABLE;
                PA2 = '';
                PA3 = `'${accessToken.id}', '${followId}'`;

                // console.log(PA1);
                // console.log(PA2);
                // console.log(PA3);

                [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                if(dbresult === null || dbresult === 0){
                    result.result = '실행중 오류가 발생했습니다. (103)';
                    result.code = 400;
                }
                else{
                    result.result = '팔로우 성공';
                    result.code = 200;
                }
            }
        }
    }
}

const blockInsert = async (req, result, blockId, accessToken)=>{
    let dbresult, dbfield;
    var PA1, PA2, PA3;
    PA1 = 'count(*) as cnt';
    PA2 = 'userinfo';
    PA3 = `id='${blockId}'`;

    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

    if(dbresult === null || dbresult.length === 0){
        result.result = '실행중 오류가 발생했습니다. (104)';
        result.code = 500;
    } else if(dbresult[0].cnt === 0){
        result.result = '존재하지 않는 ID입니다.';
        result.code = 400;
    }
    else{ // 차단할 아이디가 존재함
        PA1 = 'count(*) as cnt';
        PA2 = dotEnv.BLOCK_TABLE;
        PA3 = `id='${accessToken.id}' AND block='${blockId}'`;

        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

        if(dbresult === null || dbresult.length === 0){
            result.result = '실행중 오류가 발생했습니다. (105)';
            result.code = 500;
        } else if(dbresult[0].cnt === 1){
            result.result = '이미 차단한 ID입니다.';
            result.code = 400;
        }
        else{ // 차단 하지 않은 상태
            PA1 = 'count(*) as cnt';
            PA2 = dotEnv.FOLLOW_TABLE;
            PA3 = `id='${accessToken.id}' AND follow='${blockId}'`;

            [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

            if(dbresult === null || dbresult.length === 0){
                result.result = '실행중 오류가 발생했습니다. (106)';
                result.code = 500;
            } else if(dbresult[0].cnt === 1){
                result.result = '팔로우를 풀고 차단을 진행해주시기 바랍니다.';
                result.code = 400;
            } else{ // 팔로우하지 않은 상태
                // PA1 = 'count(*) as cnt';
                // PA2 = 'friend';
                // PA3 = `id='${accessToken.id}' AND friend='${blockId}'`;

                // [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                // if(dbresult === null || dbresult.length === 0){
                //     result.result = '실행중 오류가 발생했습니다. (107)';
                //     result.code = 500;
                // } else if(dbresult[0].cnt === 1){
                //     result.result = '친구는 차단할 수 없습니다.';
                //     result.code = 400;
                // } else{ // 친구가 아닌 경우
                        // 친구인 경우에 차단을 금지시키려면 여기에 아래 실행문을 넣을것
                // } 

                PA1 = dotEnv.BLOCK_TABLE;
                    PA2 = '';
                    PA3 = `'${accessToken.id}', '${blockId}'`;

                    // console.log(PA1);
                    // console.log(PA2);
                    // console.log(PA3);

                    [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                    if(dbresult === null || dbresult === 0){
                        result.result = '실행중 오류가 발생했습니다. (108)';
                        result.code = 400;
                    }
                    else{
                        result.result = '차단 성공';
                        result.code = 200;
                    }
            }
        }
    }
}

module.exports = {
    write_board_f: [upload.array('imageFiles', 4), async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;
        let imgimgimgimgpath = null;
        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                var baseImgPath = '/images/board/contents/';
                try {
                    let tempBoard4Write = {
                        title: req.body.title? req.body.title: '',
                        content: req.body.content? req.body.content: '',
                        hideLevel: req.body.hideLevel? req.body.hideLevel: -1,
                        type: req.body.type? req.body.type: -1,
                        imgPath: '',
                    };

                    if(req.files){
                        for(var i = 0; i < req.files.length; i++) {
                            if(tempBoard4Write.imgPath === '') tempBoard4Write.imgPath = `${baseImgPath}${req.files[i].filename}`;
                            else tempBoard4Write.imgPath = tempBoard4Write.imgPath.concat(`c3BhY2VcdA==${baseImgPath}${req.files[i].filename}`);
                        }
                    }
                    
                    tempBoard4Write.imgPath = tempBoard4Write.imgPath.trim();
                    imgimgimgimgpath = tempBoard4Write.imgPath;
                    // console.log(`Title: ${req.body.title}`);
                    // console.log(`uploadId: ${accessToken.id}`);
                    // console.log(`IP: ${req.headers['x-forwarded-for'] || accessToken.ip}`);
                    // console.log(`Content: ${req.body.content}`);
                    // console.log(`HideLevel: ${req.body.hideLevel}`);
                    // console.log(`Type: ${req.body.type}`);
                    // console.log(`ImgPath: ${imgPath}`);

                    if(!(tempBoard4Write.title.trim().length > 0)){ // 제목이 0보다 커야함
                        result.result = "제목은 앞뒤공백을 제외한 1글자 이상이여야 합니다.";
                        result.code = 450;
                        throw new Error('제목 오류');
                    } else if(!(tempBoard4Write.content.trim().length > 0)){ // 게시글 크기가 0보다 커야함
                        result.result = "게시글은 앞뒤공백을 제외한 1글자 이상이여야 합니다.";
                        result.code = 450;
                        throw new Error('게시글 오류');
                    } else if(!Number.isInteger(parseInt(tempBoard4Write.hideLevel))){ // 공개범위가 숫자가 아닌경우
                        // 0 all, 1 friend,follower, 2 friend, 3 myself
                        // 게시글 공개범위 설정은 숫자이고 0~3 사이의 정수여야함
                        result.result = "게시글 공개범위는 숫자여야 합니다.";
                        result.code = 450;
                        throw new Error('공개범위 오류');
                    } else if(!(parseInt(tempBoard4Write.hideLevel) > -1 && parseInt(tempBoard4Write.hideLevel) < 3)){ // 공개범위가 값을 넘어선 경우
                        // 0 all, 1 friend,follower, 2 friend, 3 myself
                        // 게시글 공개범위 설정은 숫자이고 0~3 사이의 정수여야함
                        result.result = "사용할 수 없는 게시글 공개범위입니다.";
                        result.code = 450;
                        throw new Error('공개범위 오류');
                    } else if(!Number.isInteger(parseInt(tempBoard4Write.type))){ // 게시글 타입이 숫자가 아닌경우 
                        // 1 none, 2 humor, 3 info, 4 notice
                        // 게시글 타입은 숫자이고 1~4 사이의 정수여야함
                        result.result = "게시글 타입은 숫자여야 합니다.";
                        result.code = 450;
                        throw new Error('타입 오류');
                    } else if(!(parseInt(tempBoard4Write.type) > 0 && parseInt(tempBoard4Write.type) < 5)){ // 게시글 타입이 값을 넘어선 경우
                        // 1 none, 2 humor, 3 info, 4 notice
                        // 게시글 타입은 숫자이고 1~4 사이의 정수여야함
                        result.result = "사용할 수 없는 게시글 타입입니다.";
                        result.code = 450;
                        throw new Error('타입 오류');
                    } else if(accessToken.auth !== 'o' && tempBoard4Write.type === 4){
                        result.result = "사용할 수 없는 게시글 타입입니다.";
                        result.code = 450;
                        throw new Error('타입 오류');
                    } else{
                        var PA1 = dotEnv.BOARD_TABLE;
                        var PA2 = "(uploadId, ip, title, content, type, hideLevel, imgPath)"; 
                        var PA3 = `'${accessToken.id}', '${req.headers['x-forwarded-for'] || accessToken.ip}', '${commonFunction.changeBase64FromString(tempBoard4Write.title)}', '${commonFunction.changeBase64FromString(tempBoard4Write.content)}', ${parseInt(tempBoard4Write.type)}, ${parseInt(tempBoard4Write.hideLevel)}, '${tempBoard4Write.imgPath}'`;
                        
                        [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                        if(dbresult !== 1){
                            throw new Error("글 업로드에 실패했습니다.");
                        } else {
                            var PA1 = "uni.*";
                            var PA2 = `${dotEnv.FRINFOLL} as uni`; 
                            var PA3 = `uni.id = '${accessToken.id}'`;

                            [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){

                            } else if(dbresult.length > 0){
                                var msg = {
                                    'type': 100,
                                    'content': `${commonFunction.changeBase64FromString(tempBoard4Write.title)}`,
                                };
                                var frList = [];

                                frList.push(accessToken.id);

                                for(let i in dbresult){
                                    frList.push(dbresult[i]['friend']);
                                }

                                for(let i in frList){
                                    var PA1 = 'communitynotifi';
                                    var PA2 = "(publisher, receiver, content)"; 
                                    var PA3 = `'${accessToken.id}', '${frList[i]}', '${JSON.stringify(msg)}'`;
                                    
                                    [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                                    socketPartner.socket_io_json.socket_io.to(frList[i]).emit('create_notifi', msg);
                                }
                            }
                        }
                        result.result = "글 작성 성공";
                        result.code = 200;
                    }
                    
                } catch (error) {
                    console.log(error);
                    if(result.code !== 450){
                        result.result = '데이터 업로드에 실패했습니다.';
                        result.code = 500;
                    } else result.code = 400;
                    

                    if(req.files){
                        commonFunction.deleteFile(imgimgimgimgpath, path.join(__dirname, '..', '..', '..', '..', 'public'));

                        // var filePath = require('path').join(__dirname, '..', '..', '..', '..', 'public', baseImgPath);

                        // for(var i = 0; i < req.files.length; i++){
                        //     fs.unlink(`${filePath}${req.files[i].filename}`, (err)=>{
                        //         if(err){
                        //             console.log("writeBoard.js에서 파일을 지우는 중 문제발생");
                        //             console.log(err);
                        //         }
                        //     });
                        // }
                    }
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }
            
        commonFunction.sendResult(res, result);
    }],
    write_comment_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        var boardLevel = 0;
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;
        var PA1, PA2, PA3;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                let tempComment4Write = {
                    bindex: req.body? req.body.bindex? req.body.bindex: 0: 0,
                    content: req.body? req.body.content? req.body.content.trim(): '': '',
                };
                
                if(!(tempComment4Write.bindex > 0)){
                    result.result = '유효하지 않은 게시글번호입니다.';
                    result.code = 400;
                } else if(!(tempComment4Write.content.length > 0)){ // 게시글 크기가 0보다 커야함
                    result.result = "댓글 내용은 앞뒤공백을 제외한 1글자 이상이여야 합니다.";
                    result.code = 400;
                } else{
                    PA1 = '*';
                    PA2 = dotEnv.BOARD_TABLE;
                    PA3 = `${dotEnv.BOARD_TABLE}.index=${tempComment4Write.bindex} AND hideLevel<3`;
                    
                    try{
                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        // console.log(PA1, PA2, PA3, dbresult[0]);

                        if(dbresult === null){ // 글번호로 게시글 조회중 문제발생
                            result.result = '댓글 업로드중 문제가 발생했습니다. (100)';
                            result.code = 500;
                        } else if(dbresult.length === 0){ // 글번호를 가진 게시글이 존재하지 않음
                            result.result = '존재하지 않는 글번호입니다. (100)';
                            result.code = 400;
                        } else{ // 글번호를 가진 게시글이 존재함
                            boardLevel = dbresult[0].hideLevel;
                            let UPLOADERID = dbresult[0].uploadId;

                            if(boardLevel === 1 || boardLevel === 2){
                                PA1 = '*';
                                PA2 = 'friend';
                                PA3 = `id='${accessToken.id}' AND friend='${UPLOADERID}'`;

                                [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                                // console.log(PA1, PA2, PA3, dbresult[0]);
                                

                                if(dbresult === null){
                                    result.result = '댓글 업로드중 문제가 발생했습니다. (106)';
                                    result.code = 500;
                                } else if(dbresult.length === 0){
                                    result.result = '댓글을 작성할 수 없는 글입니다.';
                                    result.code = 400;
                                } else{
                                    result.code = 200;
                                }
                            }

                            if(boardLevel === 1){
                                PA1 = '*';
                                PA2 = dotEnv.FOLLOW_TABLE;
                                PA3 = `id='${accessToken.id}' AND follow='${UPLOADERID}'`;

                                [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                                if(dbresult === null){
                                    result.result = '댓글 업로드중 문제가 발생했습니다. (109)';
                                    result.code = 500;
                                } else if(dbresult.length === 0){
                                    result.result = '댓글을 작성할 수 없는 글입니다.';
                                    result.code = 400;
                                } else{
                                    result.code = 200;
                                }
                            }

                            if(result.code === 200){
                                PA1 = dotEnv.COMMENT_TABLE;
                                PA2 = '(boardIndex, ip, content, uploadId)';
                                PA3 = `${tempComment4Write.bindex}, '${req.headers['x-forwarded-for'] || accessToken.ip}', '${commonFunction.changeBase64FromString(tempComment4Write.content)}', '${accessToken.id}'`;
    
                                [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);
    
                                if(dbresult === null){ // 글번호로 게시글 조회중 문제발생
                                    result.result = '댓글 업로드중 문제가 발생했습니다. (101)';
                                    result.code = 500;
                                } else if(dbresult.length === 0){ // 글번호를 가진 게시글이 존재하지 않음
                                    result.result = '댓글 업로드에 실패했습니다.';
                                    result.code = 400;
                                } else{
                                    result.result = '댓글 업로드에 성공했습니다.';
                                    result.code = 200;
                                }
                            }
                        }
                    }
                    catch(error){
                        console.log(error);
                        result.result = '댓글 업로드중 문제가 발생했습니다.';
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
    regist_follow_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                let boardIndex = null;
                let followId = null;
                var PA1, PA2, PA3;

                if(req.body){
                    boardIndex = parseInt(req.body.boardIndex);
                    followId = req.body.followId;

                    if(commonFunction.idRegCheck(followId)){ // 아이디가 정규식에 맞는 경우
                        try{
                            var sad = await followInsert(req, result, followId, accessToken);
                        }
                        catch(error){
                            console.log(error);
                            result.result = '팔로우중 문제가 발생했습니다. (200)';
                            result.code = 500;
                        }
                        
                    } 
                    else if(Number.isInteger(boardIndex) && boardIndex > 0){ // 글 번호가 양수일 경우
                        PA1 = 'uploadId';
                        PA2 = `${dotEnv.BOARD_TABLE} as a`;
                        PA3 = `a.index=${boardIndex}`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '실행중 오류가 발생했습니다. (109)';
                            result.code = 500;
                        } else if(dbresult.length === 0){
                            result.result = '존재하지 않는 글번호입니다.';
                            result.code = 400;
                        }
                        else{
                            try{
                                followId = dbresult[0].uploadId;
                                var sad = await followInsert(req, result, followId, accessToken);
                            }
                            catch(error){
                                console.log(error);
                                result.result = '팔로우중 문제가 발생했습니다. (201)';
                                result.code = 500;
                            }
                        }
                    } 
                    else{
                        result.result = '글 번호 또는 ID를 확인해주세요.';
                        result.code = 400;
                    }
                }
                else{
                    result.result = '팔로우를 하기 위해서는 올린 글 번호 또는 ID가 필요합니다.';
                    result.code = 400;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    regist_block_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                let boardIndex = null;
                let blockId = null;
                var PA1, PA2, PA3;

                if(req.body){
                    boardIndex = parseInt(req.body.boardIndex);
                    blockId = req.body.blockId;

                    if(commonFunction.idRegCheck(blockId)){ // 아이디가 정규식에 맞는 경우
                        try{
                            var sad = await blockInsert(req, result, blockId, accessToken);
                        }
                        catch(error){
                            console.log(error);
                            result.result = '차단중 문제가 발생했습니다. (200)';
                            result.code = 500;
                        }
                        
                    } 
                    else if(Number.isInteger(boardIndex) && boardIndex > 0){ // 글 번호가 양수일 경우
                        PA1 = 'uploadId';
                        PA2 = `${dotEnv.BOARD_TABLE} as a`;
                        PA3 = `a.index=${boardIndex}`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '실행중 오류가 발생했습니다. (110)';
                            result.code = 500;
                        } else if(dbresult.length === 0){
                            result.result = '존재하지 않는 글번호입니다.';
                            result.code = 400;
                        }
                        else{
                            try{
                                blockId = dbresult[0].uploadId;
                                var sad = await blockInsert(req, result, blockId, accessToken);
                            }
                            catch(error){
                                console.log(error);
                                result.result = '차단중 문제가 발생했습니다. (202)';
                                result.code = 500;
                            }
                        }
                    } 
                    else{
                        result.result = '글 번호 또는 ID를 확인해주세요.';
                        result.code = 400;
                    }
                }
                else{
                    result.result = '차단하기 위해서는 올린 글 번호 또는 ID가 필요합니다.';
                    result.code = 400;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    object_board_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                if(req.body && Number.isInteger(parseInt(req.body.bindex))){
                    let bindex = parseInt(req.body.bindex);
                    let because = req.body.because? commonFunction.changeBase64FromString(req.body.because): '';
                    var PA1, PA2, PA3;

                    PA1 = '*';
                    PA2 = `${dotEnv.BOARD_TABLE} as bt`;
                    PA3 = `bt.index=${bindex}`;

                    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){
                        result.result = '게시글 신고중 오류가 발생했습니다. (100)';
                        result.code = 500;
                    } else if(dbresult.length === 0){
                        result.result = '존재하지 않는 게시글입니다.';
                        result.code = 400;
                    } else{
                        PA1 = '*';
                        PA2 = `${dotEnv.BOARD_OBJ_TABLE} as bot`;
                        PA3 = `bot.bindex=${bindex} AND id='${accessToken.id}'`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '게시글 신고내역 조회중 오류가 발생했습니다. (101)';
                            result.code = 500;
                        } else if(dbresult.length !== 0){
                            result.result = '이미 신고한 게시글입니다.';
                            result.code = 400;
                        } else{
                            PA1 = dotEnv.BOARD_OBJ_TABLE;
                            PA2 = '';
                            PA3 = `'${accessToken.id}', ${bindex}, '${because}'`;


                            [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '신고중 문제가 발생했습니다. (107)';
                                result.code = 500;
                            } else if(dbresult === 0){
                                result.result = '신고중 문제가 발생했습니다. (104)';
                                result.code = 500;
                            } else{
                                result.result = '게시글을 신고했습니다.';
                                result.code = 200;
                            }
                        }
                    }
                } else{
                    result.result = '신고할 게시글 번호를 확인해주세요.';
                    result.code = 400;
                }
                
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    object_comment_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                if(req.body && Number.isInteger(parseInt(req.body.cindex))){
                    let cindex = parseInt(req.body.cindex);
                    let because = req.body.because? commonFunction.changeBase64FromString(req.body.because): '';
                    var PA1, PA2, PA3;

                    PA1 = '*';
                    PA2 = `${dotEnv.COMMENT_TABLE} as ct`;
                    PA3 = `ct.index=${cindex}`;

                    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){
                        result.result = '댓글 신고중 오류가 발생했습니다. (100)';
                        result.code = 500;
                    } else if(dbresult.length === 0){
                        result.result = '존재하지 않는 댓글입니다.';
                        result.code = 400;
                    } else{
                        PA1 = '*';
                        PA2 = `${dotEnv.COMMENT_OBJ_TABLE} as cot`;
                        PA3 = `cot.cindex=${cindex} AND id='${accessToken.id}'`;

                        [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '댓글 신고내역 조회중 오류가 발생했습니다. (101)';
                            result.code = 500;
                        } else if(dbresult.length !== 0){
                            result.result = '이미 신고한 댓글입니다.';
                            result.code = 400;
                        } else{
                            PA1 = dotEnv.COMMENT_OBJ_TABLE;
                            PA2 = '';
                            PA3 = `'${accessToken.id}', ${cindex}, '${because}'`;


                            [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '신고중 문제가 발생했습니다. (107)';
                                result.code = 500;
                            } else if(dbresult === 0){
                                result.result = '신고중 문제가 발생했습니다. (104)';
                                result.code = 500;
                            } else{
                                result.result = '댓글을 신고했습니다.';
                                result.code = 200;
                            }
                        }
                    }
                } else{
                    result.result = '신고할 댓글 번호를 확인해주세요.';
                    result.code = 400;
                }
                
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    insert_feedback_f: async (req, res)=>{
        let result = {
            result: null,
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let PA1, PA2, PA3;
        let dbresult, dbfield;
        

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                if(req.body){
                    let body = {
                        title: (req.body.title||+"").trim(),
                        content: (req.body.content||+"").trim(),
                        bigTag: req.body.bigTag,
                        smallTag: req.body.smallTag,
                    }

                    if(body.title.length <= 5){
                        result.result = '제목은 5자보다 길어야 합니다.';
                        result.code = 400;
                    } else if(body.content.length <= 20){
                        result.result = '내용은 20자보다 길어야 합니다.';
                        result.code = 400;
                    } else{
                        PA1 = dotEnv.FEED_TABLE;
                        PA2 = '(id, title, content, bigTag, smallTag)';
                        PA3 = `'${accessToken.id}', '${body.title}', '${body.content}', '${body.bigTag}', '${body.smallTag}'`;

                        [dbresult, dbfield] = await DBReserved.dynamic_insert(PA1, PA2, PA3);

                        if(dbresult === null){
                            result.result = '피드백 작성중 오류가 발생했습니다. (100)';
                            result.code = 500;
                        } else{
                            result.result = '피드백을 작성해주셔서 감사합니다.';
                            result.code = 200;
                        }
                    }
                } else{
                    result.result = '피드백 값을 제대로 전송해주세요.';
                    result.code = 400;
                }
                
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
};