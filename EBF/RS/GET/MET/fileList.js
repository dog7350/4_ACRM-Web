const DBReserved = require('../../../T/dbReserved');
const commonFunction = require('../../common');
const TokenManager = require('../../../T/tokenManager');
const dotEnv = require('../../../CP/envHell');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../../..', 'public/files');
const gamePath = path.join(filePath, 'games');
const severPath = path.join(filePath, 'servers');
const mobilePath = path.join(filePath, 'mobiles');
const fileRegExp = /^[0-9a-zA-Z가-힣_-\s\.\(\)]{5,}$/;

module.exports = {
    get_all_list_f: async (req, res)=>{
        var result = {
            result: {
                games: [],
                servers: [],
                mobiles: [],
            },
            code: 200
        };


        try{
            if(fs.existsSync(gamePath)){
                result.result.games = fs.readdirSync(gamePath).map((value, index)=>{
                    return {
                        fileName: value,
                        mtime: fs.lstatSync(path.join(gamePath, value)).mtime
                    };
                }).sort((a, b)=>{
                    if(a.mtime <= b.mtime){
                        return -1;
                    } else{
                        return 1;
                    }
                });
            }

            if(fs.existsSync(severPath)){
                result.result.servers = fs.readdirSync(severPath).map((value, index)=>{
                    return {
                        fileName: value,
                        mtime: fs.lstatSync(path.join(severPath, value)).mtime
                    };
                }).sort((a, b)=>{
                    if(a.mtime <= b.mtime){
                        return -1;
                    } else{
                        return 1;
                    }
                });
            }

            if(fs.existsSync(mobilePath)){
                result.result.mobiles = fs.readdirSync(mobilePath).map((value, index)=>{
                    return {
                        fileName: value,
                        mtime: fs.lstatSync(path.join(mobilePath, value)).mtime
                    };
                }).sort((a, b)=>{
                    if(a.mtime <= b.mtime){
                        return -1;
                    } else if(a.mtime > b.mtime){
                        return 1;
                    }
                });
            }
        }
        catch(error){
            console.log(error);
            result.result = '파일 확인중 문제가 발생했습니다.';
            result.code = 500;
        }

        commonFunction.sendResult(res, result);
    },
    get_game_f: async (req, res)=>{
        var result = {
            result: {
                
            },
            code: 200
        };


        try{      
            if(req.query && req.query.name){
                var name = decodeURI(req.query.name);
                if(fileRegExp.test(name)){
                    if(fs.existsSync(path.join(gamePath, name))){
                        if(fs.lstatSync(path.join(gamePath, name)).isFile()){
                            result.result = path.join(gamePath, name);
                        } else{
                            result.result = '파일이 아닙니다.'
                            result.code = 400;
                        }
                    } else{
                        result.result = '존재하지 않는 파일입니다.'
                        result.code = 400;
                    }
                } else{
                    result.result = '파일이름을 확인해주세요.'
                    result.code = 400; 
                }
            } else{
                result.result = '파일이름을 확인해주세요.'
                result.code = 400;    
            }
        }
        catch(error){
            console.log(error);
            result.result = '게임 다운로드 중 문제가 발생했습니다.';
            result.code = 500;
        }

        if(result.code === 400){
            commonFunction.sendResult(res, result);
        } else{
            res.download(result.result);
        }
    },
    get_server_f: async (req, res)=>{
        var result = {
            result: {
                
            },
            code: 200
        };


        try{
            if(req.query && req.query.name){
                var name = decodeURI(req.query.name);
                if(fileRegExp.test(name)){
                    if(fs.existsSync(path.join(severPath, req.query.name))){
                        if(fs.lstatSync(path.join(severPath, req.query.name)).isFile()){
                            result.result = fs.readFileSync(path.join(severPath, req.query.name));
                        } else{
                            result.result = '파일이 아닙니다.'
                            result.code = 400;
                        }
                    } else{
                        result.result = '존재하지 않는 파일입니다.'
                        result.code = 400;
                    }
                } else{
                    result.result = '파일이름을 확인해주세요.'
                    result.code = 400; 
                }
            } else{
                result.result = '파일이름을 확인해주세요.'
                result.code = 400;    
            }
        }
        catch(error){
            console.log(error);
            result.result = '서버파일 다운로드 중 문제가 발생했습니다.';
            result.code = 500;
        }

        if(result.code === 400){
            commonFunction.sendResult(res, result);
        } else{
            res.download(result.result);
        }
    },
    get_mobile_f: async (req, res)=>{
        var result = {
            result: {
                
            },
            code: 200
        };


        try{
            if(req.query && req.query.name){
                var name = decodeURI(req.query.name);
                if(fileRegExp.test(name)){
                    if(fs.existsSync(path.join(mobilePath, req.query.name))){
                        if(fs.lstatSync(path.join(mobilePath, req.query.name)).isFile()){
                            result.result = fs.readFileSync(path.join(mobilePath, req.query.name));
                        } else{
                            result.result = '파일이 아닙니다.'
                            result.code = 400;
                        }
                    } else{
                        result.result = '존재하지 않는 파일입니다.'
                        result.code = 400;
                    }
                } else{
                    result.result = '파일이름을 확인해주세요.'
                    result.code = 400; 
                }
            } else{
                result.result = '파일이름을 확인해주세요.'
                result.code = 400;    
            }
        }
        catch(error){
            console.log(error);
            result.result = '게임파일 다운로드 중 문제가 발생했습니다.';
            result.code = 500;
        }

        if(result.code === 400){
            commonFunction.sendResult(res, result);
        } else{
            res.download(result.result);
        }
    },
};