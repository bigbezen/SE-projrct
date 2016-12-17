function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = require('../../Utils/Logger/logger');
var mailer = require('../../Utils/Mailer/index');
var cypher = require('../../Utils/Cypher/index');
var dal = require('../../DAL/dal');
var permissions = require('../permissions/index');

var userModel = require('../../Models/user');

var hashGenerator = require('hash-generator');

var login = (() => {
    var _ref = _asyncToGenerator(function* (username, password) {
        logger.info('Services.user.index.login', { 'username': username });
        var user = yield dal.getUserByUsername(username);

        if (user != null && cypher.decrypt(user.password) == password) {
            var newSessionId = yield _generateSessionId();
            user.sessionId = newSessionId;
            var res = yield dal.editUser(user);
            if (res != null) return { 'sessionId': newSessionId, 'userType': user.jobDetails.userType };else return { 'code': '500', 'err': 'something went wrong' };
        } else {
            return { 'sessionId': null, 'err': 'error while logging in' };
        }
    });

    return function login(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

var logout = (() => {
    var _ref2 = _asyncToGenerator(function* (sessionId) {
        logger.info('Services.user.index.logout', { 'session-id': sessionId });
        var user = yield dal.getUserBySessionId(sessionId);
        if (user == null) {
            return { 'code': 403, 'err': 'unauthorized request' };
        }

        user.sessionId = "";
        var res = yield dal.editUser(user);
        if (res != null) return { 'code': 200 };else return { 'code': 500, 'err': 'something went wrong' };
    });

    return function logout(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

var addUser = (() => {
    var _ref3 = _asyncToGenerator(function* (sessionId, userDetails) {
        //TODO: add permissions check
        logger.info('Services.user.index.addUser', { 'session-id': sessionId });

        var isExistUsername = yield dal.getUserByUsername(userDetails.username);
        var isExistId = yield dal.getUserById(userDetails.personal.id);
        if (isExistUsername != null || isExistId != null) {
            return { 'code': 409, 'err': 'Username or Id already exists' };
        }

        var newUser = new userModel();
        newUser.username = userDetails.username;
        newUser.password = cypher.encrypt(userDetails.password);
        newUser.startDate = new Date(userDetails.startDate);
        newUser.endDate = userDetails.endDate;
        newUser.personal = userDetails.personal;
        newUser.contact = userDetails.contact;
        newUser.jobDetails = userDetails.jobDetails;
        newUser.inbox = [];
        var res = yield dal.addUser(newUser);
        newUser.password = "";
        if (res != null) {
            return { 'code': 200, 'user': newUser };
        } else {
            return { 'code': 500, 'err': 'could not insert user to database' };
        }
    });

    return function addUser(_x4, _x5) {
        return _ref3.apply(this, arguments);
    };
})();

var changePassword = (() => {
    var _ref4 = _asyncToGenerator(function* (sessionId, oldPass, newPass) {
        logger.info('Services.user.index.changePassword', { 'session-id': sessionId });

        var user = yield dal.getUserBySessionId(sessionId);
        if (user == null) {
            return { 'code': 403, 'err': 'unauthorized request' };
        }

        if (user.password != cypher.encrypt(oldPass)) {
            return { 'code': 409, 'err': 'problem occurred with one of the parameters' };
        }

        user.password = cypher.encrypt(newPass);
        var res = yield dal.editUser(user);
        if (res != null) return { 'code': 200 };else return { 'code': 500, 'err': 'something went wrong' };
    });

    return function changePassword(_x6, _x7, _x8) {
        return _ref4.apply(this, arguments);
    };
})();

var getProfile = (() => {
    var _ref5 = _asyncToGenerator(function* (sessionId) {
        var user = yield dal.getUserBySessionId(sessionId);
        if (user == null) {
            return { 'code': 403, 'err': 'unauthorized request' };
        }

        user.password = "";
        return { 'code': 200, 'user': user };
    });

    return function getProfile(_x9) {
        return _ref5.apply(this, arguments);
    };
})();

var _generateSessionId = (() => {
    var _ref6 = _asyncToGenerator(function* () {
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
        return _ref6.apply(this, arguments);
    };
})();

module.exports.login = login;
module.exports.logout = logout;
module.exports.addUser = addUser;
module.exports.changePassword = changePassword;
module.exports.getProfile = getProfile;