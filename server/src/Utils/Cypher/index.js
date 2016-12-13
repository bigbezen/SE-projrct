var crypto = require('crypto');

var algorithm = 'aes-256-ctr';
var key = 'd6F3Efee';

var encrypt = function(text) {
    var cipher = crypto.createCipher(algorithm, key);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

var decrypt = function(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;