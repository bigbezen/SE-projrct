function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = require('../../Utils/Logger/logger');
var cypher = require('../../Utils/Cypher/index');
var dal = require('../../DAL/dal');

var userModel = require('../../Models/user');

var hashGenerator = require('hash-generator');

var login = (() => {
    var _ref = _asyncToGenerator(function* (username, password) {

        var user = yield dal.getUserByUsername(username);
        if (user != null && cypher.decrypt(user.password) == password) {
            var newSessionId = yield _generateSessionId();
            user.sessionId = newSessionId;
            user.save();
            return { 'sessionId': newSessionId, 'userType': user.jobDetails.userType };
        } else {
            return { 'sessionId': null, 'err': 'error while logging in' };
        }
    });

    return function login(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

var addUser = function () {
    var newUser = new userModel();
    newUser.username = 'user';
    newUser.password = cypher.encrypt("matan");
    newUser.jobDetails.userType = 'manager';
    dal.addUser(newUser);
};

var _generateSessionId = (() => {
    var _ref2 = _asyncToGenerator(function* () {
        var isDuplicateSessionId = true;
        var sessionId, isIdInUse;
        while (isDuplicateSessionId) {
            sessionId = hashGenerator(128);
            isIdInUse = yield dal.getUserBySessionId(sessionId);
            if (isIdInUse == null) {
                isDuplicateSessionId = false;
            }
        }
        return sessionId;
    });

    return function _generateSessionId() {
        return _ref2.apply(this, arguments);
    };
})();

module.exports.login = login;
module.exports.addUser = addUser;