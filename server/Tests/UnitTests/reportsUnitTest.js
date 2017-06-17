var assert            = require('chai').assert;
let expect              = require('chai').expect;
let mongoose            = require('mongoose');

let userModel           = require('../../src/Models/user');
let productModel        = require('../../src/Models/product');
let storeModel          = require('../../src/Models/store');
let shiftModel          = require('../../src/Models/shift');
var moment              = require('moment');
let encouragementModel  = require('../../src/Models/encouragement');
var dal               = require('../../src/DAL/dal');
let Excel               = require('exceljs');
var repoetService     = require('../../src/Services/reports/index');

describe('reports unit test', function () {

    let manager;
    let salesman;
    let salesman2;
    let shift1;
    let shift2;
    let shift3;
    let shift4;
    let shifts = [];
    let store;
    let product1;
    let product2;
    let product3;
    let enc1;
    let enc2;
    let enc3;
    let today;
    let enc4;

    let shift_object_to_model = function(shiftObj){
        let shift = new shiftModel();
        shift.storeId = shiftObj.storeId;
        shift.startTime = shiftObj.startTime;
        shift.endTime = shiftObj.endTime;
        shift.status = shiftObj.status;
        shift.type = shiftObj.type;
        shift.salesmanId = shiftObj.salesmanId;
        shift.constraints = shiftObj.constraint;
        shift.salesReport = shiftObj.salesReport;
        shift.sales = shiftObj.sales;
        shift.shiftComments = shiftObj.shiftComments;
        return shift;
    };

    let createNewSalesReport = async function(){
        let report = [];
        let productsIds = await dal.getAllProducts();
        productsIds = productsIds.map(x => x._id);

        for(let productId of productsIds){
            report.push({
                'productId': productId,
                'stockStartShift': 3,
                'stockEndShift': 1,
                'sold': 1,
                'opened': 1
            });
        }
        return report;
    };


    beforeEach(async function () {
        shifts = [];
        today = new Date();

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        manager = await dal.addUser(manager);

        salesman = new userModel();
        salesman.username = 'matan';
        salesman.sessionId = '12123434';
        salesman.jobDetails.userType = 'salesman';
        salesman.jobDetails.salary = 35;
        salesman = await dal.addUser(salesman);

        salesman2 = new userModel();
        salesman2.username = 'bigbezen';
        salesman2.sessionId = '1212343456';
        salesman2.jobDetails.userType = 'salesman';
        salesman2.jobDetails.salary = 42;
        salesman2 = await dal.addUser(salesman2);

        store = new storeModel();
        store.name = 'bana';
        store.managerName = 'shahaf';
        store.phone = '0542458658';
        store.city = 'beersheva';
        store.address = 'rager12';
        store.area = 'south';
        store.channel = 'hot';
        let res = await dal.addStore(store);

        product1 = new productModel();
        product1.name = 'absulut';
        product1.retailPrice = 122;
        product1.salePrice = 133;
        product1.category = 'vodka';
        product1.subCategory = 'vodka';
        product1.minRequiredAmount = 1;
        product1.notifyManager = false;

        product2 = new productModel();
        product2.name = 'jhony walker';
        product2.retailPrice = 2222;
        product2.salePrice = 555;
        product2.category = 'wiskey';
        product2.subCategory = 'wiskey';
        product2.minRequiredAmount = 1;
        product2.notifyManager = true;

        product3 = new productModel();
        product3.name = 'smirnoff';
        product3.retailPrice = 12;
        product3.salePrice = 512;
        product3.category = 'vodka';
        product3.subCategory = 'vodka';
        product3.minRequiredAmount = 1;
        product3.notifyManager = true;

        res = await dal.addProduct(product1);
        res = await dal.addProduct(product2);
        res = await dal.addProduct(product3);

        enc1 = new encouragementModel();
        enc1.active = true;
        enc1.name = "lslsl";
        enc1.numOfProducts = 3;
        enc1.products = [product1._id];
        enc1.rate = 100;

        enc2 = new encouragementModel();
        enc2.active = true;
        enc2.name = "lswwlsl";
        enc2.numOfProducts = 2;
        enc2.products = [product1._id, product2._id];
        enc2.rate = 200;

        enc3 = new encouragementModel();
        enc3.active = true;
        enc3.numOfProducts = 3;
        enc3.name = "lslsssl";
        enc3.products = [product1._id, product2._id, product3._id];
        enc3.rate = 350;

        enc4 = new encouragementModel();
        enc4.active = true;
        enc4.name = "ss";
        enc4.numOfProducts = 5;
        enc4.products = [product3._id];
        enc4.rate = 75;

        res = await dal.addEncouragement(enc1);
        res = await dal.addEncouragement(enc2);
        res = await dal.addEncouragement(enc3);
        res = await dal.addEncouragement(enc4);

        product1 = await dal.addProduct(product1);
        product2 = await dal.addProduct(product2);

        let end = new Date();
        end.setDate(end.getDate() + 1);
        end.setHours(22);

        let start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(16);

        let saleReport = await createNewSalesReport();
        shift1  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman', 'salesReport':saleReport};
        shift2  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman', 'salesReport':saleReport};
        shift3  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman', 'salesReport':saleReport};
        shift4  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman', 'salesReport':saleReport};
        shifts.push(shift1);
        shifts.push(shift2);
    });

    afterEach(async function(){
        let res = await dal.cleanDb();
    });

    describe('test get XL sale report', function () {
        it('test get XL sale report not by manager', async function () {
            shifts[0].status = "FINISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await repoetService.getSaleReportXl(salesman.sessionId, shifts[0]);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('test get XL sale report not finish', async function () {
            shifts[0].status = "NOTFINISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await repoetService.getSaleReportXl(manager.sessionId, shifts[0]._id);
            expect(result).to.have.property('code', 404);
            expect(result).to.have.property('err', 'shift not finished status');
        });

        it('test get XL sale report shift not exist', async function () {
            shifts[0].status = "FINISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await repoetService.getSaleReportXl(manager.sessionId, "notexisting1");
            expect(result).to.have.property('code', 404);
            expect(result).to.have.property('err', 'shift not exist');
        });

        it('test get XL sale report valid', async function () {
            shifts[0].status = "FINISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await repoetService.getSaleReportXl(manager.sessionId, shifts[0]._id);
            expect(result).to.have.property('code', 200);
        });
    });

    describe('test get XL list salesman', function(){
        it('test get XL list salesman not by manager', async function () {
            let result = await repoetService.getSalesmanListXL(salesman.sessionId);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('test get XL list salesman by manager', async function () {
            let result = await repoetService.getSalesmanListXL(manager.sessionId);
            expect(result).to.have.property('code', 200);
        });
    });

    describe('test genarate monthly salesman hours report', function () {
        it('test genarate monthly salesman hours report valid', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();
            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0]));
            shifts[1] = (await dal.addShift(shifts[1]));
            shifts[2] = (await dal.addShift(shifts[2]));
            shifts[3] = (await dal.addShift(shifts[3]));

            let result = await repoetService.genarateMonthlyUserHoursReport(today.getFullYear(), today.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 12);
            assert.equal(result.report.salesmansData[1].numOfHours, 12);
        });

        it('test genarate monthly salesman hours report with not finish shift', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "PUBLISHED";
            shifts[1].status = "PUBLISHED";
            shifts[2].status = "PUBLISHED";
            shifts[3].status = "PUBLISHED";
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let result = await repoetService.genarateMonthlyUserHoursReport(today.getFullYear(), today.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 0);
            assert.equal(result.report.salesmansData[1].numOfHours, 0);
        });

        it('test genarate monthly salesman hours report with FINISH and PUBLISH shift', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "PUBLISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "PUBLISHED";
            shifts[3].status = "FINISHED";
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();
            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let result = await repoetService.genarateMonthlyUserHoursReport(today.getFullYear(), today.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 6);
            assert.equal(result.report.salesmansData[1].numOfHours, 6);
        });

        it('test genarate monthly salesman hours report with shift at the first day of the month', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth(), 1);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(new Date(shifts[0].endTime).getFullYear(), new Date(shifts[0].endTime).getMonth(), 1);
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth(), 1);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( new Date(shifts[0].endTime).getFullYear(), new Date(shifts[0].endTime).getMonth(), 1);
            shifts[2].endTime.setHours(22);

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let result = await repoetService.genarateMonthlyUserHoursReport(today.getFullYear(), today.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 12);
            assert.equal(result.report.salesmansData[1].numOfHours, 12);
        });

        it('test genarate monthly salesman hours report with shift at the last day of the month', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth() + 1, 0);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(shifts[0].startTime );
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[2].startTime).getFullYear(), new Date(shifts[2].startTime).getMonth() + 1, 0);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( shifts[2].startTime );
            shifts[2].endTime.setHours(22);


            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();
            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let result = await repoetService.genarateMonthlyUserHoursReport(today.getFullYear(), today.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 12);
            assert.equal(result.report.salesmansData[1].numOfHours, 12);
        });
    });

    describe('test get monthly salesman hours report', function () {
        it('test get monthly salesman hours report valid', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 12);
            assert.equal(result.report.salesmansData[1].numOfHours, 12);
        });

        it('test get monthly salesman hours report with not finish shift', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "PUBLISHED";
            shifts[1].status = "PUBLISHED";
            shifts[2].status = "PUBLISHED";
            shifts[3].status = "PUBLISHED";
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 0);
            assert.equal(result.report.salesmansData[1].numOfHours, 0);
        });

        it('test get monthly salesman hours report with FINISH and PUBLISH shift', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "PUBLISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "PUBLISHED";
            shifts[3].status = "FINISHED";
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 6);
            assert.equal(result.report.salesmansData[1].numOfHours, 6);
        });

        it('test get monthly salesman hours report with shift at the first day of the month', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth(), 1);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(new Date(shifts[0].endTime).getFullYear(), new Date(shifts[0].endTime).getMonth(), 1);
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth(), 1);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( new Date(shifts[0].endTime).getFullYear(), new Date(shifts[0].endTime).getMonth(), 1);
            shifts[2].endTime.setHours(22);

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 12);
            assert.equal(result.report.salesmansData[1].numOfHours, 12);
        });

        it('test get monthly salesman hours report with shift at the last day of the month', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth() + 1, 0);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(shifts[0].startTime );
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[2].startTime).getFullYear(), new Date(shifts[2].startTime).getMonth() + 1, 0);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( shifts[2].startTime );
            shifts[2].endTime.setHours(22);


            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 12);
            assert.equal(result.report.salesmansData[1].numOfHours, 12);
        });

        it('test get monthly salesman hours report not by manager', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth() + 1, 0);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(shifts[0].startTime );
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[2].startTime).getFullYear(), new Date(shifts[2].startTime).getMonth() + 1, 0);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( shifts[2].startTime );
            shifts[2].endTime.setHours(22);


            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();
            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(salesman.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('test get monthly salesman hours report still not genarate', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth() + 1, 0);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(shifts[0].startTime );
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[2].startTime).getFullYear(), new Date(shifts[2].startTime).getMonth() + 1, 0);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( shifts[2].startTime );
            shifts[2].endTime.setHours(22);


            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
        });
    });

    describe('test edit monthly salesman hours report', function () {
        it('test edit monthly salesman hours report valid', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
            assert.equal(result.report.salesmansData[0].numOfHours, 12);
            assert.equal(result.report.salesmansData[1].numOfHours, 12);

            let report = result.report;
            report.salesmansData[0].numOfHours = 8;
            report.salesmansData[1].numOfHours = 8;

            result = await repoetService.updateMonthlySalesmanHoursReport(manager.sessionId, date.getFullYear(), date.getMonth(), report);
            expect(result).to.have.property('code', 200);

            result = await repoetService.getMonthlyUserHoursReport(manager.sessionId, date.getFullYear(), date.getMonth());
            expect(result).to.have.property('code', 200);
        });

        it('test edit monthly salesman hours report not by manager', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth() + 1, 0);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(shifts[0].startTime );
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[2].startTime).getFullYear(), new Date(shifts[2].startTime).getMonth() + 1, 0);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( shifts[2].startTime );
            shifts[2].endTime.setHours(22);


            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();
            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let report = await  repoetService.getMonthlyUserHoursReport(today.getFullYear(), today.getMonth());
            let result = await repoetService.updateMonthlySalesmanHoursReport(salesman.sessionId, date.getFullYear(), date.getMonth(), report.report);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('test edit monthly salesman hours report still not genarate', async function () {
            shifts.push(shift4);
            shifts.push(shift3);
            shifts[0].status = "FINISHED";
            shifts[1].status = "FINISHED";
            shifts[2].status = "FINISHED";
            shifts[3].status = "FINISHED";

            shifts[0].startTime = new Date(new Date(shifts[0].startTime).getFullYear(), new Date(shifts[0].startTime).getMonth() + 1, 0);
            shifts[0].startTime.setHours(16);
            shifts[0].endTime = new Date(shifts[0].startTime );
            shifts[0].endTime.setHours(22);
            shifts[2].startTime = new Date(new Date(shifts[2].startTime).getFullYear(), new Date(shifts[2].startTime).getMonth() + 1, 0);
            shifts[2].startTime.setHours(16);
            shifts[2].endTime = new Date( shifts[2].startTime );
            shifts[2].endTime.setHours(22);


            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[2] = shift_object_to_model(shifts[2]);
            shifts[3] = shift_object_to_model(shifts[3]);

            let user1 = await dal.getUserByUsername('matan');
            let user2 = await dal.getUserByUsername('bigbezen');

            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();
            shifts[2].salesmanId = user2._id.toString();
            shifts[3].salesmanId = user2._id.toString();

            let res = await dal.updateUser(user1);
            res = await dal.updateUser(user2);

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[3] = (await dal.addShift(shifts[3])).toObject();

            let date  = new Date();
            let result = await repoetService.updateMonthlySalesmanHoursReport(manager.sessionId, date.getFullYear(), date.getMonth(), "still not genarate");
            expect(result).to.have.property('code', 404);
            expect(result).to.have.property('err', 'report still not genarated');
        });
    });
});