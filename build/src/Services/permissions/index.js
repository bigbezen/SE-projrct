function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var dal = require('../../DAL/dal');

var validatePermissionForSessionId = (() => {
    var _ref = _asyncToGenerator(function* (sessionId, funcName, cb) {
        var user = yield dal.getUserBySessionId(sessionId);
        if (user != null && funcNameToPermission[funcName].indexOf(user.jobDetails.userType) > -1) {
            return user;
        } else {
            return null;
        }
    });

    return function validatePermissionForSessionId(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

var funcNameToPermission = {
    'addUser': ['manager'],
    'addStore': ['manager'],
    'deleteStore': ['manager'],
    'editStore': ['manager'],
    'getAllStores': ['manager', 'salesman'],
    'addProduct': ['manager'],
    'getAllProducts': ['manager', 'salesman'],
    'editProduct': ['manager'],
    'deleteProduct': ['manager'],
    'addEncouragement': ['manager'],
    'getAllEncouragements': ['manager', 'salesman'],
    'editEncouragement': ['manager'],
    'deleteEncouragement': ['manager']
};

module.exports.validatePermissionForSessionId = validatePermissionForSessionId;