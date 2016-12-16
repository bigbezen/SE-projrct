var logger          = require('../../Utils/Logger/logger');
var storeModel      = require('../../Models/store');
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');

var addStore = function(sessionId, storeDetails, cb) {
    logger.info('Services.Store.index.addStore', {'session-id': sessionId});
    permissions.validatePermissionForSessionId(sessionId, 'addStore', function(err, user) {
        //check if to user have the permissions
        if(user != null) {
            dal.getStoreByNameAndArea(storeDetails, function (err, store) {
                //check if the store existing
                if(store.length == 0){
                    var store = new storeModel();
                    store.name = storeDetails.name;
                    store.managerName = storeDetails.managerName;
                    store.phone = storeDetails.phone;
                    store.city = storeDetails.city;
                    store.address = storeDetails.address;
                    store.area = storeDetails.area;
                    store.channel = storeDetails.channel;
                    dal.addStore(store);
                    cb(null, store);
                }
                else{
                    cb('store already exist', null);
                }
            });
        }
        else{
            if(err != null)
                cb(err, null);
            else
                cb('user not exists', null);
        }
    });
};

var editStore = function (sessionId, storeDetails, cb) {
    logger.info('Services.store.index.editStore', {'session-id': sessionId});
    permissions.validatePermissionForSessionId(sessionId, 'editStore', function (err, user) {
        if(user != null){
            dal.editeStore(storeDetails, cb);
        }else{
         cb(err);
        }
    });
};

var deleteStroe = function (sessionId, storeDetails, cb) {
    logger.info('Services.store.index.deleteStore', {'session-id': sessionId});
    permissions.validatePermissionForSessionId(sessionId, 'deleteStore', function (err, user) {
        if(user != null){
            dal.deleteStore(storeDetails, cb)
        }
        else{
            cb(err);
        }
    });
};


var getAllStores = function (sessionId, cb) {
    logger.info('Services.store.index.getAllStores', {'session-id': sessionId});
    permissions.validatePermissionForSessionId(sessionId, 'getAllStores', function (err, user) {
        if(user != null) {
            dal.getAllStores(cb);
        }
        else{
            cb(err, null);
        }
    });
};

module.exports.addStore = addStore;
module.exports.editStore = editStore;
module.exports.deleteStroe = deleteStroe;
module.exports.getAllStores = getAllStores;