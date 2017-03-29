let logger          = require('../../Utils/Logger/logger');
let permissions     = require('../permissions/index');
let dal             = require('../../DAL/dal');
let mailer          = require('../../Utils/Mailer/index');
let fs              = require('fs');
let moment          = require('moment');
let Excel           = require('exceljs');
let userService     = require('../../Services/user');
let monthlyUserHoursReportModel = require('../../Models/Reports/SummaryMonthlyHoursReport')
let days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

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
            let salesSpiritRow = 58;
            let salesWeinRow = 58;
            let openedSpritRow = 45;
            let openedWeinRow = 45;
            let shortageRow = 18;
            for (let i = 0; i < shift.salesReport.length; i++) {
                let product = await dal.getProductById(shift.salesReport[i].productId);
                if (shift.salesReport[i].sold > 0) {
                    if(product.category == 'ספיריט') {
                        row = worksheet.getRow(salesSpiritRow);
                        row.getCell(1).value = product.subCategory;
                        row.getCell(2).value = product.name;
                        row.getCell(4).value = shift.salesReport[i].sold;
                        salesSpiritRow = salesSpiritRow + 1;
                    }
                    else{
                        row = worksheet.getRow(salesWeinRow);
                        row.getCell(7).value = product.subCategory;
                        row.getCell(8).value = product.name;
                        row.getCell(9).value = shift.salesReport[i].sold;
                        salesWeinRow = salesWeinRow + 1;
                    }
                    row.commit();
                }

                if(shift.salesReport[i].opened > 0) {
                    //opened battle
                    if(product.category == 'ספיריט') {
                        row = worksheet.getRow(openedSpritRow);
                        row.getCell(1).value = product.subCategory;
                        row.getCell(2).value = product.name;
                        row.getCell(4).value = shift.salesReport[i].opened;
                        openedSpritRow = openedSpritRow + 1;
                    }
                    else {
                        row = worksheet.getRow(openedWeinRow);
                        row.getCell(6).value = product.subCategory;
                        row.getCell(7).value = product.name;
                        row.getCell(8).value = shift.salesReport[i].opened;
                        openedWeinRow = openedWeinRow + 1;
                    }
                    row.commit();
                }

                if(shift.salesReport[i].stockEndShift == 0) {
                    //shortage battle
                    row = worksheet.getRow(shortageRow);
                    row.getCell(1).value = product.subCategory;
                    row.getCell(2).value = product.name;
                    shortageRow = shortageRow + 1;
                    row.commit();
                }
            }
            return workbook.xlsx.writeFile( 'salesReports/sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + '.xlsx');
        });

    let content = ' מצורף דוח טעימות של:' + salesman.username;
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - דוח טעימות של '+ salesman.username, content, 'salesReports/sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + '.xlsx');
    return {'code': 200};
};

let getSalaryForHumanResourceReport = async function(sessionId, year, month){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getSalaryForHumanResourceReport');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile('salaryForHumanResourceReport.xlsx')
        .then(async function() {
            let salesman = await dal.getAllSalesman();
            let sheetNum = 1;
            let user;
            for(user of salesman){
                let worksheet = workbook.getWorksheet(sheetNum);
                worksheet.name = user.personal.firstName + ' ' + user.personal.lastName;
                worksheet.properties = {tabColor :{argb : 'FFC0000'}};

                //write the year and month
                let row = worksheet.getRow(1);
                row.getCell(3).value = month + ' - ' + year; //C1

                //write the salesman name
                row = worksheet.getRow(3);
                row.getCell(3).value = user.contact.address.street + ' ' + user.contact.address.number + ' ' + user.contact.address.city; //C3

                //write the salesman address
                row = worksheet.getRow(2);
                row.getCell(3).value = user.personal.firstName + ' ' + user.personal.lastName; //C2

                //write the salesman salary per hour
                row = worksheet.getRow(4);
                row.getCell(3).value = user.jobDetails.salary;//C4


                //write the encouragements names
                let allEnc = await dal.getAllEncouragements();
                for(let i = 0; i < allEnc.length; i++){
                    row = worksheet.getRow(7);
                    row.getCell(18 + i).value = allEnc[i].name;//R+i7
                }

                //add all the shifts and the encouragements
                let salesmanShifts = await dal.getSalesmanMonthShifts(user._id, year, month);
                for(let j  = 0; j < salesmanShifts.length + 0; j++){
                    let currentShift = salesmanShifts[j];
                    row = worksheet.getRow(j + 8);
                    row.getCell(1).value = new Date(currentShift.startTime).getDate() + '.' + (new Date(currentShift.startTime).getMonth() + 1) + '.' + new Date(currentShift.startTime).getFullYear();
                    row.getCell(2).value = days[new Date(currentShift.startTime).getDay()];
                    let shiftStore = (await dal.getStoresByIds([currentShift.storeId]))[0];
                    row.getCell(3).value = shiftStore.name;
                    row.getCell(4).value = shiftStore.city;
                    row.getCell(5).value = currentShift.type;
                    row.getCell(6).value = new Date(currentShift.startTime);
                    row.getCell(7).value = new Date(currentShift.endTime);
                    row.getCell(15).value = 100;

                    row.commit();
                }

                sheetNum = sheetNum + 1;
            }
            return workbook.xlsx.writeFile('monthReport/salaryForHumanResourceReport.xlsx');
        });

//    let content = ' מצורף דוח סיכום שעות דיול חודשי:' + (month + 1) + ' ' + year;
 //   mailer.sendMailWithFile(['matanbezen@gmail.com'], 'IBBLS - דוח סיכום שעות דיול חודשי ' + (month + 1) + ' ' + year, content, 'monthReport/דוח שעות דיול חודשי '+ (month + 1) + ' ' + year + '.xlsx');
    return {'code': 200};
};

let getSalesmanListXL = async function(sessionId){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getSalesmanListXL');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile('salesmanList.xlsx')
        .then(async function() {
            let worksheet = workbook.getWorksheet(1);
            let allSalesman = await dal.getAllUsers();
            let rowNum = 3;
            for(let salesman of allSalesman){
                let row = worksheet.getRow(rowNum);
                if(salesman.jobDetails.userType = 'salesman'){
                    row.getCell(1).value = salesman.personal.lastName;
                    row.getCell(1).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(2).value = salesman.personal.firstName;
                    row.getCell(2).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(3).value = salesman.personal.id;
                    row.getCell(3).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(4).value = salesman.personal.birthday;
                    row.getCell(4).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(5).value = salesman.startDate;
                    row.getCell(5).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(6).value = salesman.contact.address.street;
                    row.getCell(6).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(7).value = salesman.contact.address.number;
                    row.getCell(7).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(8).value = salesman.contact.address.city;
                    row.getCell(8).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(9).value = salesman.contact.address.zip;
                    row.getCell(9).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(10).value = salesman.contact.phone;
                    row.getCell(10).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.commit();
                    rowNum = rowNum + 1;
                }
            }

            return workbook.xlsx.writeFile( 'salesReports/salesmanListReport.xlsx');
        });

    let content = 'מצורף רשימת דיילים נכון ל ' + new Date();
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - רשימת דיילים ', content, 'salesReports/salesmanListReport.xlsx');
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
module.exports.getSalaryForHumanResourceReport = getSalaryForHumanResourceReport;
module.exports.getSalesmanListXL = getSalesmanListXL;