class Server {
    constructor() {
        this.type = 'server';
        //this.type = type; //'public' || 'protected'
    }
    createServer(network) {
        this.ip = network.register('server', 'server');
    }

    changeAddress(network) { // текущий и жедаемый адрес
        let newIP = Math.floor(Math.random() * (15 - 1) + 1);
        console.log('Сервер запрашивает адрес: 192.168.0.' + newIP)
        this.ip = network.register('server', 'server', newIP, this.ip);
    }

    disconnectServer(network) {
        network.clearAddress('server');
        console.log('Сервер временно недоступен');
    }
    // static createPublicServer() {
    //     return new Server();
    // }
}

module.exports = Server;