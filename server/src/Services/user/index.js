var logger          = require('./src/Utils/Logger/logger');

var login = function(user){
    console.log('login');
    return 'hello ' + user.username;
};

module.exports.login = login;