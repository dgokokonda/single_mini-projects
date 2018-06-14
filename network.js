'use strict'
class Network {
    constructor(name) {
        this.dataBase = [];
        this.name = name;
        this.address = '192.168.0.' + this.ip;
    }

    register(name, type = 'client', ip, oldIp, dataBase) {
        let status = 'success';
        (type === 'client' || !ip) ? this.ip = 1: this.ip;

        if (this.dataBase.length !== 0) {
            const checkIP = () => {
                this.dataBase.forEach(i => {
                    if (this.ip > 999) {
                        this.ip = 1;
                    }
                    if (i.ip === this.ip && !ip) {
                        this.ip++;
                        return checkIP.call(this);
                    }
                    if (i.ip === ip) {
                        status = 'not available';
                        return;
                    }
                });

            }
            checkIP.call(this);
        }
        if (status === 'success') {
            if (ip) {
                this.clearAddress('server', oldIp);
                this.ip = ip;
            }

            let userData = {
                name,
                ip: this.ip,
                type: type
            };

            this.dataBase.push(userData);
            if (type === 'server') {
                console.log('Сервер подключен по адресу: 192.168.0.' + this.ip);
                return this.ip;
            } else return this.ip;
        } else {
            console.log('Адрес уже занят, попробуйте другой.');
            return this.ip;
        }

    }
    clearAddress(name, ip) { // проверка на наличие имени (не гость)
        for (let i in this.dataBase) {
            if (this.dataBase[i].name === name &&
                this.dataBase[i].ip === ip) {
                this.dataBase.splice(i, 1);
                break;
            }
        }
    }
}

module.exports = Network;