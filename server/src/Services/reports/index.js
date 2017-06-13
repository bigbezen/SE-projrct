let logger          = require('../../Utils/Logger/logger');
let mongoose    = require('mongoose');
let permissions     = require('../permissions/index');
let dal             = require('../../DAL/dal');
let mailer          = require('../../Utils/Mailer/index');
let fs              = require('fs');
let moment          = require('moment');
let Excel           = require('exceljs');
let userModel       = require('../../Models/user');
let constantString  = require('../../Utils/Constans/ConstantStrings.js');
let monthlyUserHoursReportModel = require('../../Models/Reports/SummaryMonthlyHoursReport');
let monthAnalysisReportModel = require('../../Models/Reports/monthAnalysisReport');
let days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
let encCategory = [constantString.encCatagoryManager, constantString.encCatagorywiskey,constantString.encCatagoryCampary, constantString.encCatagoryVodks, constantString.encCatagoryTavor, constantString.encCatagoryBerdens];
let encouragementFactor = 0.0376;

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
            return workbook.xlsx.writeFile( 'salesReports/sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + ' ' + store.name + '.xlsx');
        });

    let content = ' מצורף דוח טעימות של:' + salesman.username;
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - דוח טעימות של '+ salesman.username + ' '  + store.name + ' ' + shift.startTime.toDateString(), content, 'salesReports/sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + ' ' + store.name + '.xlsx');
    return {'code': 200};
};

let createXLSaleReport =  async function(shiftId, emails){
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
            return workbook.xlsx.writeFile( 'salesReports/sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + ' ' + store.name + '.xlsx');
        });

    let content = ' מצורף דוח טעימות של:' + salesman.username;
    mailer.sendMailWithFile(emails, 'IBBLS - דוח טעימות של '+ salesman.username + ' '  + store.name + ' ' + shift.startTime.toDateString(), content, 'salesReports/sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + ' ' + store.name + '.xlsx');
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
                    row.getCell(6).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(7).value = salesman.contact.address.street;
                    row.getCell(7).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(8).value = salesman.contact.address.number;
                    row.getCell(8).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(9).value = salesman.contact.address.city;
                    row.getCell(9).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(10).value = salesman.contact.address.zip;
                    row.getCell(10).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.getCell(11).value = salesman.contact.phone;
                    row.getCell(11).border = {
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

let getOrderEventReportXL = async function(sessionId, year, month){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getOrderEventReportXL');
    if(user == null)
        return {'code': 401, 'err': constantString.permssionDenied};

    let eventShifts = await dal.getEventShifts(year, month);
    let eventsName = new  Set();
    for(let shift of eventShifts){
        eventsName.add(shift.type);
    }

    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile('orderJob.xlsx')
        .then(async function() {
            for(let eventName of eventsName){
                let worksheet = workbook.addWorksheet(eventName);
                let shifts = eventShifts.filter(function (shift) {
                    return shift.type == eventName;
                });

                let setStoresName = new Set();
                for(let shift of shifts){
                    setStoresName.add(shift.storeId.name);
                }

                let rowCount = 1;
                for(let storeName of setStoresName){
                    rowCount++;
                    rowCount++;
                    let currentsShifts = shifts.filter(function (shift) {
                       return shift.storeId.name == storeName;
                    });

                    //write the event type
                    let row = worksheet.getRow(rowCount);
                    row.getCell(2).value = 'שם האירוע';
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
                    row.getCell(3).value = storeName;
                    row.getCell(3).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'99CCF0FF'},
                        bgColor:{argb:'99CCF0FF'}
                    };
                    row.getCell(3).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.commit();
                    rowCount++;
                    rowCount++;

                    row = worksheet.getRow(rowCount);
                    row.getCell(1).value = 'תאריך';
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

                    row.getCell(2).value = 'שם העובדת';
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

                    row.getCell(3).value = 'מס שעות העבודה';
                    row.getCell(3).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'99CCF0FF'},
                        bgColor:{argb:'99CCF0FF'}
                    };
                    row.getCell(3).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };

                    row.getCell(4).value = 'נסיעות';
                    row.getCell(4).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'99CCF0FF'},
                        bgColor:{argb:'99CCF0FF'}
                    };
                    row.getCell(4).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };

                    row.getCell(5).value = 'סה"כ לתשלום';
                    row.getCell(5).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'99CCF0FF'},
                        bgColor:{argb:'99CCF0FF'}
                    };
                    row.getCell(5).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                    row.commit();
                    rowCount++;

                    for(let shift of currentsShifts){
                        row = worksheet.getRow(rowCount);
                        row.getCell(1).value = new Date(shift.startTime).toLocaleString();
                        row.getCell(1).border = {
                            top: {style:'medium'},
                            left: {style:'medium'},
                            bottom: {style:'medium'},
                            right: {style:'medium'}
                        };

                        row.getCell(2).value = shift.salesmanId.personal.firstName + " " + shift.salesmanId.personal.lastName;
                        row.getCell(2).border = {
                            top: {style:'medium'},
                            left: {style:'medium'},
                            bottom: {style:'medium'},
                            right: {style:'medium'}
                        };

                        let duration = parseInt((shift.endTime - shift.startTime)/36e5, 10);
                        row.getCell(3).value = duration;
                        row.getCell(3).border = {
                            top: {style:'medium'},
                            left: {style:'medium'},
                            bottom: {style:'medium'},
                            right: {style:'medium'}
                        };
                        if(shift.numOfKM != null && shift.parkingCost != null){
                            row.getCell(4).value = shift.numOfKM * 0.7 + shift.parkingCost;
                        }
                        else{
                            row.getCell(4).value = 0;
                        }
                        row.getCell(4).border = {
                            top: {style:'medium'},
                            left: {style:'medium'},
                            bottom: {style:'medium'},
                            right: {style:'medium'}
                        };

                        if(shift.numOfKM != null && shift.parkingCost != null){
                            let expensesCost = shift.numOfKM * 0.7 + shift.parkingCost;
                            row.getCell(5).value = _calcEventCost(duration, expensesCost);
                        }
                        else{
                            row.getCell(5).value = _calcEventCost(duration, 0);
                        }

                        row.getCell(5).border = {
                            top: {style:'medium'},
                            left: {style:'medium'},
                            bottom: {style:'medium'},
                            right: {style:'medium'}
                        };
                        row.commit();
                        rowCount++;
                    }

                    row = worksheet.getRow(rowCount);
                    row.getCell(4).value = 'סה"כ';
                    row.getCell(4).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'99FFFF00'},
                        bgColor:{argb:'99FFFF00'}
                    };
                    row.getCell(4).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };

                    row.getCell(5).value = {'formula':'SUM(E' + (rowCount - currentsShifts.length) + ':E' + (rowCount - 1) + ')'};
                    row.getCell(5).fill = {
                        type: 'pattern',
                        pattern:'solid',
                        fgColor:{argb:'99FFFF00'},
                        bgColor:{argb:'99FFFF00'}
                    };
                    row.getCell(5).border = {
                        top: {style:'medium'},
                        left: {style:'medium'},
                        bottom: {style:'medium'},
                        right: {style:'medium'}
                    };
                }
            }

            return workbook.xlsx.writeFile('monthReport/הזמנת עבודה' + (month + 1) + '.xlsx');
   });
    let content = 'מורף הזמנת עבודה לחודש ' + (month + 1) + ' ' + year;
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - דוח הזמנת עבודה ' + (month + 1) + ' ' + year, content, 'monthReport/הזמנת עבודה' + (month + 1) + '.xlsx');

    return {'code': 200};
};

let getMonthAnalysisReportXL = async function(sessionId, year){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getMonthAnalysisReportXL');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let report = await dal.getMonthAnalysisReport(year);
    if(report == null)
        return {'code': 404, 'err': 'report still not genarated'};

    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile('monthAnalysisReport.xlsx')
        .then(async function() {
            let formArr = ['SUM(B5:B16)','SUM(C5:C16)','SUM(D5:D16)','SUM(E5:E16)','SUM(F5:F16)','SUM(G5:G16)','SUM(H5:H16)','SUM(I5:I16)','SUM(J5:J16)','SUM(K5:K16)','SUM(L5:L16)','SUM(M5:M16)','SUM(N5:N16)','SUM(O5:O16)','SUM(P5:P16)','SUM(Q5:Q16)','SUM(R5:R16)','SUM(S5:S16)','SUM(T5:T16)','SUM(U5:U16)','SUM(V5:V16)','SUM(W5:W16)','SUM(X5:X16)','SUM(Y5:Y16)','SUM(Z5:Z16)','SUM(AA5:AA16)','SUM(AB5:AB16)','SUM(AC5:AC16)','SUM(AD5:AD16)','SUM(AE5:AE16)','SUM(AF5:AF16)','SUM(AG5:AG16)'];
            let worksheet = workbook.getWorksheet(1);
            worksheet.name = year;
            let row = worksheet.getRow(2);
            row.getCell(3).value = 'ניתוח כללי ' + year;
            let monthRow = 4;
            let encouragement = await dal.getAllEncouragements();
            for(let i = 0; i < encCategory.length; i++){
                row = worksheet.getRow(monthRow);
                row.getCell(6 + i).value = encCategory[i];
            }

            let monthCol;
            for(let monthData of report.monthData){
                monthCol =  3;//16;
                row = worksheet.getRow(monthRow + monthData.month);
                //row.getCell(monthCol).value = 1;
                //salesman cost
                row.getCell(monthCol).value = monthData.salesmanCost.traditionalHot;
                monthCol++;
                row.getCell(monthCol).value = monthData.salesmanCost.organized;
                monthCol++;
                row.getCell(monthCol).value = monthData.salesmanCost.traditionalOrganized;
                monthCol++;

                //write all the encouragement
                for(let j = 0; j < encCategory.length; j++){
                    for(let enc of monthData.monthlyEncoragement){
                        if(enc.encouragement.name.includes(encCategory[j])){
                            row.getCell(monthCol).value = enc.amount;
                            monthCol++;
                        }
                    }
                }
                monthCol = 15;
                //total hours
                row.getCell(monthCol).value = monthData.salesmanCost.events;
                monthCol++;
                row.getCell(monthCol).value = monthData.totalHours.traditionalHot;
                monthCol++;
                row.getCell(monthCol).value = monthData.totalHours.organized;
                monthCol++;
                row.getCell(monthCol).value = monthData.totalHours.traditionalOrganized;
                monthCol++;
                //shifts Count
                row.getCell(monthCol).value = monthData.shiftsCount.traditionalHot;
                monthCol++;
                row.getCell(monthCol).value = monthData.shiftsCount.organized;
                monthCol++;
                row.getCell(monthCol).value = monthData.shiftsCount.traditionalOrganized;
                monthCol++;
                //unique Count
                row.getCell(monthCol).value = monthData.uniqueCount.traditionalHot;
                monthCol++;
                row.getCell(monthCol).value = monthData.uniqueCount.organized;
                monthCol++;
                row.getCell(monthCol).value = monthData.uniqueCount.traditionalOrganized;
                monthCol++;
                //opened Count
                row.getCell(monthCol).value = monthData.openedCount.traditionalHot;
                monthCol++;
                row.getCell(monthCol).value = monthData.openedCount.organized;
                monthCol++;
                row.getCell(monthCol).value = monthData.openedCount.traditionalOrganized;
                monthCol++;
                //sale Bottles Count
                row.getCell(monthCol).value = monthData.saleBottlesCount.traditionalHot;
                monthCol++;
                row.getCell(monthCol).value = monthData.saleBottlesCount.organized;
                monthCol++;
                row.getCell(monthCol).value = monthData.saleBottlesCount.traditionalOrganized;
                monthCol++;
                //sale Average
                row.getCell(monthCol).value = monthData.saleAverage.traditionalHot;
                monthCol++;
                row.getCell(monthCol).value = monthData.saleAverage.organized;
                monthCol++;
                row.getCell(monthCol).value = monthData.saleAverage.traditionalOrganized;

                row.commit();
            }
            row = worksheet.getRow(monthRow + 13);
            monthCol =  2;
            for (let i = 0; i < 33;i++){
                row.getCell(monthCol).value = {'formula':formArr[i]};
                monthCol++;
            }
            return workbook.xlsx.writeFile('monthReport/ניתוח ערוץ דיול חודשי ' + year + '.xlsx');
        });

    let content = ' מצורף דוח ניתוח ערוץ דיול חודשי:' + year;
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - דוח ניתוח ערוץ דיול חודשי ' + ' ' + year, content, 'monthReport/ניתוח ערוץ דיול חודשי ' + year + '.xlsx');
    return {'code': 200};
};

let genarateMonthAnalysisReport = async function() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let storeTraditionalHot = new Set();
    let storeTraditionalOrganized = new Set();
    let storeOrganized = new Set();

    let yearReport = await dal.getMonthAnalysisReport(year);
    if(yearReport == null){
        yearReport = new monthAnalysisReportModel();
        yearReport.monthData = [];
        yearReport.year = year;
        for(let i = 0; i < 12; i++){
            let monthReport = {'month': (i + 1),
                'salesmanCost':{
                    'traditionalHot': 0,
                    'traditionalOrganized': 0,
                    'organized': 0,
                    'events': 0
                },
                'totalHours': {
                    'traditionalHot': 0,
                    'traditionalOrganized': 0,
                    'organized': 0
                },
                'shiftsCount': {
                    'traditionalHot': 0,
                    'traditionalOrganized': 0,
                    'organized': 0
                },
                'uniqueCount': {
                    'traditionalHot': 0,
                    'traditionalOrganized': 0,
                    'organized': 0
                },
                'saleBottlesCount': {
                    'traditionalHot': 0,
                    'traditionalOrganized': 0,
                    'organized': 0
                },
                'openedCount': {
                    'traditionalHot': 0,
                    'traditionalOrganized': 0,
                    'organized': 0
                },
                'saleAverage': {
                    'traditionalHot': 0,
                    'traditionalOrganized': 0,
                    'organized': 0
                },
                'monthlyEncoragement': []
            };
            let allEnc = await dal.getAllEncouragements();
            for(let enc of allEnc){
                monthReport.monthlyEncoragement.push({'encouragement': enc, 'amount': 0});
            }
            yearReport.monthData.push(monthReport);
        }

        yearReport = await dal.addMonthAnalysisReport(yearReport);
    }

    let monthShifts = await dal.getMonthShifts(year, month);
    let monthShiftsEvent = await dal.getEventShifts(year, month);
    for(let currentShift of monthShifts){
        let salesman = await dal.getUserByobjectId(currentShift.salesmanId);
        let duration = parseInt((currentShift.endTime - currentShift.startTime)/36e5, 10);
        let store = await dal.getStoresByIds([currentShift.storeId]);
        store = store[0];
        if(currentShift.type.includes('אירוע')){
            yearReport.monthData[month].salesmanCost.events += duration*salesman.jobDetails.salary;
        }
        else if(store.channel == 'מסורתי - חם'){
            storeTraditionalHot.add(store._id);
            yearReport.monthData[month].totalHours.traditionalHot += duration;
            yearReport.monthData[month].salesmanCost.traditionalHot += duration*salesman.jobDetails.salary;
            yearReport.monthData[month].shiftsCount.traditionalHot += 1;
            yearReport.monthData[month].saleBottlesCount.traditionalHot += currentShift.sales.length;
            for(let sale of currentShift.salesReport){
                yearReport.monthData[month].openedCount.traditionalHot+= sale.opened;
            }
        }
        else if(store.channel == 'מסורתי - מאורגן'){//organized
            storeTraditionalOrganized.add(store._id.toString());
            yearReport.monthData[month].totalHours.traditionalOrganized += duration;
            yearReport.monthData[month].salesmanCost.traditionalOrganized += duration*salesman.jobDetails.salary;
            yearReport.monthData[month].shiftsCount.traditionalOrganized += 1;
            yearReport.monthData[month].saleBottlesCount.traditionalOrganized += currentShift.sales.length;
            for(let sale of currentShift.salesReport){
                yearReport.monthData[month].openedCount.traditionalOrganized+= sale.opened;
            }
        }
        else {//תדמית יום
            storeOrganized.add(store._id.toString());
            yearReport.monthData[month].totalHours.organized += duration;
            yearReport.monthData[month].salesmanCost.organized += duration*salesman.jobDetails.salary;
            yearReport.monthData[month].shiftsCount.organized += 1;
            yearReport.monthData[month].saleBottlesCount.organized += currentShift.sales.length;
            for(let sale of currentShift.salesReport){
                yearReport.monthData[month].openedCount.organized+= sale.opened;
            }
        }

        //create all the enc
        for(let shiftEnc of currentShift.encouragements){
            for(let encReport of yearReport.monthData[month].monthlyEncoragement){
                if(encReport.encouragement._id.equals(shiftEnc.encouragement._id)){
                    let totalAmount = shiftEnc.encouragement.rate * shiftEnc.count;
                    encReport.amount += parseInt(totalAmount + totalAmount * encouragementFactor);
                }
            }
        }
    }
    if(yearReport.monthData[month].totalHours.organized > 0){
        yearReport.monthData[month].saleAverage.organized = yearReport.monthData[month].saleBottlesCount.organized/yearReport.monthData[month].totalHours.organized;
        yearReport.monthData[month].uniqueCount.organized = storeOrganized.size;
    }
    if(yearReport.monthData[month].totalHours.traditionalOrganized > 0){
        yearReport.monthData[month].saleAverage.traditionalOrganized = yearReport.monthData[month].saleBottlesCount.traditionalOrganized/yearReport.monthData[month].totalHours.traditionalOrganized;
        yearReport.monthData[month].uniqueCount.traditionalOrganized = storeTraditionalOrganized.size;
    }
    if(yearReport.monthData[month].totalHours.traditionalHot > 0){
        yearReport.monthData[month].saleAverage.traditionalHot = yearReport.monthData[month].saleBottlesCount.traditionalHot/yearReport.monthData[month].totalHours.traditionalHot;
        yearReport.monthData[month].uniqueCount.traditionalHot = storeTraditionalHot.size;
    }

    let res = await dal.editMonthAnalysisReport(yearReport);
    return {'code':200};
};

let getMonthlyAnalysisReport = async function(sessionId, year){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getMonthlyAnalysisReport');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let report = await dal.getMonthAnalysisReport(year);
    if(report == null)
        return {'code': 404, 'err': 'report still not genarated'};

    return {'code':200, 'report': report};
};

let updateMonthlyAnalysisReport = async function(sessionId, year, report){
    let aut = await permissions.validatePermissionForSessionId(sessionId, 'updateMonthlyAnalysisReport');
    if(aut == null)
        return {'code': 401, 'err': 'user not authorized'};

    let reportDB = await dal.getMonthAnalysisReport(year);
    if(reportDB == null)
        return {'code': 404, 'err': 'report still not genarated'};

    report._id = reportDB._id;
    let res = await dal.editMonthAnalysisReport(report);
    if(res.ok == 0)
        return {'code':400, 'err': 'cannot edit this report'};

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

            //write total sales and opened
            row.getCell(3).value = 'מכירות';
            row.getCell(3).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'99CCF0FF'},
                bgColor:{argb:'99CCF0FF'}
            };
            row.getCell(3).border = {
                top: {style:'medium'},
                left: {style:'medium'},
                bottom: {style:'medium'},
                right: {style:'medium'}
            };

            row.getCell(4).value = 'מכירות לשעה';
            row.getCell(4).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'99CCF0FF'},
                bgColor:{argb:'99CCF0FF'}
            };
            row.getCell(4).border = {
                top: {style:'medium'},
                left: {style:'medium'},
                bottom: {style:'medium'},
                right: {style:'medium'}
            };

            row.getCell(5).value = 'בקבוקים שנפתחו';
            row.getCell(5).fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'99CCF0FF'},
                bgColor:{argb:'99CCF0FF'}
            };
            row.getCell(5).border = {
                top: {style:'medium'},
                left: {style:'medium'},
                bottom: {style:'medium'},
                right: {style:'medium'}
            };

            let rowNum = 4;
            for(let userData of report.salesmansData){
                let col = 1;
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

                //add user sales
                row.getCell(col).value = userData.sales;
                row.getCell(col).border = {
                    top: {style:'medium'},
                    left: {style:'medium'},
                    bottom: {style:'medium'},
                    right: {style:'medium'}
                };
                col = col + 1;

                if(userData.numOfHours > 0){
                    row.getCell(col).value = (userData.sales/userData.numOfHours);
                }else{
                    row.getCell(col).value = 0;
                }

                row.getCell(col).border = {
                    top: {style:'medium'},
                    left: {style:'medium'},
                    bottom: {style:'medium'},
                    right: {style:'medium'}
                };
                col = col + 1;

                //add user battle opened
                row.getCell(col).value = userData.opened;
                row.getCell(col).border = {
                    top: {style:'medium'},
                    left: {style:'medium'},
                    bottom: {style:'medium'},
                    right: {style:'medium'}
                };
                col = col + 1;

                rowNum++;
            }

            //add total row
            let col = 1;
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

            for(let j = col; j < 6; j++) {
                let count = 0;
                let rowCount;
                for (let t = 5; t < rowNum; t++) {
                    rowCount = worksheet.getRow(t);
                    count += rowCount.getCell(j).value;
                }

                rowCount = worksheet.getRow(rowNum);
                rowCount.getCell(j).font = {'bold':true, 'size':13};
                rowCount.getCell(j).value = count;
                if(j == 4){
                    rowCount.getCell(j).value = count/(rowNum - 4);
                }

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

let genarateMonthlyUserHoursReport = async function() {
    let date = new Date();
    let report = new monthlyUserHoursReportModel();
    let shifts = await dal.getMonthShifts(date.getFullYear(), date.getMonth());
    let users = await dal.getAllUsers();

    //add month and year
    report.month = date.getMonth();
    report.year = date.getFullYear();
    report.salesmansData = [];

    //initilize all users
    for(let user of users) {
        if (user.jobDetails.userType == 'salesman') {
            let salesmanData = {
                'user': user,
                'numOfHours': 0,
                'sales': 0,
                'opened': 0
            };
            //count the total shift hours of user
            for (let shift of shifts){
                if(shift.salesmanId.equals(user._id)){
                    let duration = (shift.endTime - shift.startTime)/36e5;
                    salesmanData.numOfHours += duration;
                    for(let sales of shift.salesReport){
                        salesmanData.sales += sales.sold;
                        salesmanData.opened += sales.opened;
                    }
                }
            }

            report.salesmansData.push(salesmanData);
        }
    }

    let res = await dal.addMonthlySalesmanReport(report);
    return {'report': res ,'code': 200 ,'err': null};
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
        userData.name = user.personal.firstName + ' ' + user.personal.lastName;
    }

    return {'report': report, 'code': 200, 'err': null};
};

let updateMonthlySalesmanHoursReport = async function(sessionId, year, month, report){
    let aut = await permissions.validatePermissionForSessionId(sessionId, 'updateMonthlySalesmanHoursReport');
    if(aut == null)
        return {'code': 401, 'err': 'user not authorized'};

    let reportDB = await dal.getMonthlyUserHoursReport(year, month);
    if(reportDB == null)
        return {'code': 404, 'err': 'report still not genarated'};

    report._id = reportDB._id;
    let res = await dal.editMonthlyUserHoursReport(report);
    if(res.ok == 0)
        return {'code':400, 'err': 'cannot edit this report'};

    return {'code': 200};
};

let getSalaryForHumanResourceReport = async function(sessionId, year, month){
    let user = await permissions.validatePermissionForSessionId(sessionId, 'getSalaryForHumanResourceReport');
    if(user == null)
        return {'code': 401, 'err': 'user not authorized'};

    let workbook = new Excel.Workbook();
    let res = await workbook.xlsx.readFile('salaryForHumanResourceReport.xlsx');
    let salesman = await dal.getAllSalesman();
    let sheetNum = 1;
    for(let user of salesman){
        let worksheet = workbook.getWorksheet(sheetNum);
        worksheet.name = user.personal.firstName + ' ' + user.personal.lastName;
        worksheet.properties.tabColor = {'argb' : 'FFC0000'};
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
        let maxEncCol;
        //write the encouragements names
        let allEnc = await dal.getAllEncouragements();
        for(let i = 0; i < encCategory.length; i++){
            row = worksheet.getRow(7);
            row.getCell(17 + i).value = encCategory[i];//R+i7
            maxEncCol = 17 + i;
        }
        //add all the shifts and the encouragements
        let salesmanShifts = await dal.getSalesmanMonthShifts(user._id, year, month);
        for(let j  = 0; j < salesmanShifts.length + 0; j++){
            let currentShift = salesmanShifts[j];
            let rowCountFormula = 8 + j;
            row = worksheet.getRow(j + 8);
            row.getCell(1).value = new Date(currentShift.startTime).toISOString();//.getDate() + '.' + (new Date(currentShift.startTime).getMonth() + 1) + '.' + new Date(currentShift.startTime).getFullYear();
            row.getCell(2).value = days[new Date(currentShift.startTime).getDay()];
            let shiftStore = (await dal.getStoresByIds([currentShift.storeId]))[0];
            row.getCell(3).value = shiftStore.name;
            row.getCell(4).value = shiftStore.city;
            row.getCell(5).value = currentShift.type;
            row.getCell(6).value = new Date(currentShift.startTime).getHours() + ":" + moment(new Date(currentShift.startTime).getMinutes()).format("mm") + ":" + moment(new Date(currentShift.startTime).getSeconds()).format("ss");
            row.getCell(7).value = new Date(currentShift.endTime).getHours() + ":" + moment(new Date(currentShift.endTime).getMinutes()).format("mm") + ":" + moment(new Date(currentShift.endTime).getSeconds()).format("ss");
            if(currentShift.numOfKM != null && currentShift.parkingCost != null){
                row.getCell(15).value = currentShift.numOfKM * 0.7 + currentShift.parkingCost;
            }
            else{
                row.getCell(15).value = 0;
            }

            //add formulas
            row.getCell(8).value = {'formula': 'IF((G' + rowCountFormula + '-F' + rowCountFormula + ')<0,(1-F' + rowCountFormula + '+G' + rowCountFormula +'),(G' + rowCountFormula + '-F' + rowCountFormula +'))'};//'=IF((G8-F8)<0,(1-F8+G8),(G8-F8))'
            row.getCell(9).value = {'formula': 'H' + rowCountFormula + '*24'};
            row.getCell(10).value = {'formula': 'IF(I' + rowCountFormula +'<9,I' + rowCountFormula + ',9)'};
            row.getCell(11).value = {'formula': 'IF(I' + rowCountFormula + '>9,I' + rowCountFormula +'-9,0)'};
            row.getCell(12).value = {'formula': 'IF(K' + rowCountFormula + '>2,2,K' + rowCountFormula + ')'};
            row.getCell(13).value = {'formula': 'IF(K' + rowCountFormula + '>2,K' + rowCountFormula + '-2,0)'};
            row.getCell(14).value = {'formula': 'IF(AND($I' + rowCountFormula + '>2,$G' + rowCountFormula + '>0.79),"120%",IF(AND($I' + rowCountFormula + '>2,$G' + rowCountFormula + '>=0,$F' + rowCountFormula + '>0.7083),"130%","100%"))'};
            for(let enc of currentShift.encouragements){
                for(let k = 18; k <= maxEncCol; k++){
                    if(enc.encouragement.name.includes(worksheet.getRow(7).getCell(k).value )){
                        row.getCell(k).value = enc.encouragement.rate * enc.count;
                    }
                }
            }
            row = worksheet.getRow(23);
            rowCountFormula = 73;
            for (let cell = 0; cell < 16; cell++){
                if(cell != 5)
                    row.getCell(9 + cell).value = {'formula': 'SUM(' + String.fromCharCode(rowCountFormula + cell) +'8:' + String.fromCharCode(rowCountFormula + cell) + '22)'};
            }
            row = worksheet.getRow(27);
            row.getCell(8).value = {'formula': 'SUMIF($E$8:$I$22,G27,$I$8:$I$22)'};
            row.getCell(9).value = {'formula': '+I23-H27-H28'};
            row = worksheet.getRow(28);
            row.getCell(8).value = {'formula': 'SUMIF($E$8:$I$22,G28,$I$8:$I$22)'};
            row.commit();
        }
        sheetNum = sheetNum + 1;
    }
    res = await workbook.xlsx.writeFile('monthReport/דוח שעות דיול חודשי למשאבי אנוש '+ (month + 1) + ' ' + year + '.xlsx');

    let content = ' מצורף דוח סיכום שעות דיול חודשי:' + (month + 1) + ' ' + year;
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - דוח סיכום שעות דיול חודשי ' + (month + 1) + ' ' + year, content, 'monthReport/דוח שעות דיול חודשי למשאבי אנוש '+ (month + 1) + ' ' + year + '.xlsx');
    return {'code': 200};
};

let _calcEventCost = function(numOfHours, expensesCost){
    let totalCost = constantString.eventSalary
                    + constantString.eventSalary * 0.1276
                    + constantString.eventSalary * (0.1433 + 0.009)
                    + ((expensesCost * 0.0376)/numOfHours);
    return Math.round(totalCost * numOfHours);
};


module.exports.getSaleReportXl = getSaleReportXl;
module.exports.createXLSaleReport = createXLSaleReport;
module.exports.getMonthlyUserHoursReport = getMonthlyUserHoursReport;
module.exports.genarateMonthlyUserHoursReport = genarateMonthlyUserHoursReport;
module.exports.getMonthlyHoursSalesmansReportXl = getMonthlyHoursSalesmansReportXl;
module.exports.genarateMonthAnalysisReport = genarateMonthAnalysisReport;
module.exports.getSalaryForHumanResourceReport = getSalaryForHumanResourceReport;
module.exports.getSalesmanListXL = getSalesmanListXL;
module.exports.getMonthlyAnalysisReport = getMonthlyAnalysisReport;
module.exports.getMonthAnalysisReportXL = getMonthAnalysisReportXL;
module.exports.updateMonthlySalesmanHoursReport = updateMonthlySalesmanHoursReport;
module.exports.updateMonthlyAnalysisReport = updateMonthlyAnalysisReport;
module.exports.getOrderEventReportXL = getOrderEventReportXL;