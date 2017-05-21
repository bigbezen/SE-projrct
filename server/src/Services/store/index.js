let logger          = require('../../Utils/Logger/logger');
let storeModel      = require('../../Models/store');
let dal             = require('../../DAL/dal');
let permissions     = require('../permissions/index');

let addStore = async function(sessionId, storeDetails) {
    logger.info('Services.Store.index.addStore', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'addStore');
        //check if to user have the permissions
    if(user != null) {
        let store = await dal.getStoreByNameAndArea(storeDetails.name, storeDetails.address, storeDetails.city);
        //check if the store existing
        if (store == null) {
            let store = new storeModel();
            store.name = storeDetails.name;
            store.managerName = storeDetails.managerName;
            store.phone = storeDetails.phone;
            store.city = storeDetails.city;
            store.address = storeDetails.address;
            store.area = storeDetails.area;
            store.channel = storeDetails.channel;
            let res = await dal.addStore(store);
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

let editStore = async function (sessionId, storeDetails) {
    logger.info('Services.store.index.editStore', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'editStore');
    if (user == null)
        return {'store': null, 'code': 401, 'err': 'permission denied'}

    let store = await dal.getStoreByNameAndArea(storeDetails.name, storeDetails.address, storeDetails.city);
    if (store != null && !store._id.equals(storeDetails._id))
        return {'store': null, 'code': 409, 'err': 'store with the same name and area already exist'};

    let res = await dal.editStore(storeDetails);
    if (res.ok == 0 || res.nModified == 0)
        return {'product': res, 'code': 400, 'err': 'cannot edit this store'};

    return {'product': res, 'code': 200, 'err': null};
};

let deleteStroe = async function (sessionId, storeId) {
    logger.info('Services.store.index.deleteStore', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'deleteStore');
    if(user != null){
        let store =  await dal.deleteStore(storeId);
        return {'store': store, 'code': 200, 'err': null};
    }else{
        return {'store': null, 'code': 401, 'err': 'permission denied'}
    }
};

let getAllStores = async function (sessionId) {
    logger.info('Services.store.index.getAllStores', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getAllStores');
    if(user != null) {
        let stores =  await dal.getAllStores();
        return {'stores': stores, 'code': 200, 'err': null};
    }
    else {
        return {'stores': null, 'code': 401, 'err': 'permission denied'};
    }
};

let getStore = async function(sessionId, storeId){
    logger.info('Services.Encouragement.index.getEncouragement', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getStore');
    if(user == null)
        return {'code': 401, 'err': 'permission denied'};
    let stores = await dal.getStoresByIds([storeId]);
    if(stores.length <= 0)
        return {'code': 409, 'err': 'no such store'};
    return {'code': 200, 'store': stores[0].toObject()};
};

module.exports.addStore = addStore;
module.exports.editStore = editStore;
module.exports.deleteStroe = deleteStroe;
module.exports.getAllStores = getAllStores;
module.exports.getStore = getStore;