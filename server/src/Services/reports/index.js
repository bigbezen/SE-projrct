let logger          = require('../../Utils/Logger/logger');
let permissions     = require('../permissions/index');
let dal             = require('../../DAL/dal');
let mailer          = require('../../Utils/Mailer/index');
let fs              = require('fs');
var moment          = require('moment');
let Excel           = require('exceljs');
let userService     = require('../../Services/user');
let monthlyUserHoursReportModel = require('../../Models/Reports/SummaryMonthlyHoursReport');

let getSaleReportXl =  async function(sessionId, shiftId){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getSaleReportXl');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let shift = await dal.getShiftsByIds([shiftId]);
    shift = shift[0];
    if(shift == null)
        return {'code': 404, 'err': 'shift not exist'};

    let store = await dal.getStoresByIds([shift.storeId]);
    store = store[0];
    if(store == null)
        return {'code': 404, 'err': 'store not exist'};

    if(shift.status != 'FINISHED')
        return {'code': 404, 'err': 'shift not finished status'};

    let salesman = await dal.getUsersByIds([shift.salesmanId]);
    salesman = salesman[0];

    let workbook = new Excel.Workbook();

    workbook.xlsx.readFile('saleReport.xlsx')
        .then(async function() {
            let worksheet = workbook.getWorksheet(1);

            //write the store name
            let row = worksheet.getRow(9);
            row.getCell(2).value = store.name; // B9's value
            row.commit();

            //write the shift date
            row = worksheet.getRow(9);
            row.getCell(5).value = shift.startTime.toDateString(); // E9's value
            row.commit();

            //write the salesman name
            row = worksheet.getRow(11);
            row.getCell(5).value = salesman.username; // E11's value
            row.commit();

            //write start time
            row = worksheet.getRow(13);
            row.getCell(2).value = shift.startTime.toTimeString(); // E11's value
            row.commit();

            //write finish time
            row = worksheet.getRow(13);
            row.getCell(5).value = shift.endTime.toTimeString(); // E11's value
            row.commit();

           //write the shift comment
            let comments = "";
            for (let i = 0; i < shift.shiftComments.length; i++) {
                comments = comments + shift.shiftComments[i] + "\n";
            }
            row = worksheet.getRow(90);
            row.getCell(1).value = comments; // A90's value
            row.commit();

            //write the sales
            for (let i = 0; i < shift.salesReport.length; i++) {
                let product = await dal.getProductById(shift.salesReport[i].productId);
                if (shift.salesReport[i].sold > 0) {
                    row = worksheet.getRow(58 + i);
                    row.getCell(1).value = product.subCategory;
                    row.getCell(2).value = product.name;
                    row.getCell(4).value = shift.salesReport[i].sold;
                    row.commit();
                }

                if(shift.salesReport[i].opened > 0) {
                    //opened battle
                    row = worksheet.getRow(45 + i);
                    row.getCell(1).value = product.subCategory;
                    row.getCell(2).value = product.name;
                    row.getCell(4).value = shift.salesReport[i].opened;
                    row.commit();
                }
            }
            return workbook.xlsx.writeFile(__dirname + '\\sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + '.xlsx');
        });

    let content = ' מצורף דוח טעימות של:' + salesman.username;
    mailer.sendMailWithFile([user.contact.email, salesman.contact.email], 'IBBLS - דוח טעימות של '+ salesman.username, content, __dirname+'\\sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + '.xlsx');
    return {'code': 200};
};

let getMonthlyHoursSalesmansReportXl = async function(sessionId, year, month){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getMonthlyUserHoursReportXl');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let report = await dal.getMonthlyUserHoursReport(year, month);
    if(report == null)
        return {'code': 404, 'err': 'report still not genarated'};

    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile('monthlyHoursReport.xlsx')
        .then(async function() {
            let worksheet = workbook.getWorksheet('ריכוז שעות ותמריצים');
            //write the month and the year
            //write the store name
            let row = worksheet.getRow(1);
            row.getCell(2).value = report.month + 1; // B1's value
            row.getCell(4).value = report.year; // D1's value
            row.commit();

            //write the head of the table
            row = worksheet.getRow(3);
            row.getCell(1).value = 'דיילים';
            row.getCell(1).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'99CCF0FF'},
                bgColor:{argb:'99CCF0FF'}
            };
            row.getCell(1).border = {
                top: {style:'medium'},
                left: {style:'medium'},
                bottom: {style:'medium'},
                right: {style:'medium'}
            };

            //write total hours of shift
            row.getCell(2).value = 'שעות דיול';
            row.getCell(2).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'99CCF0FF'},
                bgColor:{argb:'99CCF0FF'}
            };
            row.getCell(2).border = {
                top: {style:'medium'},
                left: {style:'medium'},
                bottom: {style:'medium'},
                right: {style:'medium'}
            };

            //write all the encouragements
            let encouragemnets = await dal.getAllEncouragements();
            let col = 3;
            for(let enc of encouragemnets){
                if(enc.active){
                    row.getCell(col).value = enc.name;
                    row.getCell(col).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'99CCF0FF'},
                        bgColor:{argb:'99CCF0FF'}
                    };

                    row.getCell(col).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    col = col + 1;
                }
            }

            let encMaxCol = col;
            let rowNum = 4;
            let encRow = worksheet.getRow(3);
            //foreach user write the total number shifts hours and ecourangements
            for(let userData of report.salesmansData){
                col = 1;
                row = worksheet.getRow(rowNum);
                let userDB = await dal.getUserByobjectId(userData.user);
                row.getCell(col).value = userDB.personal.firstName + ' ' + userDB.personal.lastName;
                row.getCell(col).border = {
                    top: {style:'medium'},
                    left: {style:'medium'},
                    bottom: {style:'medium'},
                    right: {style:'medium'}
                };
                col = col + 1;

                //add shift hours
                row.getCell(col).value = userData.numOfHours;
                row.getCell(col).border = {
                    top: {style:'medium'},
                    left: {style:'medium'},
                    bottom: {style:'medium'},
                    right: {style:'medium'}
                };
                col = col + 1;

                for(let encUser of userData.monthlyEncoragement){
                    for(let i = col ; i <= encMaxCol; i++) {
                        let encDB = await dal.getEncouragement(encUser.encouragemant);
                        if (encRow.getCell(i).value == encDB.name) {
                            row.getCell(i).value = encUser.amount;
                            row.getCell(i).border = {
                                top: {style:'medium'},
                                left: {style:'medium'},
                                bottom: {style:'medium'},
                                right: {style:'medium'}
                            };
                        }
                    }
                }
                rowNum++;
            }

            //add total row
            col = 1;
            row = worksheet.getRow(rowNum);
            row.getCell(col).font = {'bold':true, 'size':13};
            row.getCell(col).value = 'סה"כ';
            row.getCell(col).border = {
                top: {style:'medium'},
                left: {style:'medium'},
                bottom: {style:'medium'},
                right: {style:'medium'}
            };
            col = col + 1;

            for(let j = col; j < encMaxCol; j++) {
                let count = 0;
                let rowCount;
                for (let t = 4; t < rowNum; t++) {
                    rowCount = worksheet.getRow(t);
                    count += rowCount.getCell(j).value;
                }

                rowCount = worksheet.getRow(rowNum);
                rowCount.getCell(j).font = {'bold':true, 'size':13};
                rowCount.getCell(j).value = count;
                rowCount.getCell(j).border = {
                    top: {style: 'medium'},
                    left: {style: 'medium'},
                    bottom: {style: 'medium'},
                    right: {style: 'medium'}
                };
            }
            return workbook.xlsx.writeFile('monthReport/דוח שעות דיול חודשי '+ (month + 1) + ' ' + year + '.xlsx');
        });

    let content = ' מצורף דוח סיכום שעות דיול חודשי:' + (month + 1) + ' ' + year;
    mailer.sendMailWithFile(['matanbezen@gmail.com'], 'IBBLS - דוח סיכום שעות דיול חודשי ' + (month + 1) + ' ' + year, content, 'monthReport/דוח שעות דיול חודשי '+ (month + 1) + ' ' + year + '.xlsx');
    return {'code': 200};

};

let getMonthlyUserHoursReport = async function(sessionId, year, month){
    let aut = await permissions.validatePermissionForSessionId(sessionId, 'getMonthlyUserHoursReport');
    if(aut == null)
        return {'code': 401, 'err': 'user not authorized'};

    let report = await dal.getMonthlyUserHoursReport(year, month);
    if(report == null)
        return {'code': 404, 'err': 'report still not genarated'};

    report = report.toObject();
    for(let userData of report.salesmansData){
       let user = await dal.getUserByobjectId(userData.user);
        userData.user = user.personal.firstName + ' ' + user.personal.lastName;
        for(let enc of userData.monthlyEncoragement){
            let encDB = await dal.getEncouragement(enc.encouragement);
            enc.encouragement = encDB;
        }
    }

    return {'report': report, 'code': 200, 'err': null};
};

let genarateMonthlyUserHoursReport = async function() {
    let date = new Date();
    let report = new monthlyUserHoursReportModel();
    let shifts = await dal.getMonthShifts(date.getFullYear(), date.getMonth());
    let users = await dal.getAllUsers();

    //add month and year
    report.month = date.getMonth();
    report.year = date.getFullYear();

    //initilize all users
    for(let user of users) {
        if (user.jobDetails.userType == 'salesman') {
            let salesmanData = {
                'user': user,
                'numOfHours': 0,
                'monthlyEncoragement': []
            };
            let encouragements = await userService.getMonthlyEncouragements(user.username, report.year, report.month);
            salesmanData.monthlyEncoragement = encouragements;
            //count the total shift hours of user
            for (let shift of shifts){
                if(shift.salesmanId.equals(user._id)){
                    let duration = (shift.endTime - shift.startTime)/36e5;
                    salesmanData.numOfHours += duration;
                }
            }

            report.salesmansData.push(salesmanData);
        }
    }

    let res = await dal.addMonthlySalesmanReport(report);
    return {'report': res ,'code': 200 ,'err': null};
};

let genarateMonthAnalysisReport = async function() {
    console.log('genarateMonthAnalysisReport');
   /* let date = new Date();
    let report = new monthlyUserHoursReportModel();
    let shifts = await dal.getMonthShifts(date.getFullYear(), date.getMonth());
    let users = await dal.getAllUsers();

    //add month and year
    report.month = date.getMonth();
    report.year = date.getFullYear();

    //initilize all users
    for(let user of users) {
        if (user.jobDetails.userType == 'salesman') {
            let salesmanData = {
                'user': user,
                'numOfHours': 0,
                'monthlyEncoragement': []
            };
            let encouragements = await userService.getMonthlyEncouragements(user.username, report.year, report.month);
            salesmanData.monthlyEncoragement = encouragements;
            //count the total shift hours of user
            for (let shift of shifts){
                if(shift.salesmanId.equals(user._id)){
                    let duration = (shift.endTime - shift.startTime)/36e5;
                    salesmanData.numOfHours += duration;
                }
            }

            report.salesmansData.push(salesmanData);
        }
    }

    let res = await dal.addMonthlySalesmanReport(report);
    return {'report': res ,'code': 200 ,'err': null};*/
};


module.exports.getSaleReportXl = getSaleReportXl;
module.exports.getMonthlyUserHoursReport = getMonthlyUserHoursReport;
module.exports.genarateMonthlyUserHoursReport = genarateMonthlyUserHoursReport;
module.exports.getMonthlyHoursSalesmansReportXl = getMonthlyHoursSalesmansReportXl;
module.exports.genarateMonthAnalysisReport = genarateMonthAnalysisReport;