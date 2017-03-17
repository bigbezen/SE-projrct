var winston     = require('winston');
var mongoDB     = require('winston-mongodb').MongoDB;

let mongourl = 'mongodb://shahafstein:ibbls!234@ibbls-shard-00-00-9au6a.mongodb.net:27017,ibbls-shard-00-01-9au6a.mongodb.net:27017,ibbls-shard-00-02-9au6a.mongodb.net:27017/ibbls?ssl=true&replicaSet=ibbls-shard-0&authSource=admin';
let localhost = 'mongodb://localhost:27017/IBBLS';

var logger = new (winston.Logger)({
    transports: [
        // new winston.transports.Console({formatter: this._loggingFormatter, level: 'debug'}),
        new(winston.transports.MongoDB)({
            db : localhost,
            collection: 'logs'
        })
    ]
});

module.exports = logger;