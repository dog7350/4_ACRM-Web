const dotEnv = require('dotenv');
dotEnv.config({path: require('path').join(__dirname, '..', '..', '.env')});
module.exports = process.env;