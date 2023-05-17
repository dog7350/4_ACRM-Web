const hash = require('../EBF/T/hash');

var array = [
    'hj306210',
    '306210',
    'akdltls',
    'helloworld',
    'kelog'
];

console.log(process.env.SECRET_KEY);

array.forEach((value, idx, origin)=>{
    console.log(`\n${value} ---sha256---> ${hash.makeHash(value)}`);
})