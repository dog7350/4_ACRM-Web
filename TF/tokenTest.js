const TokenManager = require('../EBF/T/tokenManager');

let user = {
    id: 'akdltls',
    pw: '306210',
    auth: 'o'
};

console.log(user);

let cipherJson = TokenManager.makeToken(user);

console.log(cipherJson);

let plainJson = TokenManager.verifyToken(cipherJson, req);

console.log(plainJson);

console.log(Date.now())