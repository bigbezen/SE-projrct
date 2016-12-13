var logger          = require('../../Utils/Logger/logger');
var storeModel      = require('../../Models/store');
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');

var addStore = function(sessionId, storeDetails, cb) {
    logger.info('Services.addStore.index', {'session-id': sessionId});
    permissions.validatePermissionForSessionId(sessionId, 'addStore', function(err, user) {
        if(user != null) {
            var store = new storeModel();
            store.name = storeDetails.name;
            store.managerName = storeDetails.managerName;
            store.phone = storeDetails.phone;
            store.city = storeDetails.city;
            store.address = storeDetails.address;
            store.area = storeDetails.area;
            store.channel = storeDetails.channel;
            dal.addStore(store);
            cb(null);
        }
        else{
            if(err != null)
                cb(err);
            else
                cb('user not exists');
        }
    });
};

module.exports.addStore = addStore;