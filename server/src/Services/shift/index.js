var logger          = require('../../Utils/Logger/logger');
var dal             = require('../../DAL/dal');
var permissions     = require('../permissions/index');

var shiftModel       = require('../../Models/shift');

var encouragementServices = require('../../Services/encouragements');


var addShifts = async function(sessionId, shiftArr){
    logger.info('Services.shift.index.addShifts', {'session-id': sessionId});
    var isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'addShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    var storeIds = shiftArr.map(x => x.storeId);
    var uniqueIds = [];

    //remove duplicates in storeIds
    for(id of storeIds)
        if(uniqueIds.indexOf(id) == -1)
            uniqueIds.push(id);
    var stores = await dal.getStoresByIds(uniqueIds);
    if(stores.length != uniqueIds.length)
        return {'code': 409, 'err': 'One or more of the stores does not exist'};

    //check validity of shifts dates
    for(shift of shiftArr) {
        if ((new Date(shift.startTime)).getTime() > (new Date(shift.endTime)).getTime() ||
              (new Date(shift.startTime)).getTime() < new Date ()){
            return {'code': 409, 'err': 'shifts dates are before current time'};
        }
    }

    var newSalesReport = await _createNewSalesReport();

    var resultAddShift = [];

    //create model for each shift
   for(shift of shiftArr){
        var newShift = new shiftModel();
        newShift.storeId = shift.storeId;
        newShift.startTime = shift.startTime;
        newShift.status = "CREATED";
        newShift.type = shift.type;
        newShift.salesReport = newSalesReport;
        newShift.sales = [];
        newShift.constraints = [];
        newShift.shiftComments = [];
        resultAddShift.push(await dal.addShift(newShift));
    }

    resultAddShift.map(x => x.toObject());

    return {'code': 200, 'shiftArr': resultAddShift};
};

var publishShifts = async function(sessionId, shiftArr){
    logger.info('Services.shift.index.publishShifts', {'session-id': sessionId});
    var isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'publishShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    //get a list of shift Ids and user Ids from shiftArr @param
    var shiftIds = shiftArr.map(x => x._id);
    var uniqueUserIds = [];
    var userIds = shiftArr.map(x => x.salesmanId);
    for(index in userIds) {
        //redundant check - needs to be checked in the validator level
        if(typeof(userIds[index]) != 'string')
            return {'code': 409, 'err': 'all shifts must be attached with a user id'};
        if (index == userIds.indexOf(userIds[index]))
            uniqueUserIds.push(userIds[index]);
    }

    //get a list of shifts and users from db according to the ids lists
    //check that all id that we got as a parameter is a valid object in the db
    var dbShifts = await dal.getShiftsByIds(shiftIds);
    var dbUsers = await dal.getUsersByIds(uniqueUserIds);
    if(shiftIds.length != dbShifts.length)
        return {'code': 409, 'err': 'some shift ids are not in the database'};
    if(uniqueUserIds.length != dbUsers.length)
        return {'code': 409, 'err': 'some user ids are not in the database'};
    for(user of dbUsers)
        if(user.jobDetails.userType != 'salesman')
            return {'code': 409, 'err': 'one or more of the users is not a salesman'};


    //check that all given shifts are on status 'CREATED'
    //change shifts' status to "PUBLISED"
    for(shift of dbShifts)
        if(shift.status != 'CREATED')
            return {'code': 409, 'err': 'trying to publish a shift that is already published'};

    for(shift of shiftArr)
        shift.status = 'PUBLISHED';
    var nonSavedShifts = await dal.publishShifts(shiftArr);

    if(nonSavedShifts.length == 0)
        return {'code': 200};
    else
        return {'code': 200, 'nonSavedShifts': nonSavedShifts};

};

var getSalesmanCurrentShift = async function(sessionId){
    logger.info('Services.shift.index.getSalesmanCurrentShift', {'session-id': sessionId});

    var salesman = await dal.getUserBySessionId(sessionId);
    if(salesman == null)
        return {'code': 401, 'err': 'user not authorized'};

    var currShift = await dal.getSalesmanCurrentShift(salesman._id);
    if(currShift == null)
        return {'code': 409, 'err': 'user does not have a shift today'};

    currShift = currShift.toObject();
    currShift.store = (await dal.getStoresByIds([currShift.storeId]))[0];
    return {'code': 200, 'shift': currShift};
};

var startShift = async function(sessionId, shift){
    logger.info('Services.shift.index.getSalesmanCurrentShift', {'session-id': sessionId});

    var salesman = await permissions.validatePermissionForSessionId(sessionId, 'startShift', null);
    if(salesman == null || salesman._id != shift.salesmanId)
        return {'code': 401, 'err': 'user not authorized'};

    var shiftDb = await dal.getShiftsByIds([shift._id]);
    shiftDb = shiftDb[0];
    shiftDb.salesReport = shift.salesReport;
    shiftDb.status = 'STARTED';
    var result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};
    else
        return {'code': 200};

};

var reportSale = async function(sessionId, shiftId, productId, quantity){
    logger.info('Services.shift.index.reportSale', {'session-id': sessionId});

    var salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportSale', null);
    var shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (quantity <= 0 || shift == null)
        return {'code': 409, 'err': 'problem with one or more of the parameters'};
    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    var productExist = false;
    for(product of shift.salesReport) {
        if (product.productId.toString() == productId) {
            product.sold += quantity;
            productExist = true;
        }
    }
    if(!productExist)
        return {'code': 409, 'err': 'product does not exist'};

    shift.sales.push({
        'productId': productId,
        'timeOfSale': new Date(Date.now()),
        'quantity': quantity
    });

    var result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': 'unexpected error'};
    else
        return {'code': 200}
};

var reportOpened = async function(sessionId, shiftId, productId, quantity){
    logger.info('Services.shift.index.reportOpened', {'session-id': sessionId});

    var salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportSale', null);
    var shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (quantity <= 0 || shift == null)
        return {'code': 409, 'err': 'problem with one or more of the parameters'};
    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    var productExist = false;
    for(product of shift.salesReport) {
        if (product.productId.toString() == productId) {
            product.opened += quantity;
            productExist = true;
        }
    }
    if(!productExist)
        return {'code': 409, 'err': 'product does not exist'};

    var result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': 'unexpected error'};
    else
        return {'code': 200}
};

var addShiftComment = async function(sessionId, shiftId, content){
    logger.info('Services.shift.index.addShiftComment', {'session-id': sessionId});

    var salesman = await permissions.validatePermissionForSessionId(sessionId, 'addShiftComment', null);
    var shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if(salesman == null || shift == null || salesman._id != shift.salesmanId)
        return {'code': 401, 'err': 'user not authorized'};

    shift.shiftComments.push(content);
    var result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': 'unexpected error'};
    else
        return {'code': 200}
};

var endShift = async function(sessionId, shift){
    logger.info('Services.shift.index.endShift', {'session-id': sessionId});

    var salesman = await permissions.validatePermissionForSessionId(sessionId, 'endShift', null);
    if(salesman == null || salesman._id != shift.salesmanId)
        return {'code': 401, 'err': 'user not authorized'};



    var shiftDb = await dal.getShiftsByIds([shift._id]);
    if(shiftDb == null)
        return {'code': 409, 'err': 'shift does not exist in the database'};

    shiftDb = shiftDb[0];
    shiftDb.salesReport = shift.salesReport;
    shiftDb.status = 'FINISHED';
    var result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};

    var encouragements = await encouragementServices.calculateEncouragements(shift.salesReport);
    if(encouragements == null)
        return {'code': 500, 'err': 'unexpected error'};

    for(enc of encouragements)
        salesman.encouragements.push(enc._id);

    result = await dal.updateUser(salesman);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};
    else
        return {'code': 200};
};

var getActiveShift = async function(sessionId, shiftId){
    logger.info('Services.shift.index.getActiveShift', {'session-id': sessionId});

    var salesman = await permissions.validatePermissionForSessionId(sessionId, 'getActiveShift', null);
    var shift = await dal.getShiftsByIds([shiftId]);
    if(shift == null)
        return {'code': 409, 'err': 'shift does not exist in the database'};
    shift = shift[0];
    if(salesman == null || salesman._id != shift.salesmanId || shift.status != 'STARTED')
        return {'code': 401, 'err': 'user not authorized'};

    return shift.toObject();
};

var getActiveShiftEncouragements = async function(sessionId, shiftId){
    logger.info('Services.shift.index.getActiveShiftEncouragements', {'session-id': sessionId});

    var salesman = await permissions.validatePermissionForSessionId(sessionId, 'getActiveShiftEncouragements', null);
    var shift = await dal.getShiftsByIds([shiftId]);
    if(shift == null)
        return {'code': 409, 'err': 'shift does not exist in the database'};
    shift = shift[0];
    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString())
        return {'code': 401, 'err': 'user not authorized'};

    var result = await encouragementServices.calculateEncouragements(shift.salesReport);
    if(result == null)
        return {'code': 500, 'err': 'something went wrong'};
    else
        return {'code': 200, 'encouragements': result};
};

var _createNewSalesReport = async function(){
    var report = [];
    var productsIds = await dal.getAllProducts();
    productsIds = productsIds.map(x => x._id);

    for(productId of productsIds){
        report.push({
            'productId': productId,
            'stockStartShift': 0,
            'stockEndShift': 0,
            'sold': 0,
            'opened': 0
        });
    }
    return report;
};


module.exports.addShifts = addShifts;
module.exports.publishShifts = publishShifts;
module.exports.getSalesmanCurrentShift = getSalesmanCurrentShift;
module.exports.startShift = startShift;
module.exports.endShift = endShift;
module.exports.reportSale = reportSale;
module.exports.reportOpened = reportOpened;
module.exports.addShiftComment = addShiftComment;
module.exports.getActiveShiftEncouragements = getActiveShiftEncouragements;



