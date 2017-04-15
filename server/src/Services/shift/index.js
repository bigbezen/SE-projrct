let us              = require('underscore');

let logger          = require('../../Utils/Logger/logger');
let dal             = require('../../DAL/dal');
let permissions     = require('../permissions/index');

let shiftModel       = require('../../Models/shift');

let encouragementServices = require('../../Services/encouragements');


let addShifts = async function(sessionId, shiftArr){
    logger.info('Services.shift.index.addShifts', {'session-id': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'addShifts');
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
    for(let store of stores)
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
        if('salesmanId' in shift)
            newShift.salesmanId = shift.salesmanId;
        newShift.storeId = shift.storeId;
        newShift.startTime = shift.startTime;
        newShift.endTime = shift.endTime;
        newShift.status = "CREATED";
        newShift.type = shift.type;
        newShift.salesReport = newSalesReportSchema;
        newShift.sales = [];
        newShift.numOfKm = 0;
        newShift.parkingCost = 0;
        newShift.constraints = [];
        newShift.shiftComments = [];
        newShift.encouragements = [];
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
    for(let store of allStores)
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

let getSalesmanFinishedShifts = async function(sessionId, salesmanId){
    logger.info('Services.shift.index.getSalesmanFinishedShifts', {'session-id': sessionId, 'userId': salesmanId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getSalesmanFinishedShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    let salesman = await dal.getUserByobjectId(salesmanId);
    if(salesman == null)
        return {'code': 401, 'err': 'user does not exist'};

    let finishedShifts = await dal.getSalesmanShifts(salesman._id);
    if(finishedShifts == null)
        return {'code': 409, 'err': 'user does not have a shift today'};

    let productsDict = {};
    let products = await dal.getAllProducts();
    for(let product of products)
        productsDict[product._id.toString()] = product;

    finishedShifts = finishedShifts.filter(function(shift){
        return shift.status == 'FINISHED';
    });

    for(let shiftIndex in finishedShifts){
        finishedShifts[shiftIndex] = finishedShifts[shiftIndex].toObject();
    }
    for(let currentShift of finishedShifts){
        //currentShift = currentShift.toObject();
        currentShift.store = (await dal.getStoresByIds([currentShift.storeId]))[0];
        for(let product of currentShift.salesReport) {
            let productDetails = productsDict[product.productId.toString()];
            product.name = productDetails.name;
            product.category = productDetails.category;
            product.subCategory = productDetails.subCategory;
        }
    }
    console.log('bla');

    return {'code': 200, 'shifts': finishedShifts};


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
    for(let product of currShift.salesReport) {
        product.name = productsDict[product.productId.toString()];
    }
    for(let sales of currShift.sales) {
        sales.name = productsDict[sales.productId.toString()];
    }
    return {'code': 200, 'shift': currShift};
};

let getSalesmanShifts = async function(sessionId){
    logger.info('Services.shift.index.getSalesmanShifts', {'session-id': sessionId});

    let salesman = await dal.getUserBySessionId(sessionId);
    if(salesman == null)
        return {'code': 401, 'err': 'user not authorized'};

    let currShifts = await dal.getSalesmanShifts(salesman._id);
    if(currShifts == null)
        return {'code': 409, 'err': 'user does not have a shift today'};

    let productsDict = {};
    let products = await dal.getAllProducts();
    for(let product of products)
        productsDict[product._id] = product.name;

    for(let currentShift of currShifts){
        currentShift = currentShift.toObject();
        currentShift.store = (await dal.getStoresByIds([currentShift.storeId]))[0];
        for(let product of currentShift.salesReport) {
            product.name = productsDict[product.productId.toString()];
        }
    }
    return {'code': 200, 'shifts': currShifts};
};

let getActiveShift = async function(sessionId, shiftId){
    logger.info('Services.shift.index.getActiveShift', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'getActiveShift', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift == null)
        return {'code': 409, 'err': 'shift does not exist in the database'};
    shift = shift[0];
    if(salesman == null || !(salesman._id.equals(shift.salesmanId)) || shift.status != 'STARTED')
        return {'code': 401, 'err': 'user not authorized'};

    return {'code': 200, 'shift': shift.toObject()};
};

let reportExpenses = async function(sessionId, shiftId, km, parking){
    logger.info('Services.shift.index.reportExpenses', {'session-id': sessionId});
    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportExpenses', null);

    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if(shift == null)
        return {'code': 409, 'err': 'shift does not exist in the database'};

    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    if(km < 0 || parking < 0)
        return {'code': 404, 'err': 'illegal km or parking cost'};
    shift.numOfKM = km;
    shift.parkingCost = parking;

    let res = await dal.updateShift(shift);
    if(res.ok == 0)
        return {'shift': shift[0], 'code':400, 'err': 'cannot edit this shift'};

    return {'shift': shift[0], 'code':200, 'err': null};

};

let getShiftsFromDate = async function(sessionId, fromDate){
    logger.info('Services.shift.index.getShiftsFromDate', {'session-id': sessionId});

    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getShiftsFromDate');
    if(isAuthorized == null)
        return {'code': 401, 'err': 'user not authorized'};

    let allShifts = await dal.getShiftsFromDate(fromDate);
    allShifts = allShifts.map(x => x.toObject());
    for(let shift of allShifts){
        shift = await _fillUserDetails(shift);
        shift = await _fillStoreDetails(shift);
    }
    console.log('bla');
    if(allShifts == null)
        return {'code': 500, 'err': 'something went wrong'};
    else
        return {'code': 200, 'shiftArr': allShifts};
};

let startShift = async function(sessionId, shift){
    logger.info('Services.shift.index.startShift', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'startShift');
    if(salesman == null || !salesman._id.equals(shift.salesmanId))
        return {'code': 401, 'err': 'user not authorized'};



    let shiftDb = await dal.getShiftsByIds([shift._id]);
    shiftDb = shiftDb[0];
    if(shiftDb == null)
        return {'code': 404, 'err': 'shift not found'};

    if(shiftDb.status != 'PUBLISHED')
        return {'code': 403, 'err': 'shift not published'};

    if(!(shift.salesReport instanceof  Array))
        return {'code': 409, 'err': 'a sale report is required'};
    let productsDb = await dal.getAllProducts();
    productsDb = productsDb.map(x=>x._id.toString());
    let productsParam = shift.salesReport.map(x=>x.productId);

    if((us.difference(productsDb, productsParam).length != 0) || (us.difference(productsParam, productsDb).length != 0))
        return {'code': 409, 'err': 'not a full sales report'};


    shiftDb.salesReport = shift.salesReport;
    shiftDb.status = 'STARTED';
    let result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};
    else
        return {'code': 200};

};

let reportSale = async function(sessionId, shiftId, sales){
    logger.info('Services.shift.index.reportSale', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportSale', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (shift == null)
        return {'code': 409, 'err': 'problem with one or more of the parameters'};
    //check for all the quantity of sales
    for(let sale of sales){
        if(sale.quantity <= 0){
            return {'code': 409, 'err': 'problem with one or more of the parameters'};
        }
    }

    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    let productExist = false;
    for(let product of shift.salesReport) {
        for (let sale of sales) {
            if (sale.productId == product.productId.toString()) {
                product.sold += sale.quantity;
                productExist = true;

                shift.sales.push({
                    'productId': sale.productId,
                    'timeOfSale': new Date(Date.now()),
                    'quantity': sale.quantity
                });
            }
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

let reportOpened = async function(sessionId, shiftId, opens){
    logger.info('Services.shift.index.reportOpened', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportOpened', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (shift == null)
        return {'code': 409, 'err': 'problem with one or more of the parameters'};
    //check for all the quantity of sales
    for(let open of opens){
        if(open.quantity <= 0){
            return {'code': 409, 'err': 'problem with one or more of the parameters'};
        }
    }

    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    let productExist = false;
    for(let product of shift.salesReport) {
        for (let open of opens) {
            if (open.productId == product.productId.toString()) {
                product.opened += open.quantity;
                productExist = true;
            }
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
    if(salesman == null || shift == null || !salesman._id.equals(shift.salesmanId))
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

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'endShift');
    if(salesman == null || !salesman._id.equals(shift.salesmanId))
        return {'code': 401, 'err': 'user not authorized'};

    let shiftDb = await dal.getShiftsByIds([shift._id]);
    shiftDb = shiftDb[0];
    if(shiftDb == null)
        return {'code': 404, 'err': 'shift not found'};

    if(shiftDb.status != 'STARTED')
        return {'code': 403, 'err': 'shift not started'};

    if(!(shift.salesReport instanceof  Array))
        return {'code': 409, 'err': 'a sale report is required'};
    let productsDb = await dal.getAllProducts();
    productsDb = productsDb.map(x=>x._id.toString());
    let productsParam = shift.salesReport.map(x=>x.productId);

    if((us.difference(productsDb, productsParam).length != 0) || (us.difference(productsParam, productsDb).length != 0))
        return {'code': 409, 'err': 'not a full sales report'};



    shiftDb.salesReport = shift.salesReport;
    shiftDb.status = 'FINISHED';

    let encouragements = await encouragementServices.calculateEncouragements(shift.salesReport);
    if(encouragements == null)
       return {'code': 500, 'err': 'unexpected error'};

    for(let enc of encouragements)
        shiftDb.encouragements.push(enc._id);

    let result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': 'unexpected error'};
    else
        return {'code': 200};
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

let deleteShift = async function (sessionId, shiftId) {
    logger.info('Services.shift.index.deleteShift', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'deleteShift');
    if(user == null)
        return {'shift': null, 'code': 401, 'err': 'permission denied'};

    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift[0] != null && shift[0].status == "STARTED")
        return {'shift': null, 'code': 401, 'err': 'permission denied shift already started'};

    shift = await dal.deleteShift(shiftId);
    return {'shift': shift, 'code':200, 'err': null};
};

let editShift = async function (sessionId, shiftDetails) {
    logger.info('Services.shift.index.editShift', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'editShift');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let shift = await dal.getShiftsByIds([shiftDetails._id]);
    if(shift[0] != null && shift[0].status == "STARTED")
        return {'code': 401, 'err': 'permission denied shift already started'};

    let res = await dal.editShift(shiftDetails);
    if(res.ok == 0)
        return {'code':400, 'err': 'cannot edit this shift'};

    return {'code':200, 'err': null};
};

let editSale = async function(sessionId, shiftId, productId, time, quantity){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'editSale');
    if(user == null)
        return {'code': 401, 'err': 'permission denied'};

    if(quantity < 0)
        return ({'code': 400, 'err': 'quantity cannot be negative'});

    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift.length == 0)
        return {'code': 404, 'err': 'shift not found'};

    shift = shift[0];

    let found = false;
    let diffQuant;
    for(let sale of shift.sales){
        let saleDate = new Date(sale.timeOfSale).getTime();
        let getTime = new Date(time).getTime();
        if(sale.productId.toString()==(productId) &&  saleDate == getTime){
            diffQuant = sale.quantity - quantity;
            sale.quantity = quantity;
            found = true;
        }
    }

    if(!found)
        return {'code': 404, 'err': 'product not found'};

    for(let saleR of shift.salesReport){
        if(saleR.productId.equals(productId)){
            saleR.sold -= diffQuant;
        }
    }

    let res = await dal.updateShift(shift);
    return ({'code': 200});

};

let updateSalesReport = async function(sessionId, shiftId, productId, newSold, newOpened){
    logger.info('Services.shift.index.updateSalesReport', {'session-id': sessionId, 'shiftId': shiftId});
    console.log('debug');
    let user = await permissions.validatePermissionForSessionId(sessionId, 'updateSalesReport');
    console.log('debug');
    if(user == null) {
        return {'shift': null, 'code': 401, 'err': 'permission denied'};
    }
    let shift = await dal.getShiftsByIds([shiftId]);
    console.log('debug');
    if(shift[0] != null && shift[0].status != "FINISHED")
        return {'shift': null, 'code': 401, 'err': 'permission denied - shift is not finished or does not exist'};
    shift = shift[0].toObject();
    let salesReport = shift.salesReport;
    for(let i in salesReport){

        if(salesReport[i].productId.toString() == productId){
            console.log('debug');
            salesReport[i].sold = newSold;
            salesReport[i].opened = newOpened;
        }
    }
    let res = await dal.editSalesReport(shift._id, shift.salesReport);
    console.log('debug');
    if(res.ok == 0)
        return {'shift': shift, 'code':400, 'err': 'cannot edit this shift'};

    return {'shift': shift, 'code':200, 'err': null};

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

let _fillUserDetails = async function(shift){
    let user = await dal.getUsersByIds([shift.salesmanId]);
    if(user.length != 0) {
        user = user[0].toObject();
        let userDetails = {};
        userDetails.username = user.username;
        userDetails.personal = user.personal;
        userDetails._id = user._id;
        shift.salesman = userDetails;
        delete shift.salesmanId;
    }
    return shift;
};

let _fillStoreDetails = async function(shift){
    let store = (await dal.getStoresByIds([shift.storeId]))[0];
    shift.store = store.toObject();
    delete shift.storeId;
    return shift;
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
module.exports.getSalesmanFinishedShifts = getSalesmanFinishedShifts;
module.exports.automateGenerateShifts = automateGenerateShifts;
module.exports.getShiftsFromDate = getShiftsFromDate;
module.exports.getActiveShift = getActiveShift;
module.exports.deleteShift = deleteShift;
module.exports.editShift = editShift;
module.exports.updateSalesReport = updateSalesReport;
module.exports.editSale = editSale;
module.exports.getSalesmanShifts = getSalesmanShifts;
module.exports.reportExpenses = reportExpenses;


