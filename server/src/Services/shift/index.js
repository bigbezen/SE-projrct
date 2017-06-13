let us              = require('underscore');

let logger          = require('../../Utils/Logger/logger');
let dal             = require('../../DAL/dal');
let permissions     = require('../permissions/index');
let mailer          = require('../../Utils/Mailer/index');
let constantString  = require('../../Utils/Constans/ConstantStrings.js');
let moment          = require('moment');

let shiftModel       = require('../../Models/shift');

let encouragementServices = require('../../Services/encouragements');
let reportService = require('../../Services/reports/index.js');

let SHIFT_STATUS = {
    'CREATED': true,
    'PUBLISHED': true,
    'STARTED': true,
    'FINISHED': true
};


let addShifts = async function(sessionId, shiftArr){
    logger.info('Services.shift.index.addShifts', {'session-id': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'addShifts');
    if(isAuthorized == null)
        return {'code': 401, 'err': constantString.permssionDenied};

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
        return {'code': 409, 'err': constantString.storeDoesNotExist};

    let storeDict = {};
    for(let store of stores)
        storeDict[store._id] = store.toObject();

    //check validity of shifts dates
    for(let shift of shiftArr) {
        if ((new Date(shift.startTime)).getTime() > (new Date(shift.endTime)).getTime() ||
              (new Date(shift.startTime)).getTime() < (new Date()).getTime()){
            return {'code': 409, 'err': constantString.shiftsCurrentTimeError};
        }
    }

    let newSalesReportSchema = await _createNewSalesReport();

    let resultAddShift = [];
    //create model for each shift
   for(let shift of shiftArr){
        let newShift = new shiftModel();
        newShift.storeId = shift.storeId;
        if('salesmanId' in shift && shift.salesmanId != "") {
            let shiftDB = await dal.getShiftsOfRangeForSalesman(shift.startTime, shift.endTime, shift.salesmanId);
            if(shiftDB != null) {
                return {'code': 409, 'err': constantString.userCannotHaveMoreThanOneShiftAtDay};
            }

            newShift.salesmanId = shift.salesmanId;
            let salesman = await dal.getUserByobjectId(shift.salesmanId);
            sendMailOfShift(salesman, shift, storeDict[shift.storeId].name);
            let updateStore = await dal.setStoreDefaultUser(shift.storeId, shift.salesmanId);
        }
        newShift.storeId = shift.storeId;
        newShift.startTime = shift.startTime;
        newShift.endTime = shift.endTime;
        newShift.type = shift.type;
        if(shift.type.includes(constantString.shiftTypeEvemt)){
            newShift.status = "FINISHED";
        }
        else{
            newShift.status = "CREATED";
        }

        newShift.salesReport = newSalesReportSchema;
        newShift.sales = [];
        newShift.numOfKm = 0;
        newShift.extraExpenses = 0;
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

let sendMailOfShift = function(salesman, shift, storeName){
    let date = moment(shift.startTime).format('DD-MM-YY');
    let startHour = moment(shift.startTime).format('H:mm');
    let endHour = moment(shift.endTime).format('H:mm');
    let content = 'שובצה עבורך משמרת חדשה לתאריך: ' + date;
    content += '\n\n' + 'בשעה: ' + startHour;
    content += ' עד השעה: ' + endHour + '\n\n';
    content += 'בחנות: ' + storeName;

    mailer.sendMail([salesman.contact.email], 'IBBLS - שובצה עבורך משמרת חדשה', content);
};

let automateGenerateShifts = async function (sessionId, startTime, endTime){
    logger.info('Services.shift.index.automateGenerateShifts', {'session-id': sessionId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'automateGenerateShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    if ((new Date(startTime)).getTime() > (new Date(endTime)).getTime() ||
        (new Date(startTime)).getTime() < (new Date()).getTime()) {
        return {'code': 409, 'err': constantString.shiftsCurrentTimeError};
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
        newShift.salesmanId = store.defaultSalesman;
        newShift.startTime = startTime;
        newShift.endTime = endTime;
        newShift.type = "טעימה";
        newShift.status = "CREATED";
        newShift.salesReport = newSaleReportSchema;
        newShift.sales = [];
        newShift.numOfKm = 0;
        newShift.parkingCost = 0;
        newShift.constraints = [];
        newShift.shiftComments = [];
        newShift.encouragements = [];
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
        return {'code': 401, 'err': constantString.permssionDenied};

    //get a list of shift Ids and user Ids from shiftArr @param
    let shiftIds = shiftArr.map(x => x._id);
    let uniqueUserIds = [];
    let userIds = shiftArr.map(x => x.salesmanId);
    for(let index in userIds) {
        //redundant check - needs to be checked in the validator level
        if(typeof(userIds[index]) != 'string')
            return {'code': 409, 'err': constantString.shiftWirhoutSalesmanError};
        if (index == userIds.indexOf(userIds[index]))
            uniqueUserIds.push(userIds[index]);
    }

    //get a list of shifts and users from db according to the ids lists
    //check that all id that we got as a parameter is a valid object in the db
    let dbShifts = await dal.getShiftsByIds(shiftIds);
    let dbUsers = await dal.getUsersByIds(uniqueUserIds);
    if(shiftIds.length != dbShifts.length)
        return {'code': 409, 'err': constantString.shiftDoedNotExist};
    if(uniqueUserIds.length != dbUsers.length)
        return {'code': 409, 'err': constantString.userDoesNotExist};
    for(let user of dbUsers)
        if(user.jobDetails.userType != 'salesman')
            return {'code': 409, 'err': constantString.userDoestSalesman};


    //check that all given shifts are on status 'CREATED'
    //change shifts' status to "PUBLISED"
    for(let shift of dbShifts)
        if(shift.status != 'CREATED')
            return {'code': 409, 'err': constantString.shiftAlreadyPublished};

    for(let shift of shiftArr)
        shift.status = 'PUBLISHED';
    let nonSavedShifts = await dal.publishShifts(shiftArr);

    if(nonSavedShifts.length == 0) {
        let shifts = await dal.getShiftsByIdsWithStores(shiftIds);
        _sendEmailsToAgents(shifts);
        return {'code': 200};
    }
    else
        return {'code': 200, 'nonSavedShifts': nonSavedShifts};

};

let getAllShiftsByStatus = async function(sessionId, status){
    logger.info('Services.shift.index.getAllShiftsByStatus', {'session-id': sessionId, 'status': status});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getAllShiftsByStatus', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    if(SHIFT_STATUS[status] == undefined){
        return {code: 409, err: constantString.noSuchShiftStatus};
    }

    let shifts = await dal.getShiftsByStatusFiltered(status);
    shifts = shifts.map(function(shift) {
        shift = shift.toObject();
        shift.salesman = shift.salesmanId;
        if(shift.salesmanId != undefined)
            shift.salesmanId = shift.salesman._id;
        return shift;
    });
    if(!shifts){
        return {code: 500, err: constantString.serverError};
    }
    return {code: 200, shifts: shifts};
};

let _sendEmailsToAgents = async function(shifts){
    let emails = new Set(shifts.map((shift) => shift.storeId.managerEmail));
    for(let email of emails){
        let shiftsOfEmails = shifts.filter((shift) => shift.storeId.managerEmail == email);
        let content = constantString.shiftsForAgentTitle_string + "\n\n";
        for(let shift of shiftsOfEmails){
            content += constantString.date_string + ": " + moment(shift.startTime).format('DD-MM-YYYY') + "\n";
            content += constantString.hours_string + ": " + moment(shift.startTime).format('HH:mm') + " - " + moment(shift.endTime).format('HH:mm') + "\n";
            content += constantString.city_string + ": " + shift.storeId.city + "\n";
            content += constantString.storeName_string + ": " + shift.storeId.name + "\n";
            content += constantString.salesmanName_string + ": " + shift.salesmanId.personal.firstName + shift.salesmanId.personal.lastName + "\n\n"
        }
        await mailer.sendMail([email], "IBBLS - new shifts", content);
    }
};

let getStoreShiftsByStatus = async function(sessionId, storeId, status){

    logger.info('Services.shift.index.getSalesmanFinishedShifts', {'session-id': sessionId, 'storeId': storeId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getStoreShiftsByStatus', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': constantString.permssionDenied};
    if(SHIFT_STATUS[status] == undefined){
        return {code: 409, err: constantString.noSuchShiftStatus};
    }
    let store = await dal.getStoresByIds([storeId]);
    if(store.length == 0)
        return {'code': 401, 'err': constantString.storeDoesNotExist};
    store = store[0];
    let storeShifts = await dal.getShiftsByStatus(status);
    let productsDict = {};
    let products = await dal.getAllProducts();
    for(let product of products)
        productsDict[product._id.toString()] = product;

    storeShifts = storeShifts.filter((shift) => shift.storeId._id.toString() == storeId);

    for(let shiftIndex in storeShifts){
        storeShifts[shiftIndex] = storeShifts[shiftIndex].toObject();
    }
    for(let currentShift of storeShifts){
        //currentShift = currentShift.toObject();
        currentShift.store = store;
        currentShift.storeId = store._id;

        for(let product of currentShift.salesReport) {

            let productDetails = productsDict[product.productId.toString()];
            product.name = productDetails.name;
            product.category = productDetails.category;
            product.subCategory = productDetails.subCategory;
            product.product = productDetails;
        }
    }
    return {'code': 200, 'shifts': storeShifts};
};

let getSalesmanFinishedShifts = async function(sessionId, salesmanId){
    logger.info('Services.shift.index.getSalesmanFinishedShifts', {'session-id': sessionId, 'userId': salesmanId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getSalesmanFinishedShifts', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    let salesman = await dal.getUserByobjectId(salesmanId);
    if(salesman == null)
        return {'code': 401, 'err': constantString.userDoesNotExist};

    let finishedShifts = await dal.getSalesmanShifts(salesman._id);
    if(finishedShifts == null)
        return {'code': 409, 'err': constantString.shiftSalesmanDoesntHaveShift};

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

    return {'code': 200, 'shifts': finishedShifts};


};

let getSalesmanLiveShift = async function(sessionId, salesmanId){
    logger.info('Services.shift.index.getSalesmanLiveShift', {'session-id': sessionId, 'userId': salesmanId});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getSalesmanLiveShift', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    let salesman = await dal.getUserByobjectId(salesmanId);
    if(salesman == null)
        return {'code': 401, 'err': constantString.userDoesNotExist};

    let shift = await dal.getSalesmanStartedShift(salesman._id);
    if(shift == null)
        return {'code': 200};

    return {'code': 200, 'shift': shift};

};

let getShiftsOfRange = async function(sessionId, startDate, endDate) {
    logger.info('Services.shift.index.getShiftsOfRange', {'session-id': sessionId, 'startDate': startDate, 'endDate': endDate});
    let isAuthorized = await permissions.validatePermissionForSessionId(sessionId, 'getShiftsOfRange', null);
    if(isAuthorized == null)
        return {'code': 401, 'err': constantString.permssionDenied};
    if((new Date(endDate)).getTime() - (new Date(startDate)).getTime() < 0)
        return {'code': 409, 'err': constantString.invalidDateRange};
    let shifts = await dal.getShiftsOfRange(startDate, endDate);
    if(shifts == null){
        return {'code': 409, 'err': constantString.somthingBadHappend};
    }

    return {'code': 200, 'shifts': shifts};
};

let getSalesmanCurrentShift = async function(sessionId, date){
    logger.info('Services.shift.index.getSalesmanCurrentShift', {'session-id': sessionId});

    let salesman = await dal.getUserBySessionId(sessionId);
    if(salesman == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    let currShift = await dal.getSalesmanCurrentShift(salesman._id, date);
    if(currShift == null)
        return {'code': 409, 'err': constantString.shiftSalesmanDoesntHaveShift};

    let productsDict = {};
    let products = await dal.getAllProducts();
    for(let product of products)
        productsDict[product._id] = product;

    currShift = currShift.toObject();
    currShift.store = (await dal.getStoresByIds([currShift.storeId]))[0];
    for(let product of currShift.salesReport) {
        product.name = productsDict[product.productId.toString()].name;
        product.subCategory = productsDict[product.productId.toString()].subCategory;
        product.category= productsDict[product.productId.toString()].category;
    }
    for(let sales of currShift.sales) {
        sales.name = productsDict[sales.productId.toString()].name;
        sales.subCategory = productsDict[sales.productId.toString()].subCategory;
    }
    return {'code': 200, 'shift': currShift};
};

let getSalesmanShifts = async function(sessionId){
    logger.info('Services.shift.index.getSalesmanShifts', {'session-id': sessionId});

    let salesman = await dal.getUserBySessionId(sessionId);
    if(salesman == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    let currShifts = await dal.getSalesmanShifts(salesman._id);
    if(currShifts == null)
        return {'code': 409, 'err': constantString.shiftSalesmanDoesntHaveShift};

    let productsDict = {};
    let products = await dal.getAllProducts();
    for(let product of products)
        productsDict[product._id] = product.name;

    for(let i = 0; i < currShifts.length; i++){
        currShifts[i] = currShifts[i].toObject();
        currShifts[i].store = (await dal.getStoresByIds([currShifts[i].storeId]))[0].toObject();
        for(let product of currShifts[i].salesReport) {
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
        return {'code': 409, 'err': constantString.shiftDoedNotExist};
    shift = shift[0];
    if(salesman == null || !(salesman._id.equals(shift.salesmanId)) || shift.status != 'STARTED')
        return {'code': 401, 'err': constantString.permssionDenied};

    return {'code': 200, 'shift': shift.toObject()};
};

let reportExpenses = async function(sessionId, shiftId, km, parking, extraExpenses){
    logger.info('Services.shift.index.reportExpenses', {'session-id': sessionId});
    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportExpenses', null);

    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if(shift == null)
        return {'code': 409, 'err': constantString.shiftDoedNotExist};

    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': 'user not authorized'};
    }

    if(km < 0 || parking < 0 || extraExpenses < 0)
        return {'code': 404, 'err': constantString.illegalkmOrParkingCost};
    shift.numOfKM = km;
    shift.parkingCost = parking;
    shift.extraExpenses = extraExpenses;

    let res = await dal.updateShift(shift);
    if(res.ok == 0)
        return {'shift': shift[0], 'code':400, 'err': constantString.somthingBadHappend};

    return {'shift': shift[0], 'code':200, 'err': null};

};

let getShiftsFromDate = async function(sessionId, fromDate){
    logger.info('Services.shift.index.getShiftsFromDate', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'getShiftsFromDate');
    if(salesman == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    let allShifts = await dal.getShiftsFromDate(fromDate, salesman._id);

    if(allShifts == null)
        return {'code': 500, 'err': constantString.somthingBadHappend};
    else
        return {'code': 200, 'shiftArr': allShifts};
};

let startShift = async function(sessionId, shift){
    logger.info('Services.shift.index.startShift', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'startShift');
    if(salesman == null || !salesman._id.equals(shift.salesmanId))
        return {'code': 401, 'err': constantString.permssionDenied};



    let shiftDb = await dal.getShiftsByIds([shift._id]);
    shiftDb = shiftDb[0];
    if(shiftDb == null)
        return {'code': 404, 'err': constantString.shiftDoedNotExist};

    if(shiftDb.status != 'PUBLISHED')
        return {'code': 403, 'err': constantString.shiftDoesNotPublished};

    if(!(shift.salesReport instanceof  Array))
        return {'code': 409, 'err': 'a sale report is required'};
    let productsDb = await dal.getAllProducts();
    productsDb = productsDb.map(x=>x._id.toString());
    let productsParam = shift.salesReport.map(x=>x.productId);

    //if((us.difference(productsDb, productsParam).length != 0) || (us.difference(productsParam, productsDb).length != 0))
     //   return {'code': 409, 'err': 'not a full sales report'};


    shiftDb.salesReport = shift.salesReport;
    shiftDb.status = 'STARTED';
    let result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': constantString.somthingBadHappend};
    else
        return {'code': 200};

};

let reportSale = async function(sessionId, shiftId, sales){
    logger.info('Services.shift.index.reportSale', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportSale', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (shift == null)
        return {'code': 409, 'err': constantString.shiftDoedNotExist};
    //check for all the quantity of sales
    for(let sale of sales){
        if(sale.quantity <= 0){
            return {'code': 409, 'err': 'problem with one or more of the parameters'};
        }
    }

    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': constantString.permssionDenied};
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
        return {'code': 409, 'err': constantString.productDoesNotExist};

    let result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': constantString.somthingBadHappend};
    else
        return {'code': 200}
};

let reportOpened = async function(sessionId, shiftId, opens){
    logger.info('Services.shift.index.reportOpened', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'reportOpened', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if (shift == null)
        return {'code': 409, 'err': constantString.shiftDoedNotExist};
    //check for all the quantity of sales
    for(let open of opens){
        if(open.quantity <= 0){
            return {'code': 409, 'err': constantString.illegalQuantity};
        }
    }

    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString()) {
        return {'code': 401, 'err': constantString.permssionDenied};
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
        return {'code': 409, 'err': constantString.productDoesNotExist};

    let result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': constantString.somthingBadHappend};
    else
        return {'code': 200}
};

let addShiftComment = async function(sessionId, shiftId, content){
    logger.info('Services.shift.index.addShiftComment', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'addShiftComment', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if(salesman == null || shift == null || !salesman._id.equals(shift.salesmanId))
        return {'code': 401, 'err': constantString.permssionDenied};

    shift.shiftComments.push(content);
    let result = await dal.updateShift(shift);
    if(result.ok != 1)
        return {'code': '500', 'err': constantString.somthingBadHappend};
    else
        return {'code': 200}
};

let finishStartedShifts = async function (){
    let shifts = await  dal.getShiftsByStatus('STARTED');
    if(shifts.length == 0)
        return {'code': 200};
    for(let shift of shifts){
        let res = await _endShift(shift._id.toString());
        if(res.code != 200)
            return res
    }
};

let endShift = async function(sessionId, shift){
    logger.info('Services.shift.index.endShift', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'endShift');
    if(salesman == null || !salesman._id.equals(shift.salesmanId))
        return {'code': 401, 'err': constantString.permssionDenied};

    let shiftDb = await dal.getShiftsByIds([shift._id]);
    shiftDb = shiftDb[0];
    if(shiftDb == null)
        return {'code': 404, 'err': constantString.shiftDoedNotExist};

    if(shiftDb.status != 'STARTED')
        return {'code': 403, 'err': constantString.shiftDoesnotStarted};

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
       return {'code': 500, 'err': constantString.somthingBadHappend};

    shiftDb.encouragements = encouragements;

    let result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': constantString.somthingBadHappend};
    else {
        let managers = await dal.getManagers();
        let emails  = [];
        for(let manager of managers){
            emails.push(manager.contact.email);
        }
        result = reportService.createXLSaleReport(shift._id.toString(), emails);
        return {'code': 200};
    }
};

let getActiveShiftEncouragements = async function(sessionId, shiftId){
    logger.info('Services.shift.index.getActiveShiftEncouragements', {'session-id': sessionId});

    let salesman = await permissions.validatePermissionForSessionId(sessionId, 'getActiveShiftEncouragements', null);
    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift.length == 0)
        return {'code': 409, 'err': constantString.shiftDoedNotExist};
    shift = shift[0];
    if(salesman == null || salesman._id.toString() != shift.salesmanId.toString())
        return {'code': 401, 'err': constantString.permssionDenied};

    let result = await encouragementServices.calculateEncouragements(shift.salesReport);
    if(result == null)
        return {'code': 500, 'err': constantString.somthingBadHappend};
    else
        return {'code': 200, 'encouragements': result};
};

let deleteShift = async function (sessionId, shiftId) {
    logger.info('Services.shift.index.deleteShift', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'deleteShift');
    if(user == null)
        return {'shift': null, 'code': 401, 'err': constantString.permssionDenied};

    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift[0] != null && shift[0].status == "STARTED")
        return {'shift': null, 'code': 401, 'err': constantString.shiftAlreadyStarted};

    shift = await dal.deleteShift(shiftId);
    return {'shift': shift, 'code':200, 'err': null};
};

let editShift = async function (sessionId, shiftDetails) {
    logger.info('Services.shift.index.editShift', {'session-id': sessionId});
    let user = await permissions.validatePermissionForSessionId(sessionId, 'editShift');
    if(user == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    let shift = await dal.getShiftsByIds([shiftDetails._id]);
    if(shift[0] != null && shift[0].status == "STARTED")
        return {'code': 401, 'err': constantString.shiftAlreadyStarted};

    if(shiftDetails.salesmanId != undefined && shiftDetails.salesmanId == "")
        shiftDetails.salesmanId = undefined;

    let res = await dal.editShift(shiftDetails);
    if(res.ok == 0)
        return {'code':400, 'err': constantString.shiftCannotBeEdited};

    return {'code':200, 'err': null};
};

let editSale = async function(sessionId, shiftId, productId, time, quantity){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'editSale');
    if(user == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    if(quantity < 0)
        return ({'code': 400, 'err': constantString.illegalQuantity});

    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift.length == 0)
        return {'code': 404, 'err': constantString.shiftDoedNotExist};

    shift = shift[0];

    let found = false;
    let diffQuant;
    for(let idx in shift.toObject().sales){
        let saleDate = new Date(shift.sales[idx].timeOfSale).getTime();
        let getTime = new Date(time).getTime();
        if(!found && shift.sales[idx].productId.toString() == (productId) &&  saleDate == getTime){
            diffQuant = shift.sales[idx].quantity - quantity;
            shift.sales[idx].quantity = quantity;
            found = true;
           // if(quantity == 0){
           //     shift.sales.splice(idx, 1);
          //  }
        }
    }

    if(!found)
        return {'code': 404, 'err': constantString.productDoesNotExist};

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
    let user = await permissions.validatePermissionForSessionId(sessionId, 'updateSalesReport');
    if(user == null) {
        return {'shift': null, 'code': 401, 'err': 'permission denied'};
    }
    let shift = await dal.getShiftsByIds([shiftId]);
    if(shift[0] != null && shift[0].status != "FINISHED")
        return {'shift': null, 'code': 401, 'err': constantString.shiftNotFinished};
    shift = shift[0].toObject();
    let salesReport = shift.salesReport;
    for(let i in salesReport){

        if(salesReport[i].productId.toString() == productId){
            salesReport[i].sold = newSold;
            salesReport[i].opened = newOpened;
        }
    }

    let newEncouragements = await encouragementServices.calculateEncouragements(shift.salesReport);
    let res = await dal.editSalesReport(shift._id, shift.salesReport, newEncouragements);

    if(res.ok == 0)
        return {'shift': shift, 'code':400, 'err': constantString.shiftCannotBeEdited};

    return {'shift': shift, 'code':200, 'err': null};

};

let managerEndShift = async function(sessionId, shiftId){
    logger.info('Services.shift.index.managerEndShift', {'session-id': sessionId});

    let user = await permissions.validatePermissionForSessionId(sessionId, 'managerEndShift');
    if(user == null)
        return {'code': 401, 'err':constantString.permssionDenied};

    let res  = await _endShift(shiftId);
    return res
};

let submitConstraints = async function(sessionId, constraints){
    logger.info('Services.shift.index.submitConstrains', {'session-id': sessionId});

    let user = await permissions.validatePermissionForSessionId(sessionId, 'submitConstraints');
    if(user == null)
        return {'code': 401, 'err':constantString.permssionDenied};

    for(let date in constraints){
        for(let area in constraints[date]){
            let constraint = constraints[date][area];
            constraint.salesmanId = user._id;
            let remove = await dal.removeConstraints(new Date(date), area, user._id);
            let add = await dal.setConstraints(new Date(date), area, constraint);
        }
    }
    return {'code': 200};

};

let deleteCreatedShifts = async function(sessionId, idsArr) {
    logger.info('Services.shift.index.deleteCreatedShifts', {'session-id': sessionId});

    let user = await permissions.validatePermissionForSessionId(sessionId, 'deleteCreatedShifts');
    if(user == null)
        return {'code': 401, 'err':constantString.permssionDenied};
    try {
        let result = await dal.removeCreatedShifts(idsArr);
        return {code: 200};
    }
    catch(err){
        return {code: 500, err: constantString.deleteError};
    }


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

let _endShift = async function(shiftId){
    let shiftDb = await dal.getShiftsByIds([shiftId]);
    shiftDb = shiftDb[0];
    if(shiftDb == null)
        return {'code': 404, 'err': constantString.shiftDoedNotExist};

    if(shiftDb.status != 'STARTED')
        return {'code': 403, 'err': constantString.shiftDoesnotStarted};

    shiftDb.status = 'FINISHED';
    for(let product of shiftDb.salesReport){
        product.stockEndShift = product.stockStartShift;
    }

    let encouragements = await encouragementServices.calculateEncouragements(shiftDb.salesReport);
    if(encouragements == null)
        return {'code': 500, 'err': constantString.somthingBadHappend};

    shiftDb.encouragements = encouragements;

    let result = await dal.updateShift(shiftDb);
    if(result.ok != 1)
        return {'code': 500, 'err': constantString.somthingBadHappend};
    else{
        let managers = await dal.getManagers();
        let emails  = [];
        for(let manager of managers){
            emails.push(manager.contact.email);
        }
        result = reportService.createXLSaleReport(shiftId, emails);
        return {'code': 200};
    }
};

module.exports.addShifts = addShifts;
module.exports.publishShifts = publishShifts;
module.exports.getSalesmanCurrentShift = getSalesmanCurrentShift;
module.exports.startShift = startShift;
module.exports.endShift = endShift;
module.exports.reportSale = reportSale;
module.exports.reportOpened = reportOpened;
module.exports.managerEndShift = managerEndShift;
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
module.exports.getShiftsOfRange = getShiftsOfRange;
module.exports.getSalesmanLiveShift = getSalesmanLiveShift;
module.exports.getAllShiftsByStatus = getAllShiftsByStatus;
module.exports.submitConstraints = submitConstraints;
module.exports.getStoreShiftsByStatus = getStoreShiftsByStatus;
module.exports.finishStartedShifts = finishStartedShifts;
module.exports.deleteCreatedShifts = deleteCreatedShifts;
