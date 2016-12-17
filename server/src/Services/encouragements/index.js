var logger                  = require('../../Utils/Logger/logger');
var encouragementModel      = require('../../Models/encouragement');
var dal                     = require('../../DAL/dal');
var permissions             = require('../permissions/index');

var addEncouragement = async function(sessionId, encouragementDetails) {
    logger.info('Services.Encouragement.index.addEncouragement', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'addEncouragement');
    //check if to user have the permissions
    if(user != null) {
        var encouragement = new encouragementModel();
        encouragement.active = encouragementDetails.active;
        encouragement.numOfProducts = encouragementDetails.numOfProducts;
        encouragement.rate = encouragementDetails.rate;

        //create id object from the string id
        var products = await dal.getProductsById(encouragementDetails);
        encouragement.products = products;

        dal.addEncouragement(encouragement);
        return {'encouragement': encouragement, 'code': 200, 'err': null};
    }
    else{
        return {'encouragement': null, 'code': 409, 'err': 'permission denied'};
    }
};

var editEncouragement = async function (sessionId, encouragementDetails) {
    logger.info('Services.Encouragement.index.editEncouragement', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'editEncouragement');
    if(user != null){
        var encouragement =  await dal.editEncouragement(encouragementDetails);
        return {'encouragement': encouragement, 'code': 200, 'err': null};
    }else{
        return {'encouragement': null, 'code': 401, 'err': 'permission denied'}
    }
};

var deleteEncouragement = async function (sessionId, encouragementDetails) {
    logger.info('Services.Encouragement.index.deleteEncouragement', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'deleteEncouragement');
    if(user != null){
        var encouragement =  await dal.deleteEncouragement(encouragementDetails)
        return {'encouragement': encouragement, 'code': 200, 'err': null};
    }else{
        return {'encouragement': null, 'code': 401, 'err': 'permission denied'}
    }
};

var getAllEncouragements = async function (sessionId) {
    logger.info('Services.Encouragement.index.getAllEncouragements', {'session-id': sessionId});
    var user = await permissions.validatePermissionForSessionId(sessionId, 'getAllEncouragements');
    if(user != null) {
        var encouragements =  await dal.getAllEncouragements();
        return {'encouragements': encouragements, 'code': 200, 'err': null};
    }
    else {
        return {'encouragements': null, 'code': 401, 'err': 'permission denied'};;
    }
};

module.exports.addEncouragement = addEncouragement;
module.exports.editEncouragement = editEncouragement;
module.exports.deleteEncouragement = deleteEncouragement;
module.exports.getAllEncouragements = getAllEncouragements;