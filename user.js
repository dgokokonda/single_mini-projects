'use strict'
class User {
    constructor(name = 'Гость') {
        this.name = name;
    }
    register(name, network) {
        this.ip = network.register(name);
        this.address = '192.168.0.' + this.ip;
        console.log('Добро пожаловать на сервер ' + this.address + ', юзер ' + name);

    }
    logout(name, network) { //logout by ip
        network.clearAddress(name, this.ip);
        console.log('User ' + name + ' is logout');
    }
}

module.exports = User;