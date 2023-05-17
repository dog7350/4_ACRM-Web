const dotEnv = require('dotenv');
const mysql = require('mysql2/promise');
const dbReserved = require('./../EBF/T/dbReserved');
const DBReserved = require('./../EBF/T/dbReserved');

dotEnv.config({path: require('path').join(__dirname, '..', '.env')});

let connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};



const dbTest = async function(){
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await dbReserved.dynamicRInsert('communityBoards', '(uploadId, title, content, hideLevel, TYPE)', `'akdltls', 'testest3-0-0-5(T)', 'testest3-0-0-5(C)', 1, 1`);

        
        console.log(dbresult);

        if(dbresult !== null && dbresult.length !== 0){
            [dbresult, dbfield] = await dbReserved.dynamic_select('uploadId', 'communityBoards', `communityBoards.index=${dbresult.insertId}`);
        }
    } catch (error) {
        console.log(error);
    }
    console.log(dbresult);
    // return [dbresult, dbfield];
};

dbTest();

