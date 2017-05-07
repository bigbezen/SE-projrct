let dal             = require('../../DAL/dal');

let users      = require('../../Models/user');
let shifts      = require('../../Models/shift');
let messages       = require('../../Models/message');
let products       = require('../../Models/product');
let stores       = require('../../Models/store');
let encs       = require('../../Models/encouragement');
let MAReport    = require('../../Models/Reports/monthAnalysisReport');
let SMHReport   = require('../../Models/Reports/SummaryMonthlyHoursReport');


let cleanDb = async function(){
    let result = await users.remove({'username': {$ne: 'admin'}});
    result = await shifts.remove({});
    result = await messages.remove({});
    result = await products.remove({});
    result = await stores.remove({});
    result = await encs.remove({});
    result = await MAReport.remove({});
    result = await SMHReport.remove({});
    return result;
};

let cleanUsers = async function(){
    let result = await users.remove({'username': {$ne: 'admin'}});
    return result;
};

let cleanShifts = async function(){
    let result = await shifts.remove({});
    return result;
};

let cleanMessages = async function() {
    let result = await messages.remove({});
    return result;
};

let cleanProducts = async function(){
    let result = await products.remove({});
    return result;
};

let cleanStores = async function(){
    let result = await stores.remve({});
    return result;
};

let cleanEncs = async function() {
    let result = await encs.remove({});
    return result;
};

let cleanMAReport = async function(){
    let result = MAReport.remove({});
    return result;
};

let cleanSMHReport = async function(){
    let result = SMHReport.remove({});
    return result;
};


module.exports.cleanDb = cleanDb;
module.exports.cleanUsers = cleanUsers;
module.exports.cleanStores = cleanStores;
module.exports.cleanShifts = cleanShifts;
module.exports.cleanMessages = cleanMessages;
module.exports.cleanProducts = cleanProducts;
module.exports.cleanEncs = cleanEncs;
module.exports.cleanMAReports = cleanMAReport;
module.exports.cleanSMHReports = cleanSMHReport;


















