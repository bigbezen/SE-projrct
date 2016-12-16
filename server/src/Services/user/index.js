var logger          = require('../../Utils/Logger/logger');
var cypher          = require('../../Utils/Cypher/index');
var dal             = require('../../DAL/dal');

var userModel       = require('../../Models/user');

var hashGenerator   = require('hash-generator');




var login = function(username, password){

};

var addUser = function() {
    var newUser = new userModel();
    newUser.password =  cypher.encrypt("matan");
    newUser.sessionId = '123456';
    newUser.jobDetails.userType = 'manager';
    dal.addUser(newUser);
};

function _generateSessionId(cb) {
    var isDuplicateSessionId = true;

    // while(isDuplicateSessionId){
    //     sessionId = hashGenerator(128);
    //     isIdInUse = dal.getUserBySessionId(sessionId, function(user, err){
    //         if(user == null){
    //             isDuplicateSessionId = false;
    //         }
    //     });
    // }
    sessionId = hashGenerator(128);
    return sessionId;
}


module.exports.login = login;
module.exports.addUser = addUser;