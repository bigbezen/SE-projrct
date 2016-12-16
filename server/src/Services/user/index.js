var logger          = require('../../Utils/Logger/logger');
var cypher          = require('../../Utils/Cypher/index');
var dal             = require('../../DAL/dal');

var userModel       = require('../../Models/user');

var hashGenerator   = require('hash-generator');


var login = async function(username, password){

    var user = await dal.getUserByUsername(username);
    if(user != null && cypher.decrypt(user.password) == password){
        var newSessionId = await _generateSessionId();
        user.sessionId = newSessionId;
        user.save();
        return {'sessionId': newSessionId, 'userType': user.jobDetails.userType};
    }
    else{
        return {'sessionId': null, 'err': 'error while logging in'};
    }
};

var addUser = function() {
    var newUser = new userModel();
    newUser.username = 'user';
    newUser.password =  cypher.encrypt("matan");
    newUser.jobDetails.userType = 'manager';
    dal.addUser(newUser);
};

var _generateSessionId = async function() {
    var isDuplicateSessionId = true;
    var sessionId, isIdInUse;
    while(isDuplicateSessionId){
        sessionId = hashGenerator(128);
        isIdInUse = await dal.getUserBySessionId(sessionId);
        if(isIdInUse == null){
            isDuplicateSessionId = false;
        }
    }
    return sessionId;
};


module.exports.login = login;
module.exports.addUser = addUser;