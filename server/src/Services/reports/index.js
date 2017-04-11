let logger          = require('../../Utils/Logger/logger');
let mongoose    = require('mongoose');
let permissions     = require('../permissions/index');
let dal             = require('../../DAL/dal');
let mailer          = require('../../Utils/Mailer/index');
let fs              = require('fs');
let moment          = require('moment');
let Excel           = require('exceljs');
let userService     = require('../../Services/user');
let monthlyUserHoursReportModel = require('../../Models/Reports/SummaryMonthlyHoursReport');
let monthAnalysisReportModel = require('../../Models/Reports/monthAnalysisReport');
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
            let worksheet = workbook.getWorksheet(1);
            let row = worksheet.getRow(2);
            row.getCell(3).value = 'ניתוח כללי' + year;
            /* row.getCell(2).value = report.month + 1; // B1's value
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
             }*/
            return workbook.xlsx.writeFile('monthReport/דוח שעות דיול חודשי '+ (month + 1) + ' ' + year + '.xlsx');
        });

    //let content = ' מצורף דוח סיכום שעות דיול חודשי:' + (month + 1) + ' ' + year;
    //mailer.sendMailWithFile(['matanbezen@gmail.com'], 'IBBLS - דוח סיכום שעות דיול חודשי ' + (month + 1) + ' ' + year, content, 'monthReport/דוח שעות דיול חודשי '+ (month + 1) + ' ' + year + '.xlsx');
    return {'code': 200};
};

let genarateMonthAnalysisReport = async function() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();

    let yearReport = await dal.getMonthAnalysisReport(year);
    if(yearReport == null){
        yearReport = new monthAnalysisReportModel();
        yearReport.monthData = [];
        yearReport.year = year;
        for(let i = 0; i < 12; i++){
            let monthReport = {'month': (i + 1),
                'salesmanCost':{
                    'traditional': 0,
                    'organized': 0
                },
                'totalHours': {
                    'traditional': 0,
                    'organized': 0
                },
                'shiftsCount': {
                    'traditional': 0,
                    'organized': 0
                },
                'uniqueCount': {
                    'traditional': 0,
                    'organized': 0
                },
                'saleBottlesCount': {
                    'traditional': 0,
                    'organized': 0
                },
                'openedCount': {
                    'traditional': 0,
                    'organized': 0
                },
                'saleAverage': {
                    'traditional': 0,
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
    for(let currentShift of monthShifts){
        let salesman = await dal.getUserByobjectId(currentShift.salesmanId);
        let duration = (currentShift.endTime - currentShift.startTime)/36e5;
        if(currentShift.type == 'traditional'){
            yearReport.monthData[month].totalHours.traditional += duration;
            yearReport.monthData[month].salesmanCost.traditional += duration*salesman.jobDetails.salary;
            yearReport.monthData[month].shiftsCount.traditional += 1;
            yearReport.monthData[month].saleBottlesCount.traditional += currentShift.sales.length;
            for(let sale of currentShift.salesReport){
                yearReport.monthData[month].openedCount.traditional+= sale.opened;
            }
            for(let shiftEnc of currentShift.encouragements){
                for(let encReport of yearReport.monthData[month].monthlyEncoragement){
                    if(encReport._id.equals(shiftEnc._id)){
                        encReport.amount += 1;
                    }
                }
            }
        }
        else{//organized
            yearReport.monthData[month].totalHours.organized += duration;
            yearReport.monthData[month].salesmanCost.organized += duration*salesman.jobDetails.salary;
            yearReport.monthData[month].shiftsCount.organized += 1;
            yearReport.monthData[month].saleBottlesCount.organized += currentShift.sales.length;
            for(let sale of currentShift.salesReport){
                yearReport.monthData[month].openedCount.organized+= sale.opened;
            }
            for(let shiftEnc of currentShift.encouragements){
                for(let encReport of yearReport.monthData[month].monthlyEncoragement){
                    if(encReport._id.equals(shiftEnc._id)){
                        encReport.amount += 1;
                    }
                }
            }
        }
    }
    if(yearReport.monthData[month].totalHours.traditional > 0){
        yearReport.monthData[month].saleAverage.traditional = yearReport.monthData[month].saleBottlesCount.traditional/yearReport.monthData[month].totalHours.traditional;
    }
    if(yearReport.monthData[month].totalHours.organized > 0){
        yearReport.monthData[month].saleAverage.organized = yearReport.monthData[month].saleBottlesCount.organized/yearReport.monthData[month].totalHours.organized;
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

                let maxEncCol;
                //write the encouragements names
                let allEnc = await dal.getAllEncouragements();
                for(let i = 0; i < allEnc.length; i++){
                    row = worksheet.getRow(7);
                    row.getCell(17 + i).value = allEnc[i].name;//R+i7
                    maxEncCol = 17 + i;
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
                    row.getCell(15).value = currentShift.numOfKM * 0.7 + currentShift.parkingCost;

                    for(let enc of currentShift.encouragements){
                        let encName = await dal.getEncouragement(mongoose.Types.ObjectId(enc));
                        for(let k = 18; k <= maxEncCol; k++){
                            if(worksheet.getRow(7).getCell(k).value == encName.name){
                                row.getCell(k).value = encName.rate;
                            }
                        }
                    }

                    row.commit();
                }

                sheetNum = sheetNum + 1;
            }
            return workbook.xlsx.writeFile('monthReport/דוח שעות דיול חודשי '+ (month + 1) + ' ' + year + '.xlsx');
        });

    let content = ' מצורף דוח סיכום שעות דיול חודשי:' + (month + 1) + ' ' + year;
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - דוח סיכום שעות דיול חודשי ' + (month + 1) + ' ' + year, content, 'monthReport/דוח שעות דיול חודשי '+ (month + 1) + ' ' + year + '.xlsx');
    return {'code': 200};
};


module.exports.getSaleReportXl = getSaleReportXl;
module.exports.getMonthlyUserHoursReport = getMonthlyUserHoursReport;
module.exports.genarateMonthlyUserHoursReport = genarateMonthlyUserHoursReport;
module.exports.getMonthlyHoursSalesmansReportXl = getMonthlyHoursSalesmansReportXl;
module.exports.genarateMonthAnalysisReport = genarateMonthAnalysisReport;
module.exports.getSalaryForHumanResourceReport = getSalaryForHumanResourceReport;
module.exports.getSalesmanListXL = getSalesmanListXL;
module.exports.getMonthAnalysisReportXL = getMonthAnalysisReportXL;
module.exports.updateMonthlySalesmanHoursReport = updateMonthlySalesmanHoursReport;