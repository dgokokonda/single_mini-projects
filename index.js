'use strict'
//example on commonJS

let Server = require('./server.js');
let Network = require('./network.js');
let User = require('./user.js');


const N1 = new Network('Network1');
const S1 = new Server('S1');

const User1 = new User('A');
const User2 = new User('B');
const User3 = new User('C');
const User4 = new User('D');
const User5 = new User('E');
User1.register('A', N1);
User4.register('D', N1);
S1.createServer(N1);
console.log(N1.dataBase)
User1.logout('A', N1);
User2.register('B', N1);
console.log(N1.dataBase)
User3.register('C', N1);
console.log(N1.dataBase)
User2.logout('B', N1);
S1.changeAddress(N1);
console.log(N1.dataBase)
User5.register('E', N1);
console.log(N1.dataBase)
// S1.disconnectServer(N1);
// console.log(N1.dataBase)