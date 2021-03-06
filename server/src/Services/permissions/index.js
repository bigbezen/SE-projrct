var dal = require('../../DAL/dal');

var validatePermissionForSessionId = async function(sessionId, funcName, cb) {
    var user = await dal.getUserBySessionId(sessionId)
        if(user != null && (funcNameToPermission[funcName].indexOf(user.jobDetails.userType) > -1)){
            return user;
        }
        else{
            return null;
        }
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
    'deleteProduct': ['manager'],
    'addEncouragement': ['manager'],
    'getAllEncouragements': ['manager','salesman'],
    'editEncouragement': ['manager'],
    'deleteEncouragement': ['manager']
};

module.exports.validatePermissionForSessionId = validatePermissionForSessionId;