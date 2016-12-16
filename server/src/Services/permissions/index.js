var dal = require('../../DAL/dal');

var validatePermissionForSessionId = function(sessionId, funcName, cb) {
    dal.getUserBySessionId(sessionId, function(err, user){
        if(user != null){
            if(funcNameToPermission[funcName].indexOf(user.jobDetails.userType) > -1){
                cb(null, user);
            }
            else{
                cb('no permission', null);
            }
        }
        else{
            cb(err, null);
        }
    });
};

var funcNameToPermission = {
    'addUser': ['manager'],
    'addStore': ['manager'],
    'deleteStore': ['manager'],
    'editStore': ['manager'],
    'getAllStores': ['manager','salesman'],
    'addProduct': ['manager'],
    'getAllProducts': ['manager','salesman'],
    'editProduct': ['manager'],
    'deleteProduct': ['manager']
};

module.exports.validatePermissionForSessionId = validatePermissionForSessionId;