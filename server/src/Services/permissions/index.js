var dal = require('../../DAL/dal');

var validatePermissionForSessionId = async function(sessionId, funcName) {
    var user = await dal.getUserBySessionId(sessionId);
    if(user != null && (funcNameToPermission[funcName].indexOf(user.jobDetails.userType) > -1)){
        return user;
    }
    else{
        return null;
    }
};

var funcNameToPermission = {
    'addUser': ['manager'],
    'editUser': ['manager'],
    'deleteUser': ['manager'],
    'getAllUsers': ['manager'],
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
    'deleteEncouragement': ['manager'],
    'sendBroadcast': ['manager', 'agent'],
    'getInbox': ['salesman'],
    'addShifts': ['manager'],
    'publishShifts': ['manager'],
    'startShift': ['salesman'],
    'addShiftComment': ['salesman'],
    'reportOpened': ['salesman'],
    'reportSale': ['salesman'],
    'endShift': ['salesman'],
    'getActiveShift': ['salesman'],
    'getActiveShiftEncouragements': ['manager', 'salesman']
};

module.exports.validatePermissionForSessionId = validatePermissionForSessionId;