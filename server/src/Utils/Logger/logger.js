var winston     = require('winston');
var mongoDB     = require('winston-mongodb').MongoDB;



var logger = new (winston.Logger)({
    transports: [
        // new winston.transports.Console({formatter: this._loggingFormatter, level: 'debug'}),
        new(winston.transports.MongoDB)({
            db : 'mongodb://localhost:27017/IBBLS',
            collection: 'logs'
        })
    ]
});

module.exports = logger;