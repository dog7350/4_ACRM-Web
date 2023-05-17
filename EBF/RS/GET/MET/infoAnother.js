const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');

module.exports = {
    guninfo_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;

        try{
            [dbresult, dbfield] = await DBReserved.dynamic_select(
                "*", 
                "guninfo", 
                `1`);
            
            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '무기정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else{ // 정보 불러오기 성공
                for(var i = 0; i < dbresult.length; i++){
                    result.result.push(
                        {
                            index: dbresult[i].gnum,
                            name: dbresult[i].gname,
                            content: dbresult[i].content,
                            atk: dbresult[i].atk, 
                            rpm: dbresult[i].rpm,
                            ammo: dbresult[i].ammo,
                            price: dbresult[i].price,
                            cash: dbresult[i].cash,
                        }
                    );
                }
                result.code = 200;
            }
        }
        catch(error){
            console.log(error);
            result.result = '무기정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    carinfo_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;

        try{
            [dbresult, dbfield] = await DBReserved.dynamic_select(
                "*", 
                "carinfo", 
                `1`);
            
            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '자동차정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else{ // 정보 불러오기 성공
                for(var i = 0; i < dbresult.length; i++){
                    result.result.push(
                        {
                            index: dbresult[i].cnum,
                            name: dbresult[i].cname,
                            content: dbresult[i].content,
                            speed: dbresult[i].speed, 
                            hp: dbresult[i].hp,
                            def: dbresult[i].def,
                            price: dbresult[i].price,
                            cash: dbresult[i].cash
                        }
                    );
                }
                result.code = 200;
            }
        }
        catch(error){
            console.log(error);
            result.result = '자동차정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    trackinfo_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;

        try{
            [dbresult, dbfield] = await DBReserved.dynamic_select(
                "*", 
                "track", 
                `1`);
            
            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '트랙정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else{ // 정보 불러오기 성공
                for(var i = 0; i < dbresult.length; i++){
                    result.result.push(
                        {
                            index: dbresult[i].tnum,
                            name: dbresult[i].tname,
                            content: dbresult[i].content
                        }
                    );
                }
                result.code = 200;
            }
        }
        catch(error){
            console.log(error);
            result.result = '트랙정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    iteminfo_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };
        let dbresult, dbfield;

        try{
            [dbresult, dbfield] = await DBReserved.dynamic_select(
                "*", 
                "item", 
                `1`);
            
            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '아이템정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else{ // 정보 불러오기 성공
                for(var i = 0; i < dbresult.length; i++){
                    result.result.push(
                        {
                            index: dbresult[i].inum,
                            name: dbresult[i].iname,
                            content: dbresult[i].content
                        }
                    );
                }
                result.code = 200;
            }
        }
        catch(error){
            console.log(error);
            result.result = '아이템정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    user_profile_f: async (req, res)=>{
        var result = {
            result: null,
            code: 200
        };

        let dbresult, dbfield;

        try{
            [dbresult, dbfield] = await DBReserved.dynamic_select(
                "*", 
                dotEnv.BAN_TABLE, 
                `id='${commonFunction.idRegCheck(req.query.id)? req.query.id: '1'}'`);

            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '유저정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else if(dbresult.length > 0 && ['p'].indexOf(dbresult[0].ban_type) !== -1){
                result.result = '정지된 유저입니다.';
                result.code = 400;
            } else{
                [dbresult, dbfield] = await DBReserved.dynamic_select( 
                    `*, (select count(*) from ${dotEnv.BOARD_TABLE} where uploadId=re.id) as writeBoardCount, (select count(*) from ${dotEnv.COMMENT_TABLE} where uploadId=re.id) as writeCommentCount, (select count(*) from ${dotEnv.FOLLOW_TABLE} where follow=re.id) as follower`, 
                    `(select ui.*, lt.logoPath from ${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} as ui left outer join ${dotEnv.LOGO_TABLE} as lt on ui.id=lt.id) as re`, 
                    `re.id='${commonFunction.idRegCheck(req.query.id)? req.query.id: ''}'`);
                
                if(dbresult === null){ // 정보 불러오기 실패
                    result.result = '유저정보를 불러오는데 실패했습니다.';
                    result.code = 500;
                } else if(dbresult.length === 0){
                    result.result = '유저가 존재하지 않습니다.';
                    result.code = 500;
                } else{ // 정보 불러오기 성공
                    result.result = {
                        id: dbresult[0].id,
                        name: dbresult[0].name,
                        logoPath: dbresult[0].logoPath,
                        boardCount: dbresult[0].writeBoardCount,
                        commentCount: dbresult[0].writeCommentCount,
                        follower: dbresult[0].follower,
                        // email: dbresult[0].email, 
                        // address: dbresult[0].address, 
                        // phone: dbresult[0].phone, 
                        // money: dbresult[0].money, 
                        // cash: dbresult[0].cash, 
                        // admin: dbresult[0].admin
                    };
                    result.code = 200;
                } 
            }
        }
        catch(error){
            console.log(error);
            result.result = '유저정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    user_match_history_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };

        let dbresult, dbfield;

        var page = req.query.page || 1;
        page = page - 1;

        try{
            [dbresult, dbfield] = await DBReserved.dynamic_select(
                "*", 
                dotEnv.BAN_TABLE, 
                `id='${commonFunction.idRegCheck(req.query.id)? req.query.id: '1'}'`);

            if(dbresult === null){ // 정보 불러오기 실패
                result.result = '유저정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else if(dbresult.length > 0 && ['p'].indexOf(dbresult[0].ban_type) !== -1){
                result.result = '정지된 유저입니다.';
                result.code = 400;
            } else{
                [dbresult, dbfield] = await DBReserved.dynamic_select( 
                    `*, (select cnum from carinfo where cname=re.resultcar) as resultcarnum, (select gnum from guninfo where gname=re.resultgun) as resultgunnum, (select logopath from ${dotEnv.LOGO_TABLE} where id=re.id) as logoPath`, 
                    `(select ui.*, mh.matchDate, mh.result, mh.resultcar, mh.resultgun from ${dotEnv.USERINFO_UNION_MOREINFO_GAMEINFO} as ui right outer join matchhistory as mh on ui.id=mh.id) as re`, 
                    `re.id='${commonFunction.idRegCheck(req.query.id)? req.query.id: ''}' ORDER BY re.matchDate desc LIMIT ${page*10}, 10`);
                
                if(dbresult === null){ // 정보 불러오기 실패
                    result.result = '유저정보를 불러오는데 실패했습니다.';
                    result.code = 500;
                } else{ // 정보 불러오기 성공
                    for(var i in dbresult){
                        result.result.push({
                            id: dbresult[i].id,
                            name: dbresult[i].name,
                            matchDate: dbresult[i].matchDate,
                            result: dbresult[i].result,
                            resultcar: dbresult[i].resultcar,
                            resultcarnum: dbresult[i].resultcarnum,
                            resultgun: dbresult[i].resultgun,
                            resultgunnum: dbresult[i].resultgunnum,
                            logoPath: dbresult[i].logoPath,
                        });
                    }

                    result.code = 200;
                }
            }
        }
        catch(error){
            console.log(error);
            result.result = '유저정보를 불러오는 중 오류가 발생했습니다. (100)'
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    goods_info_f: async (req, res)=>{
        var result = {
            result: [],
            code: 200
        };

        let dbresult, dbfield;
        var PA1 = '*', PA2 = dotEnv.GOODS_TABLE, PA3;

        var goodsNumber = req.query.number || -1;
        var page = req.query.page || 1, goodsName = req.query.name || '.*', uploader = req.query.uploader || '.*';
        
        page = page - 1;

        if(goodsNumber === -1){
            PA3 = `REGEXP_INSTR('uploader', '${uploader}') OR REGEXP_INSTR('goodsName', '${goodsName}') ORDER BY goodsNumber desc LIMIT ${7*page}, ${(7*(page+1))-1}`;
        } else{
            PA3 = `goodsNumber=${goodsNumber}`;
        }

        

        try{
            [dbresult, dbfield] = await DBReserved.dynamic_select(PA1, PA2, PA3);

            if(dbresult === null){ // 굿즈 정보 불러오기
                result.result = '굿즈정보를 불러오는데 실패했습니다.';
                result.code = 500;
            } else{
                for(var goods in dbresult){
                    result.result.push(goods);
                }
            }
        }
        catch(error){
            console.log(error);
            result.result = '굿즈정보를 불러오는 중 문제가 발생했습니다. (100)'
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
};