let logger          = require('../../Utils/Logger/logger');
let permissions     = require('../permissions/index');
let dal             = require('../../DAL/dal');
var mailer          = require('../../Utils/Mailer/index');
let fs              = require('fs');
let Excel           = require('exceljs');

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
    mailer.sendMailWithFile([user.contact.email], 'IBBLS - דוח טעימות של '+ salesman.username, content, __dirname+'\\sale report ' + shift.startTime.toDateString() + ' ' + salesman.username + '.xlsx');
    return {'code': 200};
};

module.exports.getSaleReportXl = getSaleReportXl;