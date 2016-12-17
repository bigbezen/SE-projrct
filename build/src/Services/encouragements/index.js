function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = require('../../Utils/Logger/logger');
var encouragementModel = require('../../Models/encouragement');
var dal = require('../../DAL/dal');
var permissions = require('../permissions/index');

var addEncouragement = (() => {
    var _ref = _asyncToGenerator(function* (sessionId, encouragementDetails) {
        logger.info('Services.Encouragement.index.addEncouragement', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'addEncouragement');
        //check if to user have the permissions
        if (user != null) {
            var encouragement = new encouragementModel();
            encouragement.active = encouragementDetails.active;
            encouragement.numOfProducts = encouragementDetails.numOfProducts;
            encouragement.rate = encouragementDetails.rate;

            //create id object from the string id
            var products = yield dal.getProductsById(encouragementDetails);
            encouragement.products = products;

            dal.addEncouragement(encouragement);
            return { 'encouragement': encouragement, 'code': 200, 'err': null };
        } else {
            return { 'encouragement': null, 'code': 409, 'err': 'permission denied' };
        }
    });

    return function addEncouragement(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

var editEncouragement = (() => {
    var _ref2 = _asyncToGenerator(function* (sessionId, encouragementDetails) {
        logger.info('Services.Encouragement.index.editEncouragement', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'editEncouragement');
        if (user != null) {
            var encouragement = yield dal.editEncouragement(encouragementDetails);
            return { 'encouragement': encouragement, 'code': 200, 'err': null };
        } else {
            return { 'encouragement': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function editEncouragement(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

var deleteEncouragement = (() => {
    var _ref3 = _asyncToGenerator(function* (sessionId, encouragementDetails) {
        logger.info('Services.Encouragement.index.deleteEncouragement', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'deleteEncouragement');
        if (user != null) {
            var encouragement = yield dal.deleteEncouragement(encouragementDetails);
            return { 'encouragement': encouragement, 'code': 200, 'err': null };
        } else {
            return { 'encouragement': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function deleteEncouragement(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})();

var getAllEncouragements = (() => {
    var _ref4 = _asyncToGenerator(function* (sessionId) {
        logger.info('Services.Encouragement.index.getAllEncouragements', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'getAllEncouragements');
        if (user != null) {
            var encouragements = yield dal.getAllEncouragements();
            return { 'encouragements': encouragements, 'code': 200, 'err': null };
        } else {
            return { 'encouragements': null, 'code': 401, 'err': 'permission denied' };;
        }
    });

    return function getAllEncouragements(_x7) {
        return _ref4.apply(this, arguments);
    };
})();

module.exports.addEncouragement = addEncouragement;
module.exports.editEncouragement = editEncouragement;
module.exports.deleteEncouragement = deleteEncouragement;
module.exports.getAllEncouragements = getAllEncouragements;