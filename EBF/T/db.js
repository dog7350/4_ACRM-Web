const dotEnv = require('../CP/envHell');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: dotEnv.DB_HOST,
    user: dotEnv.DB_USER,
    password: dotEnv.DB_PW,
    database: dotEnv.DB_NAME,
    port: dotEnv.DB_PORT
});

module.exports = pool;