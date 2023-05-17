const DBPool = require('./db');
const commonFunction = require('../RS/common');

const dynamicSelect = 'SELECT PA1 FROM PA2 WHERE PA3;';
const dynamicInsert = 'INSERT INTO PA1PA2 VALUES(PA3)';
const dynamicDelete = 'DELETE FROM PA1 WHERE PA2;';
const dynamicUpdate = 'UPDATE PA1 SET PA2 WHERE PA3;'

const selectAllTableById = 'SELECT * FROM userinfo WHERE id=?;';
const insertUserInfoInstance = 'INSERT INTO userinfo(id, pw) VALUES(?, ?);';
const insertMoreInfoIntance1 = 'INSERT INTO moreinfo VALUES(?, ?, ?, ?, ?);';
const insertMoreInfoIntance2 = 'INSERT INTO gameinfo(id) VALUES(?);';


module.exports = {
    select_userinfo_by_id: async function(id){
        let dbresult = null, dbfield = null;

        try{
            [dbresult, dbfield] = await DBPool.query(selectAllTableById, id);
        }
        catch(error){ // db 조회중 오류발생
            console.log(error);
            dbresult = null;
            dbfield = null;
        }

        return [dbresult, dbfield];
    },
    insert_userinfo_instance: async function(info){
        let dbresult = null, dbfield = null;

        try{
            [dbresult, dbfield] = await DBPool.query(insertUserInfoInstance, [info.id, info.pw]);
            var address = info.address? info.address: '';
            // address = commonFunction.changeBase64FromString(address);

            dbresult = 1;
            [dbresult, dbfield] = await DBPool.query(insertMoreInfoIntance1, [info.id, info.name? info.name: '', info.email? info.email: '', address, info.phone? info.phone: '']);
            dbresult = 2;
            [dbresult, dbfield] = await DBPool.query(insertMoreInfoIntance2, [info.id]);
            dbresult = 3;
        }
        catch(error){ // db 삽입중 오류발생
            console.log(error);

            if(dbresult === 1){
                try{
                    [dbresult, dbfield] = await DBPool.query(insertMoreInfoIntance1, [info.id, info.name, info.email, '', '']);
                    dbresult = 2;
                }
                catch(error){
                    console.log(error);
                    dbresult = null;
                    dbfield = null;
                }
                
            } 

            if(dbresult === 2){
                try{
                    [dbresult, dbfield] = await DBPool.query(insertMoreInfoIntance2, [info.id]);
                    dbresult = 3;
                }
                catch(error){
                    console.log(error);
                    dbresult = null;
                    dbfield = null;
                }
                
            } 
        }

        return [dbresult, dbfield];
    },

    /**
     * SELECT PA1 FROM PA2 WHERE PA3;
     * @param {*} pa1 
     * @param {*} pa2 
     * @param {*} pa3 
     * @returns null is fail
     */
    dynamic_select: async function(pa1, pa2, pa3){
        let dbresult = null, dbfield = 1;
        let queryString = dynamicSelect.replace('PA1', pa1).replace('PA2', pa2).replace('PA3', pa3);

        try{
            [dbresult, dbfield] = await DBPool.query(queryString);
            
        }
        catch(error){ // db 삽입중 오류발생
            console.log(error);
            dbresult = null;
            dbfield = 0;
        }

        return [dbresult, dbfield];
    },
    /**
     * INSERT INTO PA1PA2 VALUES(PA3)
     * @param {*} pa1 
     * @param {*} pa2 
     * @param {*} pa3 
     * @returns null is fail
     */
    dynamic_insert: async function(pa1, pa2, pa3){
        let dbresult = null, dbfield = null;
        let queryString = dynamicInsert.replace('PA1', pa1).replace('PA2', pa2).replace('PA3', pa3);

        try{
            [dbresult, dbfield] = await DBPool.query(queryString);
            dbresult = dbresult.affectedRows;
        }
        catch(error){ // db 삽입중 오류발생
            console.log(error);
            dbresult = null;
            dbfield = null;
        }

        return [dbresult, dbfield];
    },
    /**
     * DELETE FROM PA1 WHERE PA2;
     * @param {*} pa1 
     * @param {*} pa2 
     * @returns null is fail
     */
     dynamic_delete: async function(pa1, pa2){
        let dbresult = null, dbfield = null;
        let queryString = dynamicDelete.replace('PA1', pa1).replace('PA2', pa2);

        try{
            [dbresult, dbfield] = await DBPool.query(queryString);
            dbresult = dbresult.affectedRows;
        }
        catch(error){ // db 삽입중 오류발생
            console.log(error);
            dbresult = null;
            dbfield = null;
        }

        return [dbresult, dbfield];
    },
    /**
     * UPDATE PA1 SET PA2 WHERE PA3;
     * @param {*} pa1 
     * @param {*} pa2
     * @param {*} pa3 
     * @returns null is fail
     */
     dynamic_update: async function(pa1, pa2, pa3){
        let dbresult = null, dbfield = null;
        let queryString = dynamicUpdate.replace('PA1', pa1).replace('PA2', pa2).replace('PA3', pa3);

        try{
            [dbresult, dbfield] = await DBPool.query(queryString);
            dbresult = dbresult.affectedRows;
        }
        catch(error){ // db 삽입중 오류발생
            console.log(error);
            dbresult = null;
            dbfield = null;
        }

        return [dbresult, dbfield];
    },
    dynamicRInsert: async (pa1, pa2, pa3)=>{
        let dbresult = null, dbfield = null;
        let queryString = dynamicInsert.replace('PA1', pa1).replace('PA2', pa2).replace('PA3', pa3);

        try{
            [dbresult, dbfield] = await DBPool.query(queryString);
            dbresult = dbresult;
        }
        catch(error){ // db 삽입중 오류발생
            console.log(error);
            dbresult = null;
            dbfield = null;
        }

        return [dbresult, dbfield];
    },
};