const DBPool = require('../T/db');
const path = require('path');
const fs = require('fs');

const IDRegExp = /^[0-9A-Za-z]{3,15}$/; // 특수문자를 금지한 문자 3개이상
// const PWRegExp = /^[0-9A-Za-z]{7,}$/; // 특수문자를 금지한 문자 7개이상
const PWRegExp = /^.{6,15}$/; // 아무런 문자 6개 이상(해쉬함수를 적용시킬거라 의미 없음)
const EmailRegExp = /^([^\W]{3,})@([^\W]{3,})(\.[a-zA-Z]{2,})+$/; // (3글자이상)
const NameRegExp = /^[0-9a-zA-Z가-힣_]{3,12}$/; // (_를 포함한 3글자이상 12글자 이하)
const PhoneRegExp = /^(010){1}[0-9]{8}$/; // 휴대폰번호 12자
const Base64RegCheck = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/ // Base64 체크

// validProblemIsHere: (user)=>{

//     if(!IDRegExp.test(user.id) || user.id === undefined) return 1;
//     else if(!PWRegExp.test(user.pw) || user.pw === undefined) return 2;
//     else if(!EmailRegExp.test(user.email) || user.email === undefined) return 3;
//     else if(!NameRegExp.test(user.name) || user.name === undefined) return 4;
//     else if(!PhoneRegExp.test(user.phone) || user.phone === undefined) return 5;
//     else return 0;
// },

// pwRegCheck: (pw)=>{
//     return pw !== undefined && pw !== null && PWRegExp.test(pw);
// },

module.exports = {
    checkUserVaild: (user)=>{
        return IDRegExp.test(user.id? user.id: '') 
        && PWRegExp.test(user.pw? user.pw: '') 
        && EmailRegExp.test(user.email? user.email: '') 
        && NameRegExp.test(user.name? user.name: '') 
        && PhoneRegExp.test(user.phone? user.phone: '');
    },
    sendResult: (res, result)=>{
        res.status(result.code).send(result);
    },
    validProblemIsHere: (user)=>{

        if(!IDRegExp.test(user.id? user.id: '')) return 1;
        else if(!PWRegExp.test(user.pw? user.pw: '')) return 2;
        else if(!EmailRegExp.test(user.email? user.email: '')) return 3;
        else if(!NameRegExp.test(user.name? user.name: '')) return 4;
        else if(!PhoneRegExp.test(user.phone? user.phone: '')) return 5;
        else return 0;
    },
    isAcceptLogin: (user)=>{
        return IDRegExp.test(user.id? user.id: '') && PWRegExp.test(user.pw? user.pw: '');
    },
    idRegCheck: (id)=>{
        return IDRegExp.test(id? id: '');
    },
    pwRegCheck: (pw)=>{
        return PWRegExp.test(pw? pw: '');
    },
    emailRegCheck: (email)=>{
        return EmailRegExp.test(email? email: '');
    },
    nameRegCheck: (name)=>{
        return NameRegExp.test(name? name: '');
    },
    phoneRegCheck: (phone)=>{
        return PhoneRegExp.test(phone? phone: '');
    },
    base64RegCheck: (base64String)=>{
        return Base64RegCheck.test(base64String? base64String: '!!!!!');
    },
    updateSession: async function(req, res){
        let result = 0;
        let dbresult, dbfield;
    
        if(!req.session.user){
            result = 1;
        } else {
            try{
                [dbresult, dbfield] = await DBPool.query('SELECT * FROM userinfo WHERE id=? ORDER BY id DESC LIMIT 1', req.session.user.id);

                req.session.user.id = dbresult[0]['id'];
                req.session.user.pw = dbresult[0]['pw'];
                req.session.user.email = dbresult[0]['email'];
                req.session.user.name = dbresult[0]['name'];
                req.session.user.address = dbresult[0]['address'];
                req.session.user.phone = dbresult[0]['phone'];
                req.session.user.money = dbresult[0]['money'];
                req.session.user.cash = dbresult[0]['cash'];
                req.session.user.admin = dbresult[0]['admin'];

                req.session.save((err)=>{
                    if(err) console.log(err);
                });
            }
            catch(error){
                console.log(error);
                result = 2;
            }
        }
    
        return result;
    },
    /**
     * 
     * @param {*} req 
     * @returns true if req.session.user is null
     */
    sessionCheck: (req)=>{
        return req.session.user === null || req.session.user === undefined;
    },
    changeBase64FromString:(string)=>{
        //console.log(Buffer.from(string, 'utf8').toString("base64"));
        return Buffer.from(string, 'utf8').toString("base64");
    },
    changeStringFromBase64:(string)=>{
        return Buffer.from(string, 'base64').toString("utf8");
    },
    /**
     * @param {String} filePath
    */
    deleteFile: (filePath, dirPath)=>{
        if(!filePath) return;
        else if(filePath.indexOf('/logos/none.png') !== -1){
            return;
        }
        
        let pathArray = filePath.split('c3BhY2VcdA==');

        for(var i = 0; i < pathArray.length; i++){
            var tempPath = path.join(dirPath, pathArray[i]);

            if(path.extname(tempPath).trim().length === 0){
                continue;
            } else{
                fs.unlink(tempPath, (err)=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    },
};