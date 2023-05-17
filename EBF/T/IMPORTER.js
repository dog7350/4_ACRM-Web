const dotEnv = require('../CP/envHell');
const { default: axios } = require("axios");

const tempHeaders = {
    "Content-Type": "application/json"
};

const tempDatas = {
    imp_key: dotEnv.RESTAPI,
    imp_secret: dotEnv.RESTAPIKEYS,
};

const getTokenF = async ()=>{
    var getToken = null;

    try{
        getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post",
            headers: tempHeaders,
            data: tempDatas,
        });
    }
    catch(error){
        
        e.log(error);
    }
    
    if(getToken.status > 399){
        getToken = null;
    }

    if(getToken)
        return getToken.data.response.access_token;
    else
        return getToken;
};

module.exports = {
    /**
     * @returns 실패시 null 반환
    */
    getImportToken: async ()=>{
        return await getTokenF();
    },

    /**
     * @param {String} imp_uid 주문번호
     * @param {String} merchant_uid 가맹점번호
     * @returns 예외 발생시 null 반환, 성공시 response.data 반환, 401 유효하지 않은 인증토큰
    */
    cancleOrder: async (imp_uid, merchant_uid)=>{
        var importResponse = null;

        if(imp_uid && merchant_uid){
            try{
                var getToken = await getTokenF();
    
                var importResponse = await axios({
                    url: `https://api.iamport.kr/payments/cancel`,
                    method: "post",
                    headers: {"Authorization": getToken},
                    data: {
                        imp_uid: imp_uid,
                        merchant_uid: merchant_uid,
                    },
                });
            }
            catch(error){
                console.log(error);
                importResponse = null;
            }
        }
        
        if(importResponse) 
            if(importResponse.status === 401) return 401;
            else return importResponse.data;
        else return null;
    },
    
    /**
     * @param {String} imp_uid 주문번호
     * @returns 예외 발생시 null 반환, 성공시 response.data 반환, 401 유효하지 않은 인증토큰, 404 유효하지 않은 주문번호
    */
    orderCheck: async (imp_uid)=>{
        var importResponse = null;

        if(imp_uid){
            try{
                var getToken = await getTokenF();
    
                var importResponse = await axios({
                    url: `https://api.iamport.kr/payments/${imp_uid}`,
                    method: "get",
                    headers: {"Authorization": getToken},
                });
            }
            catch(error){
                console.log(error);
            }
        }
        
        if(importResponse) 
            if(importResponse.status === 401) return 401;
            else if(importResponse.status === 404) return 404;
            else return importResponse.data;
        else return null;
    },
};