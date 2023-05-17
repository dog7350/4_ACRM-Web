const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dbReserved = require('../../../T/dbReserved');
const dotEnv = require('../../../CP/envHell');

const blockContent = commonFunction.changeBase64FromString('이 댓글은 차단되어 볼 수 없습니다.');

const dateChecker = function checkValidDate(value) {
	var result = true;
	try {
	    var date = value.split("-");
	    var y = parseInt(date[0], 10),
	        m = parseInt(date[1], 10),
	        d = parseInt(date[2], 10);
	    
	    var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
	    result = dateRegex.test(d+'-'+m+'-'+y);
	} catch (err) {
		result = false;
	}    
    return result;
};

const readBase = async (req)=>{
    let dbresult, dbfield;

    const defaultPage = 1;
    const defaultPageSize = 10;

    let queryPage = req.query? req.query.page: defaultPage;
    let queryPageSize = req.query? req.query.pagesize: defaultPageSize;
    let queryIndex = req.query? req.query.bindex: null;
    let queryType = req.query? req.query.btype: null;
    let queryUploadId = req.query? req.query.bupid: null;
    let accessToken = TokenManager.getToken(req);

    let valid1, valid2, valid3, vaild4, valid5;
    valid5 = false;

    queryPage = queryPage? parseInt(queryPage): defaultPage;
    queryPageSize = queryPageSize? parseInt(queryPageSize): defaultPageSize;
    queryIndex = queryIndex? parseInt(queryIndex): null;
    queryType = queryType? parseInt(queryType): null;
    queryUploadId = commonFunction.idRegCheck(queryUploadId)? queryUploadId: null;

    if(!Number.isInteger(queryPage) || queryPage < 1){ // 쿼리로 들어온 페이지가 숫자가 아니거나 1보다 작은 경우
        queryPage = defaultPage-1;
    } else{ // 쿼리로 들어온 페이지가 있는 경우
        queryPage = queryPage-1;
    }

    if(!Number.isInteger(queryPageSize) || queryPageSize < 1){ // 쿼리로 들어온 페이지 크기가 숫자가 아니거나 1보다 작은 경우
        queryPageSize = defaultPageSize;
    } else{ // 쿼리로 들어온 페이지가 있는 경우
        queryPageSize = queryPageSize;
    }

    if(!Number.isInteger(queryIndex)){ // 쿼리로 들어온 인덱스가 숫자가 아닌경우
        queryIndex = '';
        valid1 = false;
    } else{
        valid1 = true; // 쿼리로 들어온 인덱스가 있는 상태
        queryIndex = ` AND b.index < ${queryIndex}`;
    }

    if(!Number.isInteger(queryType)){ // 쿼리로 들어온 글타입이 숫자가 아닌경우
        queryType = '';
        valid2 = false;
    } else{
        if(queryType < 1 || queryType > 5){ // 쿼리로 들어온 글타입이 범위를 넘어선 경우 0으로 변환
            queryType = '';
            valid2 = false;
        } else{
            queryType = ` AND b.type=${queryType}`;
            valid2 = true; // 조회할 글 타입이 정해진 상태
        }
    }

    if(!queryUploadId){ // 쿼리로 들어온 아이디가 정규식을 만족하지 않는 경우
        queryUploadId = '';
        vaild4 = false;
    } else{
        queryUploadId = ` AND b.uploadID REGEXP('${queryUploadId}')`; // 정규식을 만족하는 경우
        vaild4 = true;
    }

    if(accessToken){
        accessToken = await TokenManager.verifyToken(accessToken, req);

        if(Number.isInteger(accessToken)){
            valid3 = false;
        } else{
            valid3 = true; // 로그인된 상태

            if(['o', 'm'].indexOf(accessToken.auth) !== -1) // admin or mananger
                valid5 = true;
        }
    } else{
        valid3 = false;
    }

    let fromBase;

    if(valid3){
        // 로그인 된 경우 차단 목록을 전부 제외하고 인덱스 이하 검색기능과 글 종류 검색기능이 있다면 조건에 넣는다.
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS c RIGHT OUTER JOIN (SELECT * FROM ${dotEnv.LOGO_TABLE} AS a RIGHT OUTER JOIN ${dotEnv.BOARD_TABLE} AS b ON a.id = b.uploadId WHERE b.hideLevel != 3 AND b.uploadId NOT IN (SELECT block FROM ${dotEnv.BLOCK_TABLE} WHERE id='${accessToken.id}')${queryIndex}${queryType}${queryUploadId}) AS d ON c.id = d.uploadId`;
    } else{
        // 로그인이 안된 경우 차단 인덱스 이하 검색기능과 글 종류 검색기능이 있다면 조건에 넣는다.
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS c RIGHT OUTER JOIN (SELECT * FROM ${dotEnv.LOGO_TABLE} AS a RIGHT OUTER JOIN ${dotEnv.BOARD_TABLE} AS b ON a.id = b.uploadId WHERE b.hideLevel != 3${queryIndex}${queryType}${queryUploadId}) AS d ON c.id = d.uploadId`;
    }

    let whereBase;

    if(valid3){
        // 로그인 된 경우 팔로우한 ID와 친구의 글을 추가한다.
        // hideLevel이 0인 경우, 글을 요청한 ID가 팔로우한 ID와 업로드 ID가 일치할 때, hideLevel이 1인 경우, 글을 요청한 ID의 친구 ID와 업로드 ID가 일칠할 때, hideLevel이 1,2인 경우
        whereBase = `d.hideLevel=0 OR d.uploadId='${accessToken.id}' OR (d.uploadId IN (SELECT follow from ${dotEnv.FOLLOW_TABLE} WHERE id='${accessToken.id}') AND d.hideLevel=1) OR (d.uploadId IN (SELECT friend from friend WHERE id='${accessToken.id}') AND d.hideLevel IN (1,2)) ORDER BY d.index DESC LIMIT ${queryPageSize*queryPage}, ${queryPageSize};`;
    } else{
        // 로그인 안 된 경우
        whereBase = `d.hideLevel=0 ORDER BY d.index DESC LIMIT ${queryPageSize*queryPage}, ${queryPageSize};`;
    }

    let selectBase;

    if(valid5){
        // admin or mananger인 경우
        selectBase = `c.name AS nickName, d.logoPath, d.index, d.uploadId, d.timeStamp, d.ip, d.title, d.content, d.viewCount, d.type, d.hideLevel, d.imgPath, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=d.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=d.index and recType='x') as unRecommendCount, (select count(*) from ${dotEnv.BOARD_OBJ_TABLE} where bindex=d.index) as objectionCount, (select count(*) from ${dotEnv.COMMENT_TABLE} where boardIndex=d.index) as commentsCount`;
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS c RIGHT OUTER JOIN (SELECT * FROM ${dotEnv.LOGO_TABLE} AS a RIGHT OUTER JOIN ${dotEnv.BOARD_TABLE} AS b ON a.id = b.uploadId WHERE 1=1 ${queryIndex}${queryType}${queryUploadId}) AS d ON c.id = d.uploadId`;
        whereBase = `1=1 ORDER BY d.index DESC LIMIT ${queryPageSize*queryPage}, ${queryPageSize};`;
    } else{
        // 일반유저 또는 로그인이 아닌경우
        selectBase = `c.name AS nickName, d.logopath as logoPath, d.timeStamp as timeStamp, d.title as title, d.content as content, d.index,d.imgPath as imgPath, d.viewCount as viewCount, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=d.index and recType='o') as recommendCount, d.type as type, d.hideLevel as hideLevel, d.uploadId as uploadId, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=d.index and recType='x') as unRecommendCount, (select count(*) from ${dotEnv.COMMENT_TABLE} where boardIndex=d.index) as commentsCount, (select count(*) from ${dotEnv.BOARD_OBJ_TABLE} where bindex=d.index) as objectionCount`;
    }

    try{
        let value = selectBase;
        let from = fromBase;
        let where = whereBase;

        [dbresult, dbfield] = await dbReserved.dynamic_select(value, from, where);
    }
    catch(error){
        console.log(error);
        dbresult = null;
    }
    
    return [dbresult, dbfield];
};










const newReadBoardFunction = async (req)=>{
    const defaultPage = 1;
    const defaultPageSize = 10;

    let dbresult, dbfield;
    let PA1 = 'pfrom.*', PA2, PA3;
    let accessToken = TokenManager.getToken(req);

    let loginValid = 0; // 0 로그인 안함, 1 로그인 함, 2 관리자의 경우

    let questionQuery = { 
        pageIndex: req.query? parseInt(req.query.pageIndex): NaN, // 기본 1
        pageSize: req.query? parseInt(req.query.pageSize): NaN, // 기본 10
        bindex: req.query? parseInt(req.query.bIndex): NaN, // 기본 2147480000
        bType: req.query? parseInt(req.query.bType): NaN, // 기본 10
        order: req.query? req.query.order: true, // true일 경우 내림차순
        findStr: req.query? req.query.findStr: '.*',
        

        codef: req.query? parseInt(req.query.codef): NaN, // 기본 0
        codeo: req.query? parseInt(req.query.codeo): NaN, // 기본 0
    };

    if(accessToken){ 
        accessToken = await TokenManager.verifyToken(accessToken, req);

        if(Number.isInteger(accessToken)){ // 토큰이 유효하지 않음 -> 로그인 X
            loginValid = 0;
        } else{ // 유효한 토큰

            if(['o', 'm'].indexOf(accessToken.auth) !== -1){ // 관리자임
                loginValid = 2;
            }
            else{ // 관리자 아님
                loginValid = 1;
            }
        }   
    } else{ // 로그인 안됨
        loginValid = 0;
    }

    // 쿼리점검
    if(Number.isInteger(questionQuery.pageIndex)){
        if(questionQuery.pageIndex < 1){
            questionQuery.pageIndex = defaultPage;
        }
    } else{
        questionQuery.pageIndex = defaultPage;
    }
    questionQuery.pageIndex = questionQuery.pageIndex - 1;


    if(Number.isInteger(questionQuery.pageSize)){
        if(questionQuery.pageSize < 1){
            questionQuery.pageSize = defaultPageSize;
        }
    } else{
        questionQuery.pageSize = defaultPageSize;
    }


    if(Number.isInteger(questionQuery.bindex)){
        if(questionQuery.bindex < 0 || questionQuery.bindex > 2147480000){
            questionQuery.bindex = 2147480000;
        }
    } else{
        questionQuery.bindex = 2147480000;
    }


    if(Number.isInteger(questionQuery.bType)){
        if(questionQuery.bType < 0 || questionQuery.bType > 4){
            questionQuery.bType = 10;
        }
    } else{
        questionQuery.bType = 10;
    }

    if(questionQuery.order === null || questionQuery.order === undefined){
        questionQuery.order = true; 
    }

    if(Number.isInteger(questionQuery.codef)){
        if(questionQuery.codef < 0 || questionQuery.codef > 6){
            if(questionQuery.codef === 100){
                questionQuery.codef = 100;
            } else{
                questionQuery.codef = 0;
            }
        } else{
            if(questionQuery.codef > 2 && loginValid === 0){
                questionQuery.codef = 0;
            }
        }
    } else{
        questionQuery.codef = 0;
    }

    if(Number.isInteger(questionQuery.codeo)){
        if(questionQuery.codeo < 0 || questionQuery.codeo > 4){
            questionQuery.codeo = 0; 
        } else{
            if(questionQuery.codeo === 4 && loginValid !== 2){
                questionQuery.codeo = 0;
            } else{
                questionQuery.codeo = questionQuery.codeo;
            }
        }
    } else{
        questionQuery.codeo = 0;
    }
    
    // console.log(questionQuery);

    switch(loginValid){ // 보여질 글 정리
        case 0:
            PA2 = `(SELECT * FROM (${dotEnv.HIDELEVEL_NOT_3_BOARD}) AS hnEb WHERE hnEb.hideLevel=0) as pfrom`;
        break;

        case 1:
            PA1 = `${PA1}, (SELECT crb.recType FROM ${dotEnv.BOARD_REC_TABLE} AS crb WHERE crb.bindex=pfrom.index AND crb.id='${accessToken.id}') as recType`;
            PA2 = `(SELECT hnEb.*, (SELECT COUNT(*) FROM friend WHERE id='${accessToken.id}' AND friend=hnEb.uploadId) as isFriend, (SELECT COUNT(*) FROM ${dotEnv.FOLLOW_TABLE} WHERE id='${accessToken.id}' AND follow=hnEb.uploadId) as isFollow FROM (${dotEnv.HIDELEVEL_NOT_3_BOARD}) AS hnEb WHERE hnEb.uploadId NOT IN (SELECT block FROM ${dotEnv.BLOCK_TABLE} WHERE id='${accessToken.id}') AND hnEb.hideLevel=0 OR hnEb.uploadId='${accessToken.id}' OR (hnEb.uploadId IN (SELECT follow from ${dotEnv.FOLLOW_TABLE} WHERE id='${accessToken.id}') AND hnEb.hideLevel=1) OR (hnEb.uploadId IN (SELECT friend from friend WHERE id='${accessToken.id}') AND hnEb.hideLevel IN (1,2))) as pfrom`;
        break;

        case 2:
            PA1 = `${PA1}, (SELECT crb.recType FROM ${dotEnv.BOARD_REC_TABLE} AS crb WHERE crb.bindex=pfrom.index AND crb.id='${accessToken.id}') as recType`;
            PA2 = `(SELECT hnEb.*, (SELECT COUNT(*) FROM friend WHERE id='${accessToken.id}' AND friend=hnEb.uploadId) as isFriend, (SELECT COUNT(*) FROM ${dotEnv.FOLLOW_TABLE} WHERE id='${accessToken.id}' AND follow=hnEb.uploadId) AS isFollow FROM (${dotEnv.HIDELEVEL_NOT_3_BOARD}) AS hnEb) as pfrom`;
        break;
    }

    switch(questionQuery.codef){ // 보여질 글 필터
        case 100:
            PA3 = `pfrom.index>${questionQuery.bindex}`;
        break;

        case 0: // bindex로 글 검색
            PA3 = `pfrom.index<=${questionQuery.bindex}`;
        break;

        case 1: // findStr로 닉네임 검색 REGEXP_INSTR(pfrom.nickName, '${questionQuery.findStr}')
            PA3 = `pfrom.index<=${questionQuery.bindex} AND REGEXP_INSTR(pfrom.nickName, '${questionQuery.findStr}')`;
        break;

        case 2: // findStr로 아이디 검색 REGEXP_INSTR(pfrom.uploadId, '${questionQuery.findStr}')
            PA3 = `pfrom.index<=${questionQuery.bindex} AND REGEXP_INSTR(pfrom.uploadId, '${questionQuery.findStr}')`;
        break;

        case 3: // 내가 팔로우한 사람이 올린글만 보기
            PA3 = `pfrom.index<=${questionQuery.bindex} AND pfrom.isFollow=1`;
        break;

        case 4: // 내가 친구추가한 사람이 올린글만 보기
            PA3 = `pfrom.index<=${questionQuery.bindex} AND pfrom.isFriend=1`;
        break;

        case 5: // 내가 팔로우 하거나 친구추가한 사람이 올린글만 보기
            PA3 = `pfrom.index<=${questionQuery.bindex} AND (pfrom.isFollow=1 OR pfrom.isFriend=1)`;
        break;

        case 6: // 내가 팔로우 하거나 친구추가한 사람이 올린글만 보기
            PA3 = `pfrom.index<=${questionQuery.bindex} AND (pfrom.isFollow=1 AND pfrom.isFriend=1)`;
        break;
    }

    // console.log(questionQuery, PA3);

    switch(questionQuery.bType){
        case 10: // bindex로 글 검색
            PA3 = `${PA3} AND pfrom.type>-1`;
        break;

        default:
            PA3 = `${PA3} AND pfrom.type=${questionQuery.bType}`;
        break;
    }

    switch(questionQuery.codeo){ // 보여질 글 정렬
        case 0:
            PA3 = `${PA3} ORDER BY pfrom.index ${questionQuery.order? 'DESC': 'ASC'}`;
        break;

        case 1:
            PA3 = `${PA3} ORDER BY pfrom.recommendCount ${questionQuery.order? 'DESC': 'ASC'}, pfrom.index DESC`;
        break;

        case 2:
            PA3 = `${PA3} ORDER BY pfrom.viewCount ${questionQuery.order? 'DESC': 'ASC'}, pfrom.index DESC`;
        break;

        case 3:
            PA3 = `${PA3} ORDER BY pfrom.commentsCount ${questionQuery.order? 'DESC': 'ASC'}, pfrom.index DESC`;
        break;

        case 4:
            PA3 = `${PA3} ORDER BY pfrom.objectionCount ${questionQuery.order? 'DESC': 'ASC'}, pfrom.index DESC`;
        break;
    }

    switch(questionQuery.pageSize){
        case 1:
            PA3 = `${PA3} LIMIT 1`;
        break;

        default:
            PA3 = `${PA3} LIMIT ${questionQuery.pageIndex*questionQuery.pageSize}, ${questionQuery.pageSize}`;
        break;
    }
    
    try{
        // console.log('PA1: ', PA1);
        // console.log('PA2: ', PA2);
        // console.log('PA3: ', PA3);

        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

        if(questionQuery.pageSize === 1 && dbresult.length > 0){
                dbresult[0].viewCount = dbresult[0].viewCount+1;
                PA1 = dotEnv.BOARD_TABLE;
                PA2 = 'viewCount=viewCount+1';
                PA3 = `${dotEnv.BOARD_TABLE}.index=${dbresult[0].index}`;

                dbReserved.dynamic_update(PA1, PA2, PA3);
        }

    }
    catch(error){
        console.log(error);
        dbresult = null;
    }
    
    return [dbresult, dbfield];
};

const readComment = async (req)=>{
    let dbresult, dbfield;

    const defaultPage = 1, defaultPageSize = 20;

    let queryUploadId = req.query? req.query.cupid: null;
    let bindex = req.query? parseInt(req.query.bindex): null;
    let cindex = req.query? parseInt(req.query.cindex): null;
    let order = req.query? parseInt(req.query.order): NaN;
    let cpage = req.query? parseInt(req.query.page): defaultPage
    let cpagesize = req.query? parseInt(req.query.pagesize): defaultPageSize;
    let imSupervisor = '', logind = '';

    let valid3, valid1, valid2, valid4, valid5;

    let accessToken = TokenManager.getToken(req);

    valid5 = false;
    if(accessToken){
        accessToken = await TokenManager.verifyToken(accessToken, req);

        if(Number.isInteger(accessToken)){
            valid3 = false;
        } else{
            valid3 = true; // 로그인된 상태

            if(['o', 'm'].indexOf(accessToken.auth) !== -1) // admin or mananger
                valid5 = true;
        }
    } else{
        valid3 = false;
    }

    if(!Number.isInteger(cpage) || cpage < 1){ // 쿼리로 들어온 페이지가 숫자가 아니거나 1보다 작은 경우
        cpage = defaultPage-1;
    } else{ // 쿼리로 들어온 페이지가 있는 경우
        cpage = cpage-1;
    }

    if(!Number.isInteger(cpagesize) || cpagesize < 1){ // 쿼리로 들어온 페이지 크기가 숫자가 아니거나 1보다 작은 경우
        cpagesize = defaultPageSize;
    } else{ // 쿼리로 들어온 페이지가 있는 경우
        cpagesize = cpagesize;
    }

    if(!Number.isInteger(cindex) || cindex < 1){ // 쿼리로 들어온 조회할 댓글 번호가 숫자가 아니거나 1보다 작은경우
        cindex = -1;
        valid1 = false; // 조회할 댓글번호 없음
    } else{
        valid1 = true;
    }

    if(!Number.isInteger(bindex) || bindex < 1){ // 쿼리로 들어온 조회할 댓글들이 모인 글 번호가 숫자가 아니거나 1보다 작은경우
        bindex = -1;
        valid2 = false; // 조회할 글 번호 없음
    } else{
        valid2 = true;
    }

    if(!queryUploadId){ // 쿼리로 들어온 아이디가 정규식을 만족하지 않는 경우
        queryUploadId = '';
        valid4 = false; // 조회할 ID없음
    } else{ // 정규식을 만족하는 경우
        valid4 = true;
    }

    if(valid5) imSupervisor = `, (select count(*) from ${dotEnv.COMMENT_OBJ_TABLE} as cot where cot.cindex=d.index) as objectionCount`;
    
    if(valid3) logind = `, (select recType from ${dotEnv.COMMENT_REC_TABLE} where cindex=d.index AND id='${accessToken.id}') as recType`;

    let valueBase = `a.name AS nickName, d.logopath as logoPath, d.index AS cindex, d.boardIndex as bindex, d.uploadId, d.timeStamp, d.ip, d.content, d.hideLevel, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=d.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=d.index and recType='x') as unRecommendCount, d.hideLevel as hideLevel ${imSupervisor} ${logind}`;
    let fromBase;
    let whereBase;


    if(valid1 && valid2){ // 조회할 글에서 초과 댓글번호
        // valueBase = 'a.name AS nickName, d.index AS cindex, d.*';
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS a RIGHT OUTER JOIN (SELECT b.logopath AS logopath, c.* FROM ${dotEnv.LOGO_TABLE} AS b RIGHT OUTER JOIN ${dotEnv.COMMENT_TABLE} AS c ON b.id=c.uploadId WHERE c.boardIndex=${bindex}) AS d ON a.id=d.uploadId`;
        whereBase = `d.index>${cindex} ORDER BY d.index DESC LIMIT ${cpagesize*cpage}, ${cpagesize};`;
    } else if(valid1){ // 조회할 댓글 번호 있음 (하나)
        // valueBase = 'a.name AS nickName, d.index AS cindex, d.*';
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS a RIGHT OUTER JOIN (SELECT b.logopath AS logopath, c.* FROM ${dotEnv.LOGO_TABLE} AS b RIGHT OUTER JOIN ${dotEnv.COMMENT_TABLE} AS c ON b.id=c.uploadId WHERE c.index=${cindex}) AS d ON a.id=d.uploadId`;
        whereBase = '1=1'
    } else if(valid2){ // 조회할 글 번호 있음 (여러개)
        // valueBase = 'a.name AS nickName, d.index AS cindex, d.*';
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS a RIGHT OUTER JOIN (SELECT b.logopath AS logopath, c.* FROM ${dotEnv.LOGO_TABLE} AS b RIGHT OUTER JOIN ${dotEnv.COMMENT_TABLE} AS c ON b.id=c.uploadId WHERE c.boardIndex=${bindex}) AS d ON a.id=d.uploadId`;
        whereBase = `1=1 ORDER BY d.index DESC LIMIT ${cpagesize*cpage}, ${cpagesize};`; 
    } else if(valid4){ // 조회할 ID 있음 (여러개)
        // valueBase = 'a.name AS nickName, d.index AS cindex, d.*';
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS a RIGHT OUTER JOIN (SELECT b.logopath AS logopath, c.* FROM ${dotEnv.LOGO_TABLE} AS b RIGHT OUTER JOIN ${dotEnv.COMMENT_TABLE} AS c ON b.id=c.uploadId WHERE c.uploadId='${queryUploadId}') AS d ON a.id=d.uploadId`;
        whereBase = `1=1 ORDER BY d.index DESC LIMIT ${cpagesize*cpage}, ${cpagesize};`;
    } else if(valid3){ // 로그인한 상태
        // valueBase = 'a.name AS nickName, d.index AS cindex, d.*';
        fromBase = `${dotEnv.USERINFO_UNION_MOREINFO} AS a RIGHT OUTER JOIN (SELECT b.logopath AS logopath, c.* FROM ${dotEnv.LOGO_TABLE} AS b RIGHT OUTER JOIN ${dotEnv.COMMENT_TABLE} AS c ON b.id=c.uploadId WHERE c.uploadId='${accessToken.id}') AS d ON a.id=d.uploadId`;
        whereBase = `1=1 ORDER BY d.index DESC LIMIT ${cpagesize*cpage}, ${cpagesize};`;
    } else{ // 그 어떤 조건도 만족하지 않음 
        return [-1, -1];
    }

    try{
        let value = valueBase;
        let from = fromBase;
        let where = whereBase;

        // console.log(value);
        // console.log(from);
        // console.log(where);

        [dbresult, dbfield] = await dbReserved.dynamic_select(value, from, where);
    }
    catch(error){
        console.log(error);
        dbresult = null;
    }
    
    return [dbresult, dbfield];
};

module.exports = {
    read_board_f: async (req, res)=>{ // 최초 글 호출
        let result = {
            result: [],
            code: 200
        }; 

        let loginValid = false;
        let accessToken = TokenManager.getToken(req);
        let dbresult, dbfield;
        var PA1, PA2, PA3;

        if(req.query && req.query.bindex && Number.isInteger(parseInt(req.query.bindex))){
            try{
                PA1 = `c.name AS nickName, d.logoPath, d.index, d.uploadId, d.timeStamp, d.ip, d.title, d.content, d.viewCount, d.type, d.hideLevel, d.imgPath, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=d.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=d.index and recType='x') as unRecommendCount, (select count(*) from ${dotEnv.BOARD_OBJ_TABLE} where bindex=d.index) as objectionCount`;
                if(accessToken) { // 로그인 한 상태
                    accessToken = await TokenManager.verifyToken(accessToken, req);
    
                    if(Number.isInteger(accessToken)){// 유효하지 않은 로그인 상태
                        TokenManager.tokenVerifyValue(accessToken, result);
                    } else{ // 유효한 로그인 상태
                        if(['o', 'm'].indexOf(accessToken.auth) === -1){
                            PA2 = `${dotEnv.USERINFO_UNION_MOREINFO} AS c RIGHT OUTER JOIN (SELECT * FROM ${dotEnv.LOGO_TABLE} AS a RIGHT OUTER JOIN ${dotEnv.BOARD_TABLE} AS b ON a.id = b.uploadId WHERE b.hideLevel != 3) AS d ON c.id = d.uploadId`;
                            PA3 = `d.index=${req.query.bindex} AND (d.hideLevel=0 OR d.uploadId='${accessToken.id}' OR (d.uploadId IN (SELECT follow from ${dotEnv.FOLLOW_TABLE} WHERE id='${accessToken.id}') AND d.hideLevel=1) OR (d.uploadId IN (SELECT friend from friend WHERE id='${accessToken.id}') AND d.hideLevel IN (1,2)));`;
                        }    
                        else{ // 관리자인 경우
                            PA2 = `${dotEnv.USERINFO_UNION_MOREINFO} AS c RIGHT OUTER JOIN (SELECT * FROM ${dotEnv.LOGO_TABLE} AS a RIGHT OUTER JOIN ${dotEnv.BOARD_TABLE} AS b ON a.id = b.uploadId) AS d ON c.id = d.uploadId`;
                            PA3 = `d.index=${req.query.bindex};`;
                        }
                        
                        loginValid = true;
                    }
                } else{ // 로그인 안한 상태
                    PA2 = `${dotEnv.USERINFO_UNION_MOREINFO} AS c RIGHT OUTER JOIN (SELECT * FROM ${dotEnv.LOGO_TABLE} AS a RIGHT OUTER JOIN ${dotEnv.BOARD_TABLE} AS b ON a.id = b.uploadId WHERE b.hideLevel != 3) AS d ON c.id = d.uploadId`;
                    PA3 = `d.hideLevel=0 AND d.index=${req.query.bindex};`;
                }
    
                if(result.code === 200){
                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '게시글정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else if(dbresult.length === 0){
                        result.result = '공개되지 않은 게시글이거나 존재하지 않는 게시글입니다.';
                        result.code = 400;
                    } else{
                        result.result = dbresult[0];
                        result.result.viewCount = dbresult[0].viewCount+1;
                        result.result.timeStamp = dbresult[0].timeStamp.getTime();
                        result.result.isAbleModif = loginValid? (dbresult[0].uploadId === accessToken.id || ['o', 'm'].indexOf(accessToken.auth) !== -1): false;


                        result.code = 200;

                        try{
                            PA1 = dotEnv.BOARD_TABLE;
                            PA2 = 'viewCount=viewCount+1';
                            PA3 = `${dotEnv.BOARD_TABLE}.index=${result.result.index}`;

                            [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);
                        }
                        catch(error){
                            console.log(error);
                        }
                    }
                } else{
    
                }
            }
            catch(error){
                console.log(error);
                result.result = '게시글정보를 불러오는 중 오류가 발생했습니다. (100)'
                result.code = 500;
            }
        } else{
            result.result = '게시글 번호를 입력해야 합니다.';
            result.code = 400;
        }
        
        commonFunction.sendResult(res, result);
    },
    read_boards_f: async (req, res)=>{ // 최초 글 호출
        let result = {
            result: [],
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req);
        let loginValid = false;
        let dbresult, dbfield;

        try{
            if(accessToken) {
                accessToken = await TokenManager.verifyToken(accessToken, req);

                if(!Number.isInteger(accessToken)) loginValid = true;
            }

            [dbresult, dbfield] = await readBase(req);
            
            //console.log(dbresult);

            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '게시글정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else{ // 정보 불러오기 성공
                // console.log(dbresult[0])
                for(var i = 0; i < dbresult.length; i++){
                    
                    if(loginValid && ['o', 'm'].indexOf(accessToken.auth) !== -1){
                        dbresult[i].timeStamp = dbresult[i].timeStamp.getTime();
                        dbresult[i].isAbleModif = true;
                        //dbresult[i].content = '';
                        result.result.push(dbresult[i]);
                    } else{
                        result.result.push(
                            {
                                index: dbresult[i].index, // 글번호
                                nickName: dbresult[i].nickName, // 글 올린사람 이름
                                logoPath: dbresult[i].logoPath, // 글 올린사람 로고경로
                                timeStamp: dbresult[i].timeStamp.getTime(), // 올린시간
                                title: dbresult[i].title, // 글 제목
                                content: dbresult[i].content, //dbresult[i].content, // 글 내용
                                imgPath: dbresult[i].imgPath, // 글 이미지 경로
                                viewCount: dbresult[i].viewCount, // 조회수
                                recommendCount: dbresult[i].recommendCount, // 추천수
                                unRecommendCount: dbresult[i].unRecommendCount, // 비추천수
                                commentsCount: dbresult[i].commentsCount, // 댓글수
                                objectionCount: dbresult[i].objectionCount,
                                type: dbresult[i].type, // 글 종류
                                hideLevel: dbresult[i].hideLevel, // 글 숨김 레벨
                                isAbleModif: loginValid? (dbresult[i].uploadId === accessToken.id || accessToken.auth === 'o'): false, // 글 수정 가능 여부
                            }
                        );
                    }
                }
                // console.log(dbresult[0]);
                result.code = 200;
            }
        }
        catch(error){
            console.log(error);
            result.result = '게시글정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }
          
        commonFunction.sendResult(res, result);
    },
    new_read_boards_f: async (req, res)=>{ // 최초 글 호출
        let result = {
            result: [],
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req);
        let loginValid = false;
        let dbresult, dbfield;

        try{
            if(accessToken) {
                accessToken = await TokenManager.verifyToken(accessToken, req);

                if(!Number.isInteger(accessToken)) loginValid = true;
            }

            [dbresult, dbfield] = await newReadBoardFunction(req);
            
            //console.log(dbresult);

            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '게시글정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else{ // 정보 불러오기 성공
                if(req.query && req.query.isExist){ // 업로드할 게시글이 있음
                    if(dbresult.length > 0) result.result = true;
                    else result.result = false;
                } else{
                    for(var i = 0; i < dbresult.length; i++){
                    
                        if(loginValid && ['o', 'm'].indexOf(accessToken.auth) !== -1){
                            dbresult[i].timeStamp = dbresult[i].timeStamp.getTime();
                            dbresult[i].isAbleModif = true;
                            //dbresult[i].content = '';
                            result.result.push(dbresult[i]);
                        } else{
                            result.result.push(
                                {
                                    uploadId: dbresult[i].uploadId, // 아이디
                                    index: dbresult[i].index, // 글번호
                                    nickName: dbresult[i].nickName, // 글 올린사람 이름
                                    logoPath: dbresult[i].logoPath, // 글 올린사람 로고경로
                                    timeStamp: dbresult[i].timeStamp.getTime(), // 올린시간
                                    title: dbresult[i].title, // 글 제목
                                    content: dbresult[i].content, //dbresult[i].content, // 글 내용
                                    imgPath: dbresult[i].imgPath, // 글 이미지 경로
                                    viewCount: dbresult[i].viewCount, // 조회수
                                    recommendCount: dbresult[i].recommendCount, // 추천수
                                    unRecommendCount: dbresult[i].unRecommendCount, // 비추천수
                                    commentsCount: dbresult[i].commentsCount, // 댓글수
                                    objectionCount: dbresult[i].objectionCount,
                                    type: dbresult[i].type, // 글 종류
                                    hideLevel: dbresult[i].hideLevel, // 글 숨김 레벨
                                    isAbleModif: loginValid? (dbresult[i].uploadId === accessToken.id || accessToken.auth === 'o'): false, // 글 수정 가능 여부
                                    recType: dbresult[i].recType,
                                }
                            );
                        }
                    }
                }
                // console.log(dbresult[0]);
                result.code = 200;
            }
        }
        catch(error){
            console.log(error);
            result.result = '게시글정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }
        // console.log(result);
        commonFunction.sendResult(res, result);
    },

    read_all_follower_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req)
        let dbresult, dbfield;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                var PA1, PA2, PA3;
                PA1 = 'a.follow as followId, b.name as followName';
                PA2 = `${dotEnv.FOLLOW_TABLE} AS a, ${dotEnv.USERINFO_UNION_MOREINFO} AS b`;
                PA3 = `a.id='${accessToken.id}' AND a.follow = b.id`;

                try {
                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '팔로우한 유저 정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 정보 불러오기 성공
                        for(var i = 0; i < dbresult.length; i++){
                            result.result.push({
                                followId: dbresult[i].followId,
                                followName : dbresult[i].followName
                            });
                        }
                        result.code = 200;
                    }
                } 
                catch (error) {
                    console.log(error);
                    result.result = '팔로우한 유저 정보를 불러오는데 실패했습니다. (100)';
                    result.code = 500;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    read_all_block_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        }; 
        let accessToken = TokenManager.getToken(req);
        let dbresult, dbfield;

        if(accessToken !== null){ // 토큰이 있는 경우
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                var PA1, PA2, PA3;
                PA1 = 'a.block as blockId, b.name as blockName';
                PA2 = `${dotEnv.BLOCK_TABLE} AS a, ${dotEnv.USERINFO_UNION_MOREINFO} AS b`;
                PA3 = `a.id='${accessToken.id}' AND a.block = b.id`;

                try {
                    [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '차단한 유저 정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 정보 불러오기 성공
                        for(var i = 0; i < dbresult.length; i++){
                            result.result.push({
                                blockId: dbresult[i].blockId,
                                blockName : dbresult[i].blockName
                            });
                        }
                        result.code = 200;
                    }
                } 
                catch (error) {
                    console.log(error);
                    result.result = '차단한 유저 정보를 불러오는데 실패했습니다. (100)';
                    result.code = 500;
                }
            }
        } else{
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        }

        commonFunction.sendResult(res, result);
    },
    // read_comment_f: async (req, res)=>{
    //     let result = {
    //         result: null,
    //         code: 200
    //     };

    //     let accessToken = TokenManager.getToken(req);
    //     let loginValid = false;
    //     let dbresult, dbfield;

    //     if(accessToken) {
    //         accessToken = await TokenManager.verifyToken(accessToken, req);

    //         if(Number.isInteger(accessToken)) {
    //             TokenManager.tokenVerifyValue(accessToken, result);
    //         } else{
    //             loginValid = true;
    //         }
    //     }

    //     if(result.code === 200){
    //         if(req.query && Number.isInteger(parseInt(req.query.cindex))){
    //             try{
    //                 PA1 = `a.name AS nickName, d.index AS cindex, d.boardIndex as bindex, d.*, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=d.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=d.index and recType='x') as unRecommendCount, d.hideLevel as hideLevel`;
    //                 PA2 = `${dotEnv.USERINFO_UNION_MOREINFO} AS a RIGHT OUTER JOIN (SELECT b.logopath AS logopath, c.* FROM ${dotEnv.LOGO_TABLE} AS b RIGHT OUTER JOIN ${dotEnv.COMMENT_TABLE} AS c ON b.id=c.uploadId WHERE c.index=${req.query.cindex}) AS d ON a.id=d.uploadId`;
    //                 PA3 = '1=1';
        
    //                 [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);
    
    //                 if(dbresult === null){ // 정보 불러오기 실패
    //                     result.result = '댓글정보를 불러오는데 실패했습니다.';
    //                     result.code = 500;
    //                 } else if(dbresult.length === 0){
    //                     result.result = '존재하지 않는 댓글입니다.';
    //                     result.code = 400;
    //                 } else{
    //                     result.result = dbresult[0];
    //                     result.result.content = (dbresult[0].hideLevel === 0 || (loginValid && ['o', 'm'].indexOf(accessToken.auth) !== -1)) ? dbresult[0].content: blockContent, // 글 내용
    //                     result.result.isAbleModif = loginValid? (dbresult[0].uploadId === accessToken.id): false, // 글 수정 가능 여부
    //                     result.code = 200;
    //                 }
    //             }
    //             catch(error){
    //                 console.log(error);
    //                 result.result = '댓글정보를 불러오는 중 오류가 발생했습니다. (100)'
    //                 result.code = 500;
    //             }
    //         } else{
    //             result.result = '댓글 번호를 입력해야 합니다.';
    //             result.code = 400;
    //         }
    //     }

    //     commonFunction.sendResult(res, result);
    // },
    read_comments_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };

        let accessToken = TokenManager.getToken(req);
        let loginValid = false;
        let dbresult, dbfield;

        if(accessToken) {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(!Number.isInteger(accessToken)) loginValid = true;
        }


        try {
            [dbresult, dbfield] = await readComment(req);

            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '댓글을 불러오는데 실패했습니다. (100)';
                result.code = 500;
            } else if(dbresult === -1){ // 정보 불러오기 실패
                result.result = '댓글을 보기 위해서는 하나 이상의 정보가 있어야 합니다.';
                result.code = 400;
            } else{ // 정보 불러오기 성공

                for(var i = 0; i < dbresult.length; i++){
                    if(loginValid && ['o', 'm'].indexOf(accessToken.auth) !== -1){
                        dbresult[i].timeStamp = dbresult[i].timeStamp.getTime();
                        dbresult[i].isAbleModif = true;
                        result.result.push(dbresult[i]);
                    } else{
                        result.result.push({
                            index: dbresult[i].cindex, // 댓글번호
                            bindex: dbresult[i].bindex, // 글번호
                            nickName: dbresult[i].nickName, // 글 올린사람 이름
                            logoPath: dbresult[i].logoPath, // 글 올린사람 로고경로
                            timeStamp: dbresult[i].timeStamp.getTime(), // 올린시간
                            content: (dbresult[i].hideLevel === 0 || (loginValid && accessToken.auth === 'o')) ? dbresult[i].content: blockContent, // 글 내용
                            // viewCount: dbresult[i].viewCount, // 조회수
                            recommendCount: dbresult[i].recommendCount, // 추천수
                            unRecommendCount: dbresult[i].unRecommendCount, // 비추천수
                            isAbleModif: loginValid? (dbresult[i].uploadId === accessToken.id): false, // 글 수정 가능 여부
                            recType: dbresult[i].recType,
                        });
                    }
                }
                result.code = 200;
            }
        } 
        catch (error) {
            console.log(error);
            result.result = '댓글을 불러오는데 실패했습니다. (101)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },

    get_user_list_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };

        const nameRegExp = /^[0-9a-zA-Z가-힣_]{0,}$/;

        let PA1 = 'um.*', PA2 = `(SELECT ui.*, lt.logoPath FROM ${dotEnv.USERINFO_UNION_MOREINFO} as ui LEFT OUTER JOIN ${dotEnv.LOGO_TABLE} as lt ON ui.id=lt.id) as um`, PA3 = '';
        let accessToken = TokenManager.getToken(req);
        let dbresult, dbfield;
        let userName = req.query? req.query.userName? req.query.userName: '.*': '.*';
        let page = (req.query? req.query.page? req.query.page: 1: 1)-1;
        let pageSize = req.query? req.query.pageSize? req.query.pageSize: 5: 5;

        try {
            if(nameRegExp.test(userName) === false){
                userName = '.*';
            }

            PA3 = `(REGEXP_INSTR(um.id, '${userName}') OR REGEXP_INSTR(um.name, '${userName}'))`;
            
            if(accessToken) {
                accessToken = await TokenManager.verifyToken(accessToken, req);
    
                if(!Number.isInteger(accessToken)) { // 로그인한 상태
                    PA1 = PA1 + `, (select count(*) from ${dotEnv.FOLLOW_TABLE} where id='${accessToken.id}' and follow=um.id) as alreadyFollow, (select count(*) from friend where id='${accessToken.id}' and friend=um.id) as alreadyFriend, (um.id='${accessToken.id}') as isMe`;
                    PA3 += ``;
                }
            }
    
            PA3 += ` LIMIT ${page*pageSize}, ${pageSize}`;

            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '유저를 검색하는데 실패했습니다. (100)';
                result.code = 500;
            } else{ // 정보 불러오기 성공
                for(var i = 0; i < dbresult.length; i++){
                    result.result.push({
                        id: dbresult[i].id,
                        name: dbresult[i].name,
                        logoPath: dbresult[i].logoPath,
                        alreadyFollow: dbresult[i].alreadyFollow,
                        alreadyFriend: dbresult[i].alreadyFriend,
                        isMe: dbresult[i].isMe,
                    });
                }
                result.code = 200;
            }
        } 
        catch (error) {
            console.log(error);
            result.result = '유저를 검색하는데 실패했습니다. (101)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },

    get_feedback_tag_f: async (req, res)=>{
        let result = {
            result: {},
            code: 200
        };
        let dbresult, dbfield;
        let PA1, PA2, PA3;

        try {
            PA1 = 'fbt.NAME AS bigName, fbt.tag AS bigTag, fst.NAME AS smallName, fst.tag AS smallTag';
            PA2 = 'feedBigTag AS fbt RIGHT OUTER JOIN feedSmallTag AS fst ON fbt.tag=fst.bigTag';
            PA3 = '1=1 ORDER BY bigTag DESC, smallTag DESC';

            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

            if(dbresult === null){
                result.result = '피드백을 가져오는데 실패했습니다. (100)';
                result.code = 500;
            } else{
                for(var i in dbresult){
                    if(!result.result[dbresult[i].bigTag]){
                        result.result[dbresult[i].bigTag] = {
                            bigName: dbresult[i].bigName,
                            smallTag: [],
                        };
                    }

                    result.result[dbresult[i].bigTag].smallTag.push({
                        smallTag: dbresult[i].smallTag,
                        smallName: dbresult[i].smallName,
                    });
                }
            }

        } 
        catch (error) {
            console.log(error);
            result.result = '피드백을 가져오는데 실패했습니다. (102)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    get_feedback_list_f: async (req, res)=>{
        let result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;
        let PA1, PA2, PA3;
        let accessToken = TokenManager.getToken(req);

        try {
            if(accessToken){
                accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    let query = {
                        startDate: null, // 두 개가 다 있어야 날짜 범위로 출력
                        endDate: null, // 두 개가 다 있어야 날짜 범위로 출력
                        lastRange: 30, // 일수로 계산 최대 1년전 까지 가능 일 수로 계산
                        bigTag: '.*', // 기본 '.*'
                        smallTag: '.*', // 기본 '.*' 
                        desc: 0, // 0 - date desc(default), 1 - date asc, 2 - rec desc, 3 - rec asc, 4 - unrec desc, 5 - unrec asc
                    };

                    let checker = {
                        bool0: false, bool1: false, bool2: false,
                    };

                    if(req.query){
                        query.startDate = req.query.startDate || null;
                        query.endDate = req.query.endDate || null;
                        query.lastRange = req.query.lastRange || 30;
                        query.bigTag = req.query.bigTag || '.*';
                        query.smallTag = req.query.smallTag || '.*';
                        query.desc = req.query.desc || 0;
                    }

                    if(query.startDate && query.endDate && dateChecker(query.startDate) && dateChecker(query.endDate)){
                        query.startDate += " 00:00:00";
                        query.endDate += " 00:00:00";
                        var a = new Date(query.startDate), b = new Date(query.endDate);
                        if(a < b){
                            checker.bool0 = true;
                        } else{
                            query.startDate = null;
                            query.endDate = null;
                        }
                    } else{
                        query.startDate = null;
                        query.endDate = null;
                    }

                    if(!checker.bool0){ // 시작 - 끝 범위가 정해지면 패스
                        if(Number.isInteger(Number.parseInt(query.lastRange))){
                            if(Number.parseInt(query.lastRange) > 0 && Number.parseInt(query.lastRange) < 366){
                                checker.bool1 = true;
                                query.lastRange = Number.parseInt(query.lastRange);

                                query.endDate = new Date().toISOString().split(".")[0].replace("T", " ");
                                query.startDate = new Date();
                                query.startDate.setDate(query.startDate.getDate() - query.lastRange);

                                query.startDate = query.startDate.toISOString().split(".")[0].replace("T", " ");
                            } else if(Number.parseInt(query.lastRange) < 366){
                                result.result = '오늘을 기준으로 확인할 수 있는 피드백의 기한은 최대 1년 입니다.';
                                result.code = 400;
                            } else{
                                result.result = '오늘을 기준으로 최소 하루 전의 날짜의 피드백들만 조회할 수 있습니다.';
                                result.code = 400;
                            }
                        } else{
                            result.result = '최소 하나의 날짜 범위를 정해줘야 합니다. (시작날짜-종료날짜 or 현재 시간으로부터 N일전)';
                            result.code = 400;
                        }
                    }

                    if(checker.bool0 || checker.bool1){
                        PA1 = "*";
                        PA2 = dotEnv.FEED_BIG_TABLE;
                        PA3 = `REGEXP_INSTR(tag, '${query.bigTag}')`;

                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult !== null){
                            if(dbresult.length > 0){
                                PA1 = "*";
                                PA2 = dotEnv.FEED_SMALL_TABLE;
                                PA3 = `REGEXP_INSTR(bigTag, '${query.bigTag}') AND REGEXP_INSTR(bigTag, '${query.smallTag}')`;

                                [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                if(dbresult !== null){
                                    if(dbresult.length > 0){
                                        checker.bool2 = true;
                                    } else{
                                        result.result = '존재하는 피드백 소분류 태그가 없습니다.';
                                        result.code = 400;
                                    }
                                } else{
                                    result.result = "DB에서 피드백 조회 작업 중 문제가 발생했습니다. (101)";
                                    result.code = 500;
                                }
                            } else{
                                result.result = '존재하는 피드백 대분류 태그가 없습니다.';
                                result.code = 400;
                            }
                        } else{
                            result.result = "DB에서 피드백 조회 작업 중 문제가 발생했습니다. (100)";
                            result.code = 500;
                        }
                    } else{

                    }

                    if(checker.bool2){
                        if(Number.isInteger(Number.parseInt(query.desc)) && Number.parseInt(query.desc) >= 0){
                            query.desc = Number.parseInt(query.desc);
                        } else{
                            query.desc = 0;
                        }
    
                        if(checker.bool0){
                            PA3 = `(fff.uploadDate >= '${query.startDate}' AND fff.uploadDate <= '${query.endDate}') `;
                        } else if(checker.bool1){
                            PA3 = `(fff.uploadDate >= '${query.startDate}') `;
                        }

                        if(query.desc === 0){
                            PA3 += "ORDER BY fff.uploadDate DESC";
                        } else if(query.desc === 1){
                            PA3 += "ORDER BY fff.uploadDate ASC";
                        } else if(query.desc === 2){
                            PA3 += "ORDER BY fff.rec DESC, fff.uploadDate DESC";
                        } else if(query.desc === 3){
                            PA3 += "ORDER BY fff.rec ASC, fff.uploadDate DESC";
                        } else if(query.desc === 4){
                            PA3 += "ORDER BY fff.unrec DESC, fff.uploadDate DESC";
                        } else if(query.desc === 5){
                            PA3 += "ORDER BY fff.unrec ASC, fff.uploadDate DESC";
                        }

                        PA1 = "fff.*";
                        PA2 = dotEnv.FEED_TOTAL_TABLE;
                        PA3 = PA3;

                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                        if(dbresult !== null){
                            for(var i in dbresult){
                                let tempDb = dbresult[i];

                                tempDb.id = ['o', 'm'].indexOf(accessToken.auth) === -1? '': tempDb.id;

                                result.result.push(tempDb);
                            }
                        } else{
                            result.result = "DB에서 피드백 조회 작업 중 문제가 발생했습니다. (102)";
                            result.code = 500;
                        }
                    } else{

                    }
                }
            } else{
                result.result = '로그인 후 이용가능한 서비스입니다.';
                result.code = 400;
            }

        } 
        catch (error) {
            console.log(error);
            result.result = '피드백을 가져오는데 실패했습니다. (103)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    get_feedback_rec_f: async (req, res)=>{
        let result = {
            result: {},
            after: {},
            code: 200
        };
        let dbresult, dbfield;
        let PA1, PA2, PA3;
        let query = req.query;
        let accessToken = TokenManager.getToken(req);

        try {
            if(accessToken){
                accessToken = await TokenManager.verifyToken(accessToken, req);

                if(Number.isInteger(accessToken)){
                    TokenManager.tokenVerifyValue(accessToken, result);
                } else{
                    if(query){
                        if(!query.findex || !Number.isInteger(Number.parseInt(query.findex)) || !(Number.parseInt(query.findex) > 0)){
                            result.result = '잘못된 피드백 번호입니다.';
                            result.code = 400;
                        } else if(['o', 'x'].indexOf(query.recType) === -1){
                            result.result = '잘못된 추천 쿼리입니다.';
                            result.code = 400;
                        } else{
                            PA1 = "count(*), recType";
                            PA2 = dotEnv.FEED_REC_TABLE;
                            PA3 = `id='${accessToken.id}' AND findex=${query.findex}`;

                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                            if(dbresult === null){
                                result.result = '피드백 추천 중 문제가 발생했습니다. (100)';
                                result.code = 500;
                            } else{
                                if(dbresult[0]['count(*)'] === 0){
                                    PA1 = dotEnv.FEED_REC_TABLE;
                                    PA2 = "";
                                    PA3 = `${query.findex}, '${accessToken.id}', '${query.recType}'`;

                                    [dbresult, dbfield] = await dbReserved.dynamic_insert(PA1, PA2, PA3);

                                    if(dbresult === null){
                                        result.result = '피드백 추천 중 문제가 발생했습니다. (101)';
                                        result.code = 500;
                                    } else{
                                        PA1 = `(SELECT COUNT(*) FROM ${dotEnv.FEED_REC_TABLE} WHERE findex=${query.findex} AND recType='o') AS rec, (SELECT COUNT(*) FROM ${dotEnv.FEED_REC_TABLE} WHERE findex=${query.findex} AND recType='x') AS unrec`;
                                        PA2 = 'DUAL';
                                        PA3 = '1=1';

                                        [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                        if(dbresult === null){
                                            result.result = '피드백 추천 중 문제가 발생했습니다. (102)';
                                            result.code = 500;
                                        } else{
                                            result.result = query.recType === 'o'? "추천에 성공하셨습니다.": "비추천에 성공했습니다.";
                                            result.after.rec = dbresult[0].rec;
                                            result.after.unrec = dbresult[0].unrec;
                                        }
                                    }
                                } else{
                                    if(dbresult[0]['recType'] === query.recType){
                                        PA1 = dotEnv.FEED_REC_TABLE;
                                        PA2 = `id='${accessToken.id}' AND findex=${query.findex}`;

                                        [dbresult, dbfield] = await dbReserved.dynamic_delete(PA1, PA2);

                                        if(dbresult === null){
                                            result.result = '피드백 추천 중 문제가 발생했습니다. (103)';
                                            result.code = 500;
                                        } else{
                                            PA1 = `(SELECT COUNT(*) FROM ${dotEnv.FEED_REC_TABLE} WHERE findex=${query.findex} AND recType='o') AS rec, (SELECT COUNT(*) FROM ${dotEnv.FEED_REC_TABLE} WHERE findex=${query.findex} AND recType='x') AS unrec`;
                                            PA2 = 'DUAL';
                                            PA3 = '1=1';

                                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                            if(dbresult === null){
                                                result.result = '피드백 추천 중 문제가 발생했습니다. (105)';
                                                result.code = 500;
                                            } else{
                                                result.result = query.recType === 'o'? "추천을 취소했습니다.": "비추천을 취소했습니다.";
                                                result.after.rec = dbresult[0].rec;
                                                result.after.unrec = dbresult[0].unrec;
                                            }
                                        }
                                    } else{
                                        PA1 = dotEnv.FEED_REC_TABLE;
                                        PA2 = `recType='${query.recType}'`;
                                        PA3 = `findex=${query.findex} AND id='${accessToken.id}'`;

                                        [dbresult, dbfield] = await dbReserved.dynamic_update(PA1, PA2, PA3);

                                        if(dbresult === null){
                                            result.result = '피드백 추천 중 문제가 발생했습니다. (104)';
                                            result.code = 500;
                                        } else{
                                            PA1 = `(SELECT COUNT(*) FROM ${dotEnv.FEED_REC_TABLE} WHERE findex=${query.findex} AND recType='o') AS rec, (SELECT COUNT(*) FROM ${dotEnv.FEED_REC_TABLE} WHERE findex=${query.findex} AND recType='x') AS unrec`;
                                            PA2 = 'DUAL';
                                            PA3 = '1=1';

                                            [dbresult, dbfield] = await dbReserved.dynamic_select(PA1, PA2, PA3);

                                            if(dbresult === null){
                                                result.result = '피드백 추천 중 문제가 발생했습니다. (105)';
                                                result.code = 500;
                                            } else{
                                                result.result = query.recType === 'o'? "추천에 성공하셨습니다.": "비추천에 성공했습니다.";
                                                result.after.rec = dbresult[0].rec;
                                                result.after.unrec = dbresult[0].unrec;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else{
                        result.result = '피드백 추천을 위해서는 인자가 필요합니다.';
                        result.code = 400;
                    }
                }
            } else{
                result.result = '로그인이 필요한 서비스입니다.';
                result.code = 400;
            }
        } 
        catch (error) {
            console.log(error);
            result.result = '피드백을 추천하는데 실패했습니다. (106)';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
};