function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var logger = require('../../Utils/Logger/logger');
var storeModel = require('../../Models/store');
var dal = require('../../DAL/dal');
var permissions = require('../permissions/index');

var addStore = (() => {
    var _ref = _asyncToGenerator(function* (sessionId, storeDetails) {
        logger.info('Services.Store.index.addStore', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'addStore');
        //check if to user have the permissions
        if (user != null) {
            var store = yield dal.getStoreByNameAndArea(storeDetails);
            //check if the store existing
            if (store == null) {
                var store = new storeModel();
                store.name = storeDetails.name;
                store.managerName = storeDetails.managerName;
                store.phone = storeDetails.phone;
                store.city = storeDetails.city;
                store.address = storeDetails.address;
                store.area = storeDetails.area;
                store.channel = storeDetails.channel;
                dal.addStore(store);
                return { 'store': store, 'code': 200, 'err': null };
            } else {
                return { 'store': null, 'code': 409, 'err': 'store already exist' };
            }
        } else {
            return { 'store': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function addStore(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

var editStore = (() => {
    var _ref2 = _asyncToGenerator(function* (sessionId, storeDetails) {
        logger.info('Services.store.index.editStore', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'editStore');
        if (user != null) {
            var store = yield dal.editStore(storeDetails);
            return { 'store': store, 'code': 200, 'err': null };
        } else {
            return { 'store': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function editStore(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})();

var deleteStroe = (() => {
    var _ref3 = _asyncToGenerator(function* (sessionId, storeDetails) {
        logger.info('Services.store.index.deleteStore', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'deleteStore');
        if (user != null) {
            var store = yield dal.deleteStore(storeDetails);
            return { 'store': store, 'code': 200, 'err': null };
        } else {
            return { 'store': null, 'code': 401, 'err': 'permission denied' };
        }
    });

    return function deleteStroe(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})();

var getAllStores = (() => {
    var _ref4 = _asyncToGenerator(function* (sessionId) {
        logger.info('Services.store.index.getAllStores', { 'session-id': sessionId });
        var user = yield permissions.validatePermissionForSessionId(sessionId, 'getAllStores');
        if (user != null) {
            var stores = yield dal.getAllStores();
            return { 'stores': stores, 'code': 200, 'err': null };
        } else {
            return { 'stores': null, 'code': 401, 'err': 'permission denied' };;
        }
    });

    return function getAllStores(_x7) {
        return _ref4.apply(this, arguments);
    };
})();

module.exports.addStore = addStore;
module.exports.editStore = editStore;
module.exports.deleteStroe = deleteStroe;
module.exports.getAllStores = getAllStores;