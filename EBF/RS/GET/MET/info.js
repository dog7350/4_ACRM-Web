const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');

module.exports = {
    base_f: async function(req, res){
        var result = {
            result: null,
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "*", 
                        `(select umg.*, lt.logoPath from ${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} as umg LEFT OUTER JOIN ${dotEnv.LOGO_TABLE} as lt ON umg.id=lt.id) as ui`, 
                        `ui.id='${accessToken.id}'`);
                    
                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 정보 불러오기 성공
                        // console.log(dbresult[0]);
                        result.result = {
                            id: dbresult[0].id,
                            pw: '',
                            logoPath: dbresult[0].logoPath,
                            name: dbresult[0].name,
                            email: dbresult[0].email, 
                            address: dbresult[0].address, 
                            phone: dbresult[0].phone, 
                            money: dbresult[0].money, 
                            cash: dbresult[0].cash, 
                            admin: dbresult[0].admin,
                            usecar: dbresult[0].usecar,
                            usegun: dbresult[0].usegun,
                            invitf: dbresult[0].invitf,
                            difficult: dbresult[0].difficult,
                            connect: dbresult[0].connect,
                        };
                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    friend_follow_f: async (req, res)=>{
        var result = {
            result: {
                friend: [],
                follow: [],
            },
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    var PA1, PA2, PA3;
                    PA1 = `flt.follow as follow, mi.name as name, (SELECT logoPath FROM ${dotEnv.LOGO_TABLE} as lt WHERE lt.id=flt.follow) as logo`;
                    PA2 = `${dotEnv.FOLLOW_TABLE} as flt LEFT OUTER JOIN moreinfo as mi ON flt.follow=mi.id`;
                    PA3 = `flt.id='${accessToken.id}'`;

                    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
                    
                    if(dbresult === null){
                        result.result.follow = '팔로우를 불러오는데 실패했습니다.';
                    } else{
                        for(var i in dbresult){
                            result.result.follow.push({
                                id: dbresult[i]['follow'],
                                name: dbresult[i]['name'],
                                logo: dbresult[i]['logo'],
                            });
                        }
                    }

                    PA1 = `fr.friend as friend, mi.name as name, (SELECT logoPath FROM ${dotEnv.LOGO_TABLE} as lt WHERE lt.id=fr.friend) as logo`;
                    PA2 = `friend as fr LEFT OUTER JOIN moreinfo as mi ON fr.friend=mi.id`;
                    PA3 = `fr.id='${accessToken.id}'`;

                    [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);
                    
                    if(dbresult === null){
                        result.result.friend = '친구를 불러오는데 실패했습니다.';
                    } else{
                        for(var i in dbresult){
                            result.result.friend.push({
                                id: dbresult[i]['friend'],
                                name: dbresult[i]['name'],
                                logo: dbresult[i]['logo'],
                            });
                        }
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = 'DM 리스트를 불러오는데 실패했습니다.';
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    notifi_f: async function(req, res){
        var result = {
            result: [

            ],
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    if(req.query.nindex){
                        [dbresult, dbfield] = await DBReserved.dynamic_select(
                            "*", 
                            `${dotEnv.NOTIFI_TABLE} as nt`, 
                            `nt.receiver='${accessToken.id}' AND nt.nindex < ${req.query.nindex} ORDER BY nt.nindex DESC LIMIT 7`);
                    } else{
                        [dbresult, dbfield] = await DBReserved.dynamic_select(
                            "*", 
                            `${dotEnv.NOTIFI_TABLE} as nt`, 
                            `nt.receiver='${accessToken.id}' ORDER BY nt.nindex DESC LIMIT 7`);
                    }

                    // [dbresult, dbfield] = await DBReserved.dynamic_select(
                    //     "*", 
                    //     `${dotEnv.NOTIFI_TABLE} as nt`, 
                    //     `nt.receiver='${accessToken.id}' ORDER BY nt.nindex DESC LIMIT ${7*(req.query.page-1)}, ${7*(req.query.page)-1}`);
                    
                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 정보 불러오기 성공
                        let indexString = '';

                        for(i in dbresult){
                            indexString = indexString + dbresult[i]['nindex'];

                            if(parseInt(i)+1 != dbresult.length){
                                indexString = indexString + ',';
                            }

                            result.result.push({
                                nindex: dbresult[i]['nindex'],
                                publisher: dbresult[i]['publisher'],
                                name: dbresult[i]['name'],
                                notifidate: dbresult[i]['notifidate'],
                                isview: dbresult[i]['isview'],
                                content: dbresult[i]['content'],
                            });
                        }
                        result.code = 200;
                        

                        if(indexString.length === 0){
                            indexString = '-1';
                        }

                        try{
                            DBReserved.dynamic_update(
                                'communitynotifi',
                                'isview=1',
                                `nindex IN (${indexString})`);
                        }
                        catch(err){
                            console.log(err);
                        }
                        
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    friends_f: async function(req, res){
        var result = {
            result: null,
            code: 200
        };
    
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){ // 토큰이 없으면 강퇴
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "*, (select logoPath from communityuserlogopath where id=tempTable.id)", 
                        `${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} as tempTable`, 
                        `tempTable.id IN (SELECT fr.friend AS fid FROM ${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} AS ui JOIN friend AS fr WHERE ui.id=fr.id AND ui.id='${accessToken.id}')`);
                    
                    
                    if(dbresult === null){ // 친구 목록 불러오기 실패
                        result.result = '친구 목록을 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 친구 목록 불러오기 성공
                        var array = [];
    
                        if(dbresult.length > 0) // 친구가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) 
                                array.push([dbresult[i].name, dbresult[i].connect, dbresult[i].logoPath, dbresult[i].id]);
                        
                        result.result = array;
                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '친구 목록을 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
            
        }

        commonFunction.sendResult(res, result);
    },
    mycar_f: async function(req, res){
        var result = {
            result: null,
            code: 200
        };
    
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "cname", 
                        "carinfo", 
                        `cnum IN (SELECT uc.cnum AS ccnum FROM userinfo AS ui JOIN usecar AS uc WHERE ui.id = uc.id AND ui.id='${accessToken.id}')`);
                    
                    if(dbresult === null){ // 자동차 목록 불러오기 실패
                        result.result = '소유한 자동차 목록을 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 자동차 목록 불러오기 성공
                        var array = [];
                    
                        if(dbresult.length > 0) // 자동차가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) array.push(dbresult[i]['cname']);
                        
                        result.result = array;
                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '소유한 자동차 목록을 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    mygun_f: async function(req, res){
        var result = {
            result: null,
            code: 200
        };
    
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "gname", 
                        "guninfo", 
                        `gnum IN (SELECT ug.gnum AS ggnum FROM userinfo AS ui JOIN usegun AS ug WHERE ui.id = ug.id AND ui.id='${accessToken.id}')`);
                    
                    if(dbresult === null){ // 총기 목록 불러오기 실패
                        result.result = '소유한 총기 목록을 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 총기 목록 불러오기 성공
                        var array = [];
                    
                        if(dbresult.length > 0) // 총기가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) array.push(dbresult[i]['gname']);
                        
                        result.result = array;
                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '소유한 총기 목록을 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    matchistory_f: async function(req, res){
        var result = {
            result: null,
            code: 200
        };
    
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "matchDate, result", 
                        "matchhistory", 
                        `id='${accessToken.id}'`);
                    
                    if(dbresult === null){ // 매칭 결과 목록 불러오기 실패
                        result.result = '매칭 결과 목록을 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 매칭 결과 목록 불러오기 성공
                        var array = [];
                    
                        if(dbresult.length > 0) // 매칭 결과가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) array.push([dbresult[i]['matchDate'], dbresult[i]['result']]);
                        
                        result.result = array;
                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '매칭 결과 목록을 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    cash_history_f: async (req, res)=>{
        var result = {
            result: {
                cashLog: null,
                availCashPage: null,
            },
            code: 200
        };
    
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "cluch.*", 
                        `${dotEnv.CASHHISTORY_UNION_CHARGELOG} as cluch`, 
                        `cluch.id='${accessToken.id}' ORDER BY cluch.chindex DESC LIMIT ${5*(req.query.page-1)}, ${(5*req.query.page)-1}`);
                    
                    if(dbresult === null){ // 충전 결과 목록 불러오기 실패
                        result.result = '충전 기록을 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 충전 결과 목록 불러오기 성공
                        var array = [];
                    
                        if(dbresult.length > 0){ // 충전 결과가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) {
                                var tempDBResult = Object.assign({}, dbresult[i]);

                                delete tempDBResult.id;
                                tempDBResult.type = 
                                    tempDBResult.type === '1w'? 
                                        '충전중': 
                                        tempDBResult.type === '1c'? 
                                            '충전취소': 
                                            tempDBResult.type === '1d'? 
                                                ['캐쉬 충전', '현금 결제'].indexOf(tempDBResult['order_name'])? 
                                                tempDBResult['order_name']: 
                                                '충전 성공'
                                            :'???'

                                array.push(tempDBResult);
                            }
                        }
                        
                        [dbresult, dbfield] = await DBReserved.dynamic_select(
                            "count(*)", 
                            dotEnv.CASH_HISTORY_TABLE, 
                            `id='${accessToken.id}'`);
                            
                        
                        result.result.cashLog = array;
                        result.result.availCashPage = (dbresult[0]['count(*)'] <= 5)? 1: parseInt(dbresult[0]['count(*)']/5)+1;

                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '충전 기록을 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    myboards_f: async function(req, res){
        var result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        const DEFAULT_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 10;

        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    var page = req.query.page;
                    var pageSize = req.query.pagesize;
                    var order = req.query.order;

                    if(req.query){
                        page = null;
                        pageSize = null;
                        order = null;
                        
                        if(!Number.isInteger(parseInt(page)) && !Number.isInteger(parseInt(pageSize))){
                            page = DEFAULT_PAGE;
                            pageSize = DEFAULT_PAGE_SIZE;
                        } else if(!Number.isInteger(parseInt(page)) || parseInt(page) < 1){
                            page = DEFAULT_PAGE;
                        } else if(!Number.isInteger(parseInt(pageSize)) || parseInt(pageSize) < 1){
                            pageSize = DEFAULT_PAGE_SIZE;
                        }
                    } else{
                        page = DEFAULT_PAGE;
                        pageSize = DEFAULT_PAGE_SIZE;
                        order = false;
                    }
                    page = page - 1;

                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        `b.*, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=b.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.BOARD_REC_TABLE} where bindex=b.index and recType='x') as unRecommendCount`, 
                        `${dotEnv.BOARD_TABLE} as b`, 
                        `b.uploadId='${accessToken.id}' ORDER BY b.index ${order? 'asc': 'desc'} LIMIT ${page*pageSize}, ${pageSize}`);
                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 정보 불러오기 성공
                        for(var i = 0; i < dbresult.length; i++){
                            dbresult[i].timeStamp = dbresult[i].timeStamp.getTime();
                            result.result.push(dbresult[i]);
                        }
                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    mycomments_f: async function(req, res){
        var result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        const DEFAULT_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 10;

        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{
                    var page = req.query.page;
                    var pageSize = req.query.pagesize;
                    var order = req.query.order;

                    if(req.query){
                        page = null;
                        pageSize = null;
                        order = null;
                        
                        if(!Number.isInteger(parseInt(page)) && !Number.isInteger(parseInt(pageSize))){
                            page = DEFAULT_PAGE;
                            pageSize = DEFAULT_PAGE_SIZE;
                        } else if(!Number.isInteger(parseInt(page)) || parseInt(page) < 1){
                            page = DEFAULT_PAGE;
                        } else if(!Number.isInteger(parseInt(pageSize)) || parseInt(pageSize) < 1){
                            pageSize = DEFAULT_PAGE_SIZE;
                        }
                    } else{
                        page = DEFAULT_PAGE;
                        pageSize = DEFAULT_PAGE_SIZE;
                        order = false;
                    }
                    page = page - 1;

                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        `c.*, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=c.index and recType='o') as recommendCount, (select count(*) from ${dotEnv.COMMENT_REC_TABLE} where cindex=c.index and recType='x') as unRecommendCount`, 
                        `${dotEnv.COMMENT_TABLE} as c`, 
                        `c.uploadId='${accessToken.id}' ORDER BY c.index ${order? 'asc': 'desc'} LIMIT ${page*pageSize}, ${pageSize}`);
                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 정보 불러오기 성공
                        for(var i = 0; i < dbresult.length; i++){
                            dbresult[i].timeStamp = dbresult[i].timeStamp.getTime();
                            result.result.push(dbresult[i]);
                        }
                        result.code = 200;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result = '정보를 불러오는 중 오류가 발생했습니다. (100)'
                    result.code = 500;
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    all_f: async function(req, res){
        var result = {
            result: {
                base: null,
                friend: null,
                mycar: null,
                mygun: null,
                matchistory: null
            },
            code: 200
        };
    
        let dbresult, dbfield;
        let accessToken = TokenManager.getToken(req);
    
        if(accessToken === null){
            result.result = '로그인이 필요한 서비스입니다.';
            result.code = 400;
        } else {
            accessToken = await TokenManager.verifyToken(accessToken, req);

            if(Number.isInteger(accessToken)){
                TokenManager.tokenVerifyValue(accessToken, result);
            } else{
                try{ // 유저정보 입력
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "*", 
                        `(select umg.*, lt.logoPath from ${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} as umg LEFT OUTER JOIN ${dotEnv.LOGO_TABLE} as lt ON umg.id=lt.id) as ui`, 
                        `ui.id='${accessToken.id}'`);
                    
                    if(dbresult === null){ // 정보 불러오기 실패
                        result.result = '정보를 불러오는데 실패했습니다.';
                        result.code = 500;
                    } else{ // 정보 불러오기 성공
                        //console.log(dbresult[0]);
                        result.result = {
                            id: dbresult[0].id,
                            pw: '',
                            logoPath: dbresult[0].logoPath,
                            name: dbresult[0].name,
                            email: dbresult[0].email, 
                            address: dbresult[0].address, 
                            phone: dbresult[0].phone, 
                            money: dbresult[0].money, 
                            cash: dbresult[0].cash, 
                            admin: dbresult[0].admin,
                            usecar: dbresult[0].usecar,
                            usegun: dbresult[0].usegun,
                            invitf: dbresult[0].invitf,
                            difficult: dbresult[0].difficult,
                            connect: dbresult[0].connect,
                        };
                    }
                }
                catch(error){
                    console.log(error);
                    result.result.base = "유저 정보를 불러오는중 오류가 발생했습니다.";
                }
    
                try{ // 친구정보 입력
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "*, (select logoPath from communityUserLogoPath where id=tempTable.id)", 
                        `${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} as tempTable`, 
                        `tempTable.id IN (SELECT fr.friend AS fid FROM ${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} AS ui JOIN friend AS fr WHERE ui.id=fr.id AND ui.id='${accessToken.id}')`);
                    
                    
                    if(dbresult === null){ // 친구 목록 불러오기 실패
                        result.result.friend = '친구 목록을 불러오는데 실패했습니다.';
                    } else{ // 친구 목록 불러오기 성공
                        var array = [];
    
                        if(dbresult.length > 0) // 친구가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) array.push([
                                dbresult[i].name, dbresult[i].connect, dbresult[i].logoPath, dbresult[i].id
                            ]);
                        
                        result.result.friend = array;
                    }
                }
                catch(error){
                    console.log(error);
                    result.result.friend = "친구 목록을 불러오는데 실패했습니다.";
                }
    
                try{ // 소유 자동차 정보 입력
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "cname", 
                        "carinfo", 
                        `cnum IN (SELECT uc.cnum AS ccnum FROM ${dotEnv.USERINFO_UNION_MOREINFO} AS ui JOIN usecar AS uc WHERE ui.id = uc.id AND ui.id='${accessToken.id}')`);
                    
                    if(dbresult === null){ // 자동차 목록 불러오기 실패
                        result.result.mycar = '소유한 자동차 목록을 불러오는데 실패했습니다.';
                    } else{ // 자동차 목록 불러오기 성공
                        var array = [];
                    
                        if(dbresult.length > 0) // 자동차가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) array.push(dbresult[i]['cname']);
                        
                        result.result.mycar = array;
                    }
                }
                catch(error){
                    result.result.mycar = '소유한 자동차 목록을 불러오는데 실패했습니다.';
                    console.log(error);
                }
    
                try{ // 소유 무기 정보 입력
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "gname", 
                        "guninfo", 
                        `gnum IN (SELECT ug.gnum AS ggnum FROM ${dotEnv.USERINFO_UNION_MOREINFO} AS ui JOIN usegun AS ug WHERE ui.id = ug.id AND ui.id='${accessToken.id}')`);
                    
                    if(dbresult === null){ // 총기 목록 불러오기 실패
                        result.result.mygun = '소유한 총기 목록을 불러오는데 실패했습니다.';
                    } else{ // 총기 목록 불러오기 성공
                        var array = [];
                    
                        if(dbresult.length > 0) // 총기가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) array.push(dbresult[i]['gname']);
                        
                        result.result.mygun = array;
                    }
                }
                catch(error){
                    result.result.mygun = '소유한 총기 목록을 불러오는데 실패했습니다.';
                    console.log(error);
                }
    
                try{ // 매칭 결과 정보 입력
                    [dbresult, dbfield] = await DBReserved.dynamic_select(
                        "matchDate, result", 
                        "matchhistory", 
                        `id='${accessToken.id}'`);
                    
                    if(dbresult === null){ // 총기 목록 불러오기 실패
                        result.result.matchistory = '매칭 결과 목록을 불러오는데 실패했습니다.';
                    } else{ // 총기 목록 불러오기 성공
                        var array = [];
                    
                        if(dbresult.length > 0) // 총기가 있으면 배열에 추가
                            for(var i = 0; i < dbresult.length; i++) array.push([dbresult[i]['matchDate'], dbresult[i]['result']]);
                        
                        result.result.matchistory = array;
                    }
                }
                catch(error){
                    result.result.matchistory = '매칭 결과 목록을 불러오는데 실패했습니다.';
                    console.log(error);
                }
            }
        }

        commonFunction.sendResult(res, result);
    },
    
};