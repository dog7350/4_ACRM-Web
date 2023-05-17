const regExp = /^([a-zA-Z0-9]){1}[a-zA-Z0-9\._]{6,}([a-zA-Z0-9]){1}&/;

const IDRegExp = /^[0-9A-Za-z]{3,}$/

console.log(IDRegExp.test(undefined));
console.log(undefined === 'undefined');
console.log(undefined == 'undefined');