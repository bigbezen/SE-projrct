let logger          = require('../../Utils/Logger/logger');
let dal             = require('../../DAL/dal');
let permissions     = require('../permissions/index');

let shiftModel       = require('../../Models/shift');

let encouragementServices = require('../../Services/encouragements');


let addShifts = async function(sessionId, shiftArr){
    logger.info('Services.shift.index.addShifts', {'session-id': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'addShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    if(shiftArr.length == 0)
        return {'code': 200, 'shiftArr': []};

    let storeIds = shiftArr.map(x => x.storeId);
    let uniqueIds = [];

    //remove duplicates in storeIds
    for(let id of storeIds)
        if(uniqueIds.indexOf(id) == -1)
            uniqueIds.push(id);
    let stores = await dal.getStoresByIds(uniqueIds);
    if(stores.length != uniqueIds.length)
        return {'code': 409, 'err': 'One or more of the stores does not exist'};

    let storeDict = {};
    for(store of stores)
        storeDict[store._id] = store.toObject();

    //check validity of shifts dates
    for(let shift of shiftArr) {
        if ((new Date(shift.startTime)).getTime() > (new Date(shift.endTime)).getTime() ||
              (new Date(shift.startTime)).getTime() < new Date ()){
            return {'code': 409, 'err': 'shifts dates are before current time'};
        }
    }

    let newSalesReportSchema = await _createNewSalesReport();

    let resultAddShift = [];

    //create model for each shift
   for(let shift of shiftArr){
        let newShift = new shiftModel();
        newShift.storeId = shift.storeId;
        newShift.storeId = shift.storeId;
        newShift.startTime = shift.startTime;
        newShift.endTime = shift.endTime;
        newShift.status = "CREATED";
        newShift.type = shift.type;
        newShift.salesReport = newSalesReportSchema;
        newShift.sales = [];
        newShift.constraints = [];
        newShift.shiftComments = [];
        resultAddShift.push(await dal.addShift(newShift));
    }

    resultAddShift = resultAddShift.map(function(shift){
        shift = shift.toObject();
        shift.store = storeDict[shift.storeId];
        return shift;
    });

    return {'code': 200, 'shiftArr': resultAddShift};
};


let automateGenerateShifts = async function (sessionId, startTime, endTime){
    logger.info('Services.shift.index.automateGenerateShifts', {'session-id': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'automateGenerateShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    if ((new Date(startTime)).getTime() > (new Date(endTime)).getTime() ||
        (new Date(startTime)).getTime() < new Date ()) {
        return {'code': 409, 'err': 'shifts dates are before current time'};
    }

    let allStores = await dal.getAllStores();
    let storeDict = {};
    for(store of allStores)
        storeDict[store._id] = store.toObject();

    let newSaleReportSchema = await _createNewSalesReport();
    let resultAddShifts = [];

    for(let store of allStores){
        let newShift = new shiftModel();
        newShift.storeId = store._id;
        newShift.startTime = startTime;
        newShift.endTime = endTime;
        newShift.status = "CREATED";
        newShift.salesReport = newSaleReportSchema;
        newShift.sales = [];
        newShift.constraints = [];
        newShift.shiftComments = [];
        resultAddShifts.push(await dal.addShift(newShift));
    }

    resultAddShifts = resultAddShifts.map(function(shift){
        shift = shift.toObject();
        shift.store = storeDict[shift.storeId];
        return shift;
    });

    return {'code': 200, 'shiftArr': resultAddShifts};

};

let publishShifts = async function(sessionId, shiftArr){
    logger.info('Services.shift.index.publishShifts', {'session-id': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'publishShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    //get a list of shift Ids and user Ids from shiftArr @param
    let shiftIds = shiftArr.map(x => x._id);
    let uniqueUserIds = [];
    let userIds = shiftArr.map(x => x.salesmanId);
    for(let index in userIds) {
        //redundant check - needs to be checked in the validator level
        if(typeof(userIds[index]) != 'string')
            return {'code': 409, 'err': 'all shifts must be attached with a user id'};
        if (index == userIds.indexOf(userIds[index]))
            uniqueUserIds.push(userIds[index]);
    }

    //get a list of shifts and users from db according to the ids lists
    //check that all id that we got as a parameter is a valid object in the db
    let dbShifts = await dal.getShiftsByIds(shiftIds);
    let dbUsers = await dal.getUsersByIds(uniqueUserIds);
    if(shiftIds.length != dbShifts.length)
        return {'code': 409, 'err': 'some shift ids are not in the database'};
    if(uniqueUserIds.length != dbUsers.length)
        return {'code': 409, 'err': 'some user ids are not in the database'};
    for(let user of dbUsers)
        if(user.jobDetails.userType != 'salesman')
            return {'code': 409, 'err': 'one or more of the users is not a salesman'};


    //check that all given shifts are on status 'CREATED'
    //change shifts' status to "PUBLISED"
    for(let shift of dbShifts)
        if(shift.status != 'CREATED')
            return {'code': 409, 'err': 'trying to publish a shift that is already published'};

    for(let shift of shiftArr)
        shift.status = 'PUBLISHED';
    let nonSavedShifts = await dal.publishShifts(shiftArr);

    if(nonSavedShifts.length == 0)
        return {'code': 200};
    else
        return {'code': 200, 'nonSavedShifts': nonSavedShifts};

};

let getSalesmanCurrentShift = async function(sessionId){
    logger.info('Services.shift.index.getSalesmanCurrentShift', {'session-id': sessionId});

    let salesman = await dal.getUserBySessionId(sessionId);
    if(salesman == null)
        return {'code': 401, 'err': 'user not authorized'};

    let currShift = await dal.getSalesmanCurrentShift(salesman._id);
    if(currShift == null)
        return {'code': 409, 'err': 'user does not have a shift today'};

    let productsDict = {};
    let products = await dal.getAllProducts();
    for(let product of products)
        productsDict[product._id] = product.name;

    currShift = currShift.toObject();
    currShift.store = (await dal.getStoresByIds([currShift.storeId]))[0];
    for(var product of currShift.salesReport) {
        product.name = productsDict[product.productId.toString()];
    }
    return {'code': 200, 'shift': currShift};
};

let startShift = async function(sessionId, shift){
    logger.info('Services.shift.index.getSalesmanCurrentShift', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'startShift', null);
    if(salesman == null || salesman._id != shift.salesmanId)
        return {'code': 401, 'err': 'user not authorized'};

    let shiftDb = await dal.getShiftsByIds([shift._id]);
    shiftDb = shiftDb[0];
    shiftDb.salesReport = shift.salesReport;
    shiftDb.status = 'STARTED';
    let result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};
    else
        return {'code': 200};

};

let reportSale = async function(sessionId, shiftId, productId, quantity){
    logger.info('Services.shift.index.reportSale', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportSale', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (quantity <= 0 || shift == null)
        return {'code': 409, 'err': 'problem with one or more of the parameters'};
    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    let productExist = false;
    for(let product of shift.salesReport) {
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

    let result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': 'unexpected error'};
    else
        return {'code': 200}
};

let reportOpened = async function(sessionId, shiftId, productId, quantity){
    logger.info('Services.shift.index.reportOpened', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportSale', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (quantity <= 0 || shift == null)
        return {'code': 409, 'err': 'problem with one or more of the parameters'};
    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    let productExist = false;
    for(let product of shift.salesReport) {
        if (product.productId.toString() == productId) {
            product.opened += quantity;
            productExist = true;
        }
    }
    if(!productExist)
        return {'code': 409, 'err': 'product does not exist'};

    let result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': 'unexpected error'};
    else
        return {'code': 200}
};

let addShiftComment = async function(sessionId, shiftId, content){
    logger.info('Services.shift.index.addShiftComment', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'addShiftComment', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if(salesman == null || shift == null || salesman._id != shift.salesmanId)
        return {'code': 401, 'err': 'user not authorized'};

    shift.shiftComments.push(content);
    let result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': 'unexpected error'};
    else
        return {'code': 200}
};

let endShift = async function(sessionId, shift){
    logger.info('Services.shift.index.endShift', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'endShift', null);
    if(salesman == null || salesman._id != shift.salesmanId)
        return {'code': 401, 'err': 'user not authorized'};



    let shiftDb = await dal.getShiftsByIds([shift._id]);
    if(shiftDb == null)
        return {'code': 409, 'err': 'shift does not exist in the database'};

    shiftDb = shiftDb[0];
    shiftDb.salesReport = shift.salesReport;
    shiftDb.status = 'FINISHED';
    let result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};

    let encouragements = await encouragementServices.calculateEncouragements(shift.salesReport);
    if(encouragements == null)
        return {'code': 500, 'err': 'unexpected error'};

    for(let enc of encouragements)
        salesman.encouragements.push(enc._id);

    result = await dal.updateUser(salesman);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};
    else
        return {'code': 200};
};

let getActiveShift = async function(sessionId, shiftId){
    logger.info('Services.shift.index.getActiveShift', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'getActiveShift', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift == null)
        return {'code': 409, 'err': 'shift does not exist in the database'};
    shift = shift[0];
    if(salesman == null || salesman._id != shift.salesmanId || shift.status != 'STARTED')
        return {'code': 401, 'err': 'user not authorized'};

    return shift.toObject();
};

let getActiveShiftEncouragements = async function(sessionId, shiftId){
    logger.info('Services.shift.index.getActiveShiftEncouragements', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'getActiveShiftEncouragements', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift.length == 0)
        return {'code': 409, 'err': 'shift does not exist in the database'};
    shift = shift[0];
    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString())
        return {'code': 401, 'err': 'user not authorized'};

    let result = await encouragementServices.calculateEncouragements(shift.salesReport);
    if(result == null)
        return {'code': 500, 'err': 'something went wrong'};
    else
        return {'code': 200, 'encouragements': result};
};

let _createNewSalesReport = async function(){
    let report = [];
    let productsIds = await dal.getAllProducts();
    productsIds = productsIds.map(x => x._id);

    for(let productId of productsIds){
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
module.exports.automateGenerateShifts = automateGenerateShifts;



