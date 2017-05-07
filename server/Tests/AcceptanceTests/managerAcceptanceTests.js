/**
 * Created by matan bezen on 27/04/2017.
 */

let assert              = require('chai').assert;
let expect              = require('chai').expect;
let Excel               = require('exceljs');
var moment              = require('moment');
let mongoose            = require('mongoose');
let shiftModel          = require('../../src/Models/shift');

process.env['DB'] = 'AcceptenceTestDb';

let main                = require('../../main');
let axios               = require('axios');

let dal                 = require('../../src/DAL/dal');
let userModel           = require('../../src/Models/user');
let productModel        = require('../../src/Models/product');
let storeModel          = require('../../src/Models/store');
let encouragementModel        = require('../../src/Models/encouragement');
let serverUrl = 'http://localhost:3000/';

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

describe('management acceptance test', function(){
    let manager;
    let salesman;
    let notManager;
    let encouragement;
    let newStore;
    let store;
    let product1;
    let product2;
    let newProduct;
    let newEncouragement;
    let shift1;
    let shifts = [];

    let readListsalesmanXl =  async function (sessionId,fileName){
        let workbook = new Excel.Workbook();
        let res = await workbook.xlsx.readFile('reportTests/' + fileName);
        let worksheet = workbook.getWorksheet('מצבת כא דיילים');
        let rowNum = 5;

        let row = worksheet.getRow(rowNum);
        while ((row.getCell(2).value != null)) {
            let salesman = new userModel();
            salesman.personal.firstName = row.getCell(3).value;
            salesman.personal.lastName = row.getCell(2).value;
            salesman.personal.id = "123456";
            if (row.getCell(4) != "") {
                salesman.personal.id = row.getCell(4).value;
            }

            salesman.jobDetails.salary = 10;
            salesman.contact.email = "bez@gmail.com";
            salesman.jobDetails.userType = "salesman";
            salesman.username = salesman.personal.firstName + " " + salesman.personal.lastName;

            let res = await dal.addUser(salesman);
            rowNum++;
            row = worksheet.getRow(rowNum);
        }
        return {'code': 200};
    };

    let readShiftFromXl =  async function (sessionId,fileName){
        let workbook = new Excel.Workbook();
        let res = await workbook.xlsx.readFile('reportTests/' + fileName);
        let worksheet = workbook.getWorksheet('לוח דיול חודשי');
        let rowNum = 2;

        let row = worksheet.getRow(rowNum);
        while ((row.getCell(2).value != null)) {
            let shift = new shiftModel();
            shift.storeId = store;

            let startTime = new Date(row.getCell(1).value);
            let endTime = new Date(row.getCell(1).value);
            startTime.setHours(new Date(row.getCell(6).value).getHours());
            endTime.setHours(new Date(row.getCell(7).value).getHours());
            //startTime.setMonth(date.getMonth());
            //endTime.setDate(date.getDate());
            //endTime.setYear(date.getYear());
            //endTime.setMonth(date.getMonth());
            shift.startTime = startTime.toISOString();
            shift.endTime = endTime.toString();
            shift.type = row.getCell(5).value;

            let salesmanShift = await dal.getUserByUsername(row.getCell(11).value);
            if(salesmanShift == null) {
                rowNum++;
                row = worksheet.getRow(rowNum);
                continue;
            }

            shift.salesmanId = salesmanShift;
            shift.status = "FINISHED";

            let res = await dal.addShift(shift);
            rowNum++;
            row = worksheet.getRow(rowNum);
        }
        return {'code': 200};
    };


    beforeEach(async function() {
        let res = await dal.cleanDb();

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.password = '12s1234';
        manager.jobDetails.userType = 'manager';
        manager = await dal.addUser(manager);

        product2 = {'name': 'absulut', 'retailPrice': 122, 'salePrice': 133, 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': 111, 'notifyManager': false};

        product1 = new productModel();
        product1.name = product2.name;
        product1.retailPrice = product2.retailPrice;
        product1.salePrice = product2.salePrice;
        product1.category = product2.category;
        product1.subCategory = product2.subCategory;
        product1.minRequiredAmount = product2.minRequiredAmount;
        product1.notifyManager = product2.notifyManager;

        product1 = await dal.addProduct(product1);

        newEncouragement = {'active': true, 'numOfProducts': 2, 'rate': 100, 'products': []};
        newEncouragement.products.push(product1._id);

        encouragement = new encouragementModel();
        encouragement.active = false;
        encouragement.numOfProducts = newEncouragement.numOfProducts;
        encouragement.rate = newEncouragement.rate;

        //create id object from the string id
        let products = await dal.getProductsById(newEncouragement);
        encouragement.products = products;


        newStore = {
            'name': 'bana',
            'managerName': 'shahaf',
            'phone': '0542458658',
            'city': 'beersheva',
            'address': 'rager12',
            'area': 'south',
            'channel': 'hot'
        };
        newProduct = {
            'name': 'jhony walker',
            'retailPrice': 2222,
            'salePrice': 555,
            'category': 'wiskey',
            'subCategory': 'wiskey',
            'minRequiredAmount': 12,
            'notifyManager': true
        };

        store = new storeModel();
        store.name = 'blabla';
        store.managerName = 'lihi';
        store.phone = '092093232';
        store.city = 'rishonLezion';
        store.address = 'ha-kabarnir';
        store.area = 'center';
        store.channel = 'cold';
        store = await dal.addStore(store);
    });

    afterEach(async function(){
        let res = await dal.cleanDb();
        shifts.pop();
    });

    describe(' test Excel reports against the system reports', function() {
        it('getSalaryForHumanResourceReport file 1', async function () {
            let fileName = "reportTest1.xlsx";
            this.timeout(30000);
            let res = await readListsalesmanXl(manager.sessionId, fileName);
            res = await readShiftFromXl(manager.sessionId, fileName);

            res = await axios.post(serverUrl + 'manager/getSalaryForHumanResourceReport', {
                sessionId: manager.sessionId,
                month: "0",
                year: "2017"
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            assert.equal(res.status, 200);

            let systemWorkbook = new Excel.Workbook();
            res = await systemWorkbook.xlsx.readFile('monthReport/דוח שעות דיול חודשי למשאבי אנוש 01 2017.xlsx');
            let ibblsWorkbook = new Excel.Workbook();
            res = await ibblsWorkbook.xlsx.readFile('reportTests/' + fileName);

            let ibblsWorksheet;
            let systemWorksheet;
            for(let sheetCount = 1; sheetCount <= ibblsWorkbook._worksheets.length; sheetCount++){
                ibblsWorksheet = ibblsWorkbook.getWorksheet(sheetCount);
                if(ibblsWorksheet != null) {
                    let sheetName = ibblsWorksheet.name;
                    res = await dal.getUserByUsername(sheetName);
                    if(res != null){
                        systemWorksheet = systemWorkbook.getWorksheet(sheetName);
                        assert.isNotNull(systemWorksheet);

                        //run over the shift and check equals
                        let rowCount = 8;
                        let ibblsRow = ibblsWorksheet.getRow(rowCount);
                        let systemRow;
                        console.log(ibblsWorksheet.name);
                        while(ibblsRow.getCell(1).value != null){
                            systemRow = systemWorksheet.getRow(rowCount);
                            assert.equal(new Date(systemRow.getCell(1).value).toDateString(), new Date(ibblsRow.getCell(1).value).toDateString());
                            assert.equal(systemRow.getCell(2).value,ibblsRow.getCell(2).value);
                            assert.isTrue(-1 <= systemRow.getCell(6).value - ibblsRow.getCell(6).value <= 1);
                            assert.isTrue(-1 <= systemRow.getCell(7).value - ibblsRow.getCell(7).value <= 1);
                         //   assert.equal(systemRow.getCell(8).value.toString(),ibblsRow.getCell(8).result.toString());
                           // assert.equal(systemRow.getCell(9).value.toString(),ibblsRow.getCell(9).result.toString());
                          //  assert.equal(systemRow.getCell(14).value.toString(),ibblsRow.getCell(10).value.toString());
                            rowCount++;
                            ibblsRow = ibblsWorksheet.getRow(rowCount);
                        }
                    }
                }
            }
        });

        it('getSalaryForHumanResourceReport file 2', async function () {
            let fileName = "reportTest2.xlsx";
            this.timeout(30000);
            let res = await readListsalesmanXl(manager.sessionId, fileName);
            res = await readShiftFromXl(manager.sessionId, fileName);

             res = await axios.post(serverUrl + 'manager/getSalaryForHumanResourceReport', {
             sessionId: manager.sessionId,
             month: "2",
             year: "2017"
             }).then(async function(info){
             return info;
             }).catch(async function(err){
             return err;
             });
             assert.equal(res.status, 200);

            let systemWorkbook = new Excel.Workbook();
            res = await systemWorkbook.xlsx.readFile('monthReport/דוח שעות דיול חודשי למשאבי אנוש 21 2017.xlsx');
            let ibblsWorkbook = new Excel.Workbook();
            res = await ibblsWorkbook.xlsx.readFile('reportTests/' + fileName);

            let ibblsWorksheet;
            let systemWorksheet;
            for(let sheetCount = 1; sheetCount <= ibblsWorkbook._worksheets.length; sheetCount++){
                ibblsWorksheet = ibblsWorkbook.getWorksheet(sheetCount);
                if(ibblsWorksheet != null) {
                    let sheetName = ibblsWorksheet.name;
                    res = await dal.getUserByUsername(sheetName);
                    if(res != null){
                        systemWorksheet = systemWorkbook.getWorksheet(sheetName);
                        assert.isNotNull(systemWorksheet);

                        //run over the shift and check equals
                        let rowCount = 8;
                        let ibblsRow = ibblsWorksheet.getRow(rowCount);
                        let systemRow;
                        console.log(ibblsWorksheet.name);
                        while(ibblsRow.getCell(1).value != null){
                            systemRow = systemWorksheet.getRow(rowCount);
                            assert.equal(new Date(systemRow.getCell(1).value).toDateString(), new Date(ibblsRow.getCell(1).value).toDateString());
                            assert.equal(systemRow.getCell(2).value,ibblsRow.getCell(2).value);
                            assert.isTrue(-1 <= systemRow.getCell(6).value - ibblsRow.getCell(6).value <= 1);
                            assert.isTrue(-1 <= systemRow.getCell(7).value - ibblsRow.getCell(7).value <= 1);
                            //   assert.equal(systemRow.getCell(8).value.toString(),ibblsRow.getCell(8).result.toString());
                            // assert.equal(systemRow.getCell(9).value.toString(),ibblsRow.getCell(9).result.toString());
                            //  assert.equal(systemRow.getCell(14).value.toString(),ibblsRow.getCell(10).value.toString());
                            rowCount++;
                            ibblsRow = ibblsWorksheet.getRow(rowCount);
                        }
                    }
                }
            }
        });

        it('getSalaryForHumanResourceReport file 3', async function () {
            let fileName = "reportTest3.xlsx";
            this.timeout(30000);
            let res = await readListsalesmanXl(manager.sessionId, fileName);
            res = await readShiftFromXl(manager.sessionId, fileName);

             res = await axios.post(serverUrl + 'manager/getSalaryForHumanResourceReport', {
             sessionId: manager.sessionId,
             month: "1",
             year: "2017"
             }).then(async function(info){
             return info;
             }).catch(async function(err){
             return err;
             });
             assert.equal(res.status, 200);

            let systemWorkbook = new Excel.Workbook();
            res = await systemWorkbook.xlsx.readFile('monthReport/דוח שעות דיול חודשי למשאבי אנוש 11 2017.xlsx');
            let ibblsWorkbook = new Excel.Workbook();
            res = await ibblsWorkbook.xlsx.readFile('reportTests/' + fileName);

            let ibblsWorksheet;
            let systemWorksheet;
            for(let sheetCount = 1; sheetCount <= ibblsWorkbook._worksheets.length; sheetCount++){
                ibblsWorksheet = ibblsWorkbook.getWorksheet(sheetCount);
                if(ibblsWorksheet != null) {
                    let sheetName = ibblsWorksheet.name;
                    res = await dal.getUserByUsername(sheetName);
                    if(res != null){
                        systemWorksheet = systemWorkbook.getWorksheet(sheetName);
                        assert.isNotNull(systemWorksheet);

                        //run over the shift and check equals
                        let rowCount = 8;
                        let ibblsRow = ibblsWorksheet.getRow(rowCount);
                        let systemRow;
                        console.log(ibblsWorksheet.name);
                        while(ibblsRow.getCell(1).value != null){
                            systemRow = systemWorksheet.getRow(rowCount);
                            assert.equal(new Date(systemRow.getCell(1).value).toDateString(), new Date(ibblsRow.getCell(1).value).toDateString());
                            assert.equal(systemRow.getCell(2).value,ibblsRow.getCell(2).value);
                            assert.isTrue(-1 <= systemRow.getCell(6).value - ibblsRow.getCell(6).value <= 1);
                            assert.isTrue(-1 <= systemRow.getCell(7).value - ibblsRow.getCell(7).value <= 1);
                            //   assert.equal(systemRow.getCell(8).value.toString(),ibblsRow.getCell(8).result.toString());
                            // assert.equal(systemRow.getCell(9).value.toString(),ibblsRow.getCell(9).result.toString());
                            //  assert.equal(systemRow.getCell(14).value.toString(),ibblsRow.getCell(10).value.toString());
                            rowCount++;
                            ibblsRow = ibblsWorksheet.getRow(rowCount);
                        }
                    }
                }
            }
        });
    });
});