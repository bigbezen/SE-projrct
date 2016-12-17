var logger          = require('../../Utils/Logger/logger');
var storeModel      = require('../../Models/store');
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');

var addStore = async function(sessionId, storeDetails) {
    logger.info('Services.Store.index.addStore', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'addStore');
        //check if to user have the permissions
    if(user != null) {
        var store = await dal.getStoreByNameAndArea(storeDetails);
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
            return {'store': store, 'code': 200, 'err': null};
        }
        else {
            return {'store': null, 'code': 409, 'err': 'store already exist'};
        }
    }
    else{
        return {'store': null, 'code': 401, 'err': 'permission denied'};
    }
};

var editStore = async function (sessionId, storeDetails) {
    logger.info('Services.store.index.editStore', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'editStore');
    if(user != null){
        var store =  await dal.editeStore(storeDetails);
        return {'store': store, 'code': 200, 'err': null};
    }else{
        return {'store': null, 'code': 401, 'err': 'permission denied'}
    }
};

var deleteStroe = async function (sessionId, storeDetails) {
    logger.info('Services.store.index.deleteStore', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'deleteStore');
    if(user != null){
        var store =  await dal.deleteStore(storeDetails)
        return {'store': store, 'code': 200, 'err': null};
    }else{
        return {'store': null, 'code': 401, 'err': 'permission denied'}
    }
};

var getAllStores = async function (sessionId) {
    logger.info('Services.store.index.getAllStores', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'getAllStores');
    if(user != null) {
        var stores =  await dal.getAllStores();
        return {'stores': stores, 'code': 200, 'err': null};
    }
    else {
        return {'stores': null, 'code': 401, 'err': 'permission denied'};;
    }
};

module.exports.addStore = addStore;
module.exports.editStore = editStore;
module.exports.deleteStroe = deleteStroe;
module.exports.getAllStores = getAllStores;