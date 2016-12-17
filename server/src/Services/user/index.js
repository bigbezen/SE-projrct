var logger          = require('../../Utils/Logger/logger');
var mailer          = require('../../Utils/Mailer/index');
var cypher          = require('../../Utils/Cypher/index');
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');

var userModel       = require('../../Models/user');

var hashGenerator   = require('hash-generator');


var login = async function(username, password){
    logger.info('Services.user.index.login', {'username': username});
    var user = await dal.getUserByUsername(username);

    if(user != null && cypher.decrypt(user.password) == password){
        var newSessionId = await _generateSessionId();
        user.sessionId = newSessionId;
        var res = await dal.editUser(user);
        if(res != null)
            return {'sessionId': newSessionId, 'userType': user.jobDetails.userType};
        else
            return {'code': '500', 'err': 'something went wrong'};
    }
    else{
        return {'sessionId': null, 'err': 'error while logging in'};
    }
};

var logout = async function(sessionId) {
    logger.info('Services.user.index.logout', {'session-id': sessionId});
    var user = await dal.getUserBySessionId(sessionId);
    if(user == null){
        return {'code': 403, 'err': 'unauthorized request'};
    }

    user.sessionId = "";
    var res = await dal.editUser(user);
    if(res != null)
        return {'code': 200};
    else
        return {'code': 500, 'err': 'something went wrong'};
};

var addUser = async function(sessionId, userDetails) {
    //TODO: add permissions check
    logger.info('Services.user.index.addUser', {'session-id': sessionId});

    var isExistUsername = await dal.getUserByUsername(userDetails.username);
    var isExistId = await dal.getUserById(userDetails.personal.id);
    if(isExistUsername != null || isExistId != null){
        return {'code': 409, 'err': 'Username or Id already exists'}
    }

    var newUser = new userModel();
    newUser.username = userDetails.username;
    newUser.password =  cypher.encrypt(userDetails.password);
    newUser.startDate = new Date(userDetails.startDate);
    newUser.endDate = userDetails.endDate;
    newUser.personal = userDetails.personal;
    newUser.contact = userDetails.contact;
    newUser.jobDetails = userDetails.jobDetails;
    newUser.inbox = [];
    var res = await dal.addUser(newUser);
    newUser.password = "";
    if(res != null){
        return {'code': 200, 'user': newUser};
    }
    else{
        return {'code': 500, 'err': 'could not insert user to database'};
    }
};


var changePassword = async function(sessionId, oldPass, newPass) {
    logger.info('Services.user.index.changePassword', {'session-id': sessionId});

    var user = await dal.getUserBySessionId(sessionId);
    if(user == null){
        return {'code': 403, 'err': 'unauthorized request'};
    }

    if(user.password != cypher.encrypt(oldPass)){
        return {'code': 409, 'err': 'problem occurred with one of the parameters'};
    }

    user.password = cypher.encrypt(newPass);
    var res = await dal.editUser(user);
    if(res != null)
        return {'code': 200};
    else
        return {'code': 500, 'err': 'something went wrong'};
};


var getProfile = async function(sessionId) {
    var user = await dal.getUserBySessionId(sessionId);
    if(user == null){
        return {'code': 403, 'err': 'unauthorized request'};
    }

    user.password = "";
    return {'code': 200, 'user': user};
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
module.exports.logout = logout;
module.exports.addUser = addUser;
module.exports.changePassword = changePassword;
module.exports.getProfile = getProfile;