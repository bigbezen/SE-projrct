"use strict";

let assert              = require('chai').assert;
let expect              = require('chai').expect;
let mongoose            = require('mongoose');

let userModel           = require('../../src/Models/user');
let productModel        = require('../../src/Models/product');
let storeModel          = require('../../src/Models/store');
let shiftModel          = require('../../src/Models/shift');
let encouragementModel  = require('../../src/Models/encouragement');

let dal                 = require('../../src/DAL/dal');

let shiftService            = require('../../src/Services/shift/index');
let productService          = require('../../src/Services/product/index');
let storeService            = require('../../src/Services/store/index');
let encouragementsService   = require('../../src/Services/encouragements/index');


describe('shift unit test', function () {

    let manager;
    let salesman;
    let shift1;
    let shift2;
    let shifts = [];
    let store;
    let product1;
    let product2;
    let product3;

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

        for(productId of productsIds){
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

    beforeEach(async function () {
        shifts = [];

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        let res = await dal.addUser(manager);

        salesman = new userModel();
        salesman.username = 'matan';
        salesman.sessionId = '12123434';
        salesman.jobDetails.userType = 'salesman';
        res = await dal.addUser(salesman);

        store = new storeModel();
        store.name = 'bana';
        store.managerName = 'shahaf';
        store.phone = '0542458658';
        store.city = 'beersheva';
        store.address = 'rager12';
        store.area = 'south';
        store.channel = 'hot';
        res = await dal.addStore(store);

        product1 = new productModel();
        product1.name = 'absulut';
        product1.retailPrice = 122;
        product1.salePrice = 133;
        product1.category = 'vodka';
        product1.subCategory = 'vodka';
        product1.minRequiredAmount = 111;
        product1.notifyManager = false;

        product2 = new productModel();
        product2.name = 'jhony walker';
        product2.retailPrice = 2222;
        product2.salePrice = 555;
        product2.category = 'wiskey';
        product2.subCategory = 'wiskey';
        product2.minRequiredAmount = 12;
        product2.notifyManager = true;

        product3 = new productModel();
        product3.name = 'smirnoff';
        product3.retailPrice = 12;
        product3.salePrice = 512;
        product3.category = 'vodka';
        product3.subCategory = 'vodka';
        product3.minRequiredAmount = 12;
        product3.notifyManager = true;

        res = await dal.addProduct(product1);
        res = await dal.addProduct(product2);
        res = await dal.addProduct(product3);

        let enc1 = new encouragementModel();
        enc1.active = true;
        enc1.numOfProducts = 3;
        enc1.products = [product1._id];
        enc1.rate = 100;

        let enc2 = new encouragementModel();
        enc2.active = true;
        enc2.numOfProducts = 2;
        enc2.products = [product1._id, product2._id];
        enc2.rate = 200;

        let enc3 = new encouragementModel();
        enc3.active = true;
        enc3.numOfProducts = 3;
        enc3.products = [product1._id, product2._id, product3._id];
        enc3.rate = 350;

        let enc4 = new encouragementModel();
        enc4.active = true;
        enc4.numOfProducts = 5;
        enc4.products = [product3._id];
        enc4.rate = 75;

        res = await dal.addEncouragement(enc1);
        res = await dal.addEncouragement(enc2);
        res = await dal.addEncouragement(enc3);
        res = await dal.addEncouragement(enc4);


        let end = new Date();
        end.setDate(end.getDate() + 1);

        let start = new Date();
        start.setDate(start.getDate() + 1);

        shift1  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman'};
        shift2  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman'};
        shifts.push(shift1);
        shifts.push(shift2);
    });

    afterEach(async function () {
        let res = await dal.cleanDb();
    });


    describe('test add shifts', function () {
        it('add shift not by manager', async function () {
            let res = await shiftService.addShifts(salesman.sessionId, shifts);
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err', 'user not authorized');
        });

        it('add shift with not exist store', async function () {
            shifts[0].storeId = mongoose.Types.ObjectId("notexisting1");
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err', 'One or more of the stores does not exist');
        });

        it('add shift with expire start date', async function () {
            shifts[0].startTime =  new Date(99,11,24);
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err', 'shifts dates are before current time');
        });

        it('add shift with expire finish date', async function () {
            shifts[0].endTime =  new Date(99,11,24).toString();
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err', 'shifts dates are before current time');
        });

        it('add shift by manager', async function () {
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 200);
            assert.equal(res.shiftArr.length, 2);

            let dbShifts = await dal.getShiftsByIds([res.shiftArr[0]._id, res.shiftArr[1]._id]);
            expect(dbShifts).to.have.lengthOf(2);
            for(let shift of dbShifts){
                shift = shift.toObject();
                expect(shift).to.have.property('status', 'CREATED');
            }
        });
    });

    describe('test publish shifts', function(){
        it('publish shifts valid', async function(){
            shifts[0].status = "CREATED";
            shifts[1].status = "CREATED";

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[0]._id = shifts[0]._id.toString();
            shifts[1]._id = shifts[1]._id.toString();

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();

            let result = await shiftService.publishShifts(manager.sessionId, shifts);

            expect(result).to.have.property('code', 200);
            expect(result).to.not.have.property('nonSavedShifts');

            let dbShifts = await dal.getShiftsByIds(shifts.map(x => x._id));
            expect(dbShifts[0].toObject()).to.have.property('status', 'PUBLISHED');
            expect(dbShifts[1].toObject()).to.have.property('status', 'PUBLISHED');
        });

        it('publish shifts invalid sessionid', async function(){
            shifts[0].status = "CREATED";
            shifts[1].status = "CREATED";

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[0]._id = shifts[0]._id.toString();
            shifts[1]._id = shifts[1]._id.toString();

            let user1 = await dal.getUserByUsername('shahaf');
            let user2 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id;
            shifts[1].salesmanId = user2._id;

            let result = await shiftService.publishShifts('non existing sessionid', shifts);
            expect(result).to.have.property('code', 401);

            let dbShifts = await dal.getShiftsByIds(shifts.map(x => x._id))
            expect(dbShifts[0].toObject()).to.have.property('status', 'CREATED');
            expect(dbShifts[1].toObject()).to.have.property('status', 'CREATED');
        });

        it('publish shifts no permission', async function(){
            shifts[0].status = "CREATED";
            shifts[1].status = "CREATED";

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[0]._id = shifts[0]._id.toString();
            shifts[1]._id = shifts[1]._id.toString();

            let user1 = await dal.getUserByUsername('shahaf');
            shifts[0].salesmanId = user1._id;
            shifts[1].salesmanId = user1._id;

            let result = await shiftService.publishShifts(salesman.sessionId, shifts);
            expect(result).to.have.property('code', 401);

            let dbShifts = await dal.getShiftsByIds(shifts.map(x => x._id));
            expect(dbShifts[0].toObject()).to.have.property('status', 'CREATED');
            expect(dbShifts[1].toObject()).to.have.property('status', 'CREATED');
        });

        it('publish shifts that are not in the db', async function(){
            shifts[0].status = "CREATED";
            shifts[1].status = "CREATED";

            let user1 = await dal.getUserByUsername('shahaf');
            let user2 = await dal.getUserByUsername('matan');
            shifts[0]._id = "non existing";
            shifts[1]._id = "non existing";
            shifts[0].salesmanId = user1._id;
            shifts[1].salesmanId = user2._id;

            let result = await shiftService.publishShifts(manager.sessionId, shifts);
            expect(result).to.have.property('code', 409);
            let dbShifts = await shiftModel.find({});
            expect(dbShifts).to.have.lengthOf(0);
        });

        it('publish shifts with non existing user or a manager user', async function(){
            shifts[0].status = "CREATED";
            shifts[1].status = "CREATED";

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[0]._id = shifts[0]._id.toString();
            shifts[1]._id = shifts[1]._id.toString();

            let user1 = await dal.getUserByUsername('shahaf');
            shifts[0].salesmanId = user1._id;
            shifts[1].salesmanId = 'non existing user id';

            let result = await shiftService.publishShifts(manager.sessionId, shifts);
            expect(result).to.have.property('code', 409);

            let shift0 = (await dal.getShiftsByIds([shifts[0]._id]))[0];
            let shift1 = (await dal.getShiftsByIds([shifts[1]._id]))[0];
            expect(shift0.toObject()).to.have.property('status', 'CREATED');
            expect(shift1.toObject()).to.have.property('status', 'CREATED');
        });

        it('publish shifts with status different than CREATED', async function(){
            shifts[0].status = "CREATED";
            shifts[1].status = "PUBLISHED";

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts.push(shift_object_to_model(shifts[0]));
            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[2] = (await dal.addShift(shifts[2])).toObject();
            shifts[0]._id = shifts[0]._id.toString();
            shifts[1]._id = shifts[1]._id.toString();
            shifts[2]._id = shifts[2]._id.toString();

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id;
            shifts[1].salesmanId = user1._id;
            shifts[2].salesmanId = user1._id;

            let result = await shiftService.publishShifts(manager.sessionId, shifts);
            expect(result).to.have.property('code', 409);

            let shift0 = (await dal.getShiftsByIds([shifts[0]._id]))[0];
            let shift1 = (await dal.getShiftsByIds([shifts[1]._id]))[0];
            let shift2 = (await dal.getShiftsByIds([shifts[2]._id]))[0];
            expect(shift0.toObject()).to.have.property('status', 'CREATED');
            expect(shift1.toObject()).to.have.property('status', 'PUBLISHED');
            expect(shift2.toObject()).to.have.property('status', 'CREATED');

        });
    });

    describe('test salesman get current shift', function(){
        it('get current shift valid', async function(){
            shifts[0].status = "PUBLISHED";
            shifts[1].status = "CREATED";

            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[1].startTime = new Date();
            shifts[1].endTime = new Date();

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();

            let result = await shiftService.getSalesmanCurrentShift(salesman.sessionId);
            expect(result).to.have.property('code', 200);
            expect(result).to.have.property('shift');
            expect(result.shift.status).to.be.equal('PUBLISHED');

            //make sure the database shifts remains untouched
            let shift0 = (await dal.getShiftsByIds([shifts[0]._id]))[0];
            let shift1 = (await dal.getShiftsByIds([shifts[1]._id]))[0];
            expect(shift0.toObject()).to.have.property('status', 'PUBLISHED');
            expect(shift1.toObject()).to.have.property('status', 'CREATED');

        });

        it('get current shift non valid sessionid', async function(){
                shifts[0].status = "PUBLISHED";
                shifts[1].status = "CREATED";

                shifts[0].startTime = new Date();
                shifts[0].endTime = new Date();
                shifts[1].startTime = new Date();
                shifts[1].endTime = new Date();

                shifts[0] = shift_object_to_model(shifts[0]);
                shifts[1] = shift_object_to_model(shifts[1]);

                let user1 = await dal.getUserByUsername('matan');
                shifts[0].salesmanId = user1._id.toString();
                shifts[1].salesmanId = user1._id.toString();

                shifts[0] = (await dal.addShift(shifts[0])).toObject();
                shifts[1] = (await dal.addShift(shifts[1])).toObject();

                let result = await shiftService.getSalesmanCurrentShift('non existing session id');
                expect(result).to.have.property('code', 401);
        });

        it('get current shift there is no current shift', async function(){
            shifts[0].status = "PUBLISHED";
            shifts[1].status = "CREATED";

            shifts[0].startTime = new Date();
            shifts[0].startTime.setDate(shifts[0].startTime.getDate() - 1);
            shifts[0].endTime = new Date();
            shifts[1].startTime = new Date();
            shifts[1].endTime = new Date();

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();

            let result = await shiftService.getSalesmanCurrentShift(salesman.sessionId);
            expect(result).to.have.property('code', 409);
            expect(result).to.have.property('err');
        });
    });

    describe('test report sale', function(){
        it('report sale valid', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = parseInt(Math.random() * 10) + 1;
            let result = await shiftService.reportSale(salesman.sessionId, shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 200);

            shift = (await dal.getShiftsByIds([shift._id]))[0];
            let productReport = shift.salesReport.filter(x => x.productId.toString() == product1._id.toString())[0].toObject();
            expect(productReport).to.have.property('sold', quantity);
            expect(productReport).to.have.property('opened', 0);
            expect(productReport).to.have.property('stockStartShift', 0);
            expect(productReport).to.have.property('stockEndShift', 0);

            let quantity2 = parseInt(Math.random() * 10) + 1;
            result = await shiftService.reportSale(salesman.sessionId, shift._id.toString(), product1._id.toString(), quantity2);
            expect(result).to.have.property('code', 200);

            shift = (await dal.getShiftsByIds([shift._id]))[0];
            productReport = shift.salesReport.filter(x => x.productId.toString() == product1._id.toString())[0].toObject();
            expect(productReport).to.have.property('sold', quantity + quantity2);
            expect(productReport).to.have.property('opened', 0);
            expect(productReport).to.have.property('stockStartShift', 0);
            expect(productReport).to.have.property('stockEndShift', 0);
        });

        it("report sale by manager", async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportSale(manager.sessionId, shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 401);
        });

        it("report sale salesman is not this shift's salesman", async function(){
            let salesman2 = new userModel();
            salesman2.username = 'salesman';
            salesman2.sessionId = '1212343412';
            salesman2.jobDetails.userType = 'salesman';
            let res = await dal.addUser(salesman);

            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportSale(salesman2.sessionId, shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 401);
        });

        it('report sale invalid sessionid', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportSale('invalid sessionid', shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 401);
        });

        it("report sale invalid shift id", async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportSale(salesman.sessionId, "invalid8shif", product1._id.toString(), quantity);
            expect(result).to.have.property('code', 409);
        });

        it("report sale invalid product id", async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportSale(salesman.sessionId, shift._id.toString(), "invalid8shif", quantity);
            expect(result).to.have.property('code', 409);
        });
    });

    describe('test report opened', function(){
        it('report opened valid', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = parseInt(Math.random() * 10) + 1;
            let result = await shiftService.reportOpened(salesman.sessionId, shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 200);

            shift = (await dal.getShiftsByIds([shift._id]))[0];
            let productReport = shift.salesReport.filter(x => x.productId.toString() == product1._id.toString())[0].toObject();
            expect(productReport).to.have.property('opened', quantity);
            expect(productReport).to.have.property('sold', 0);
            expect(productReport).to.have.property('stockStartShift', 0);
            expect(productReport).to.have.property('stockEndShift', 0);

            let quantity2 = parseInt(Math.random() * 10) + 1;
            result = await shiftService.reportOpened(salesman.sessionId, shift._id.toString(), product1._id.toString(), quantity2);
            expect(result).to.have.property('code', 200);

            shift = (await dal.getShiftsByIds([shift._id]))[0];
            productReport = shift.salesReport.filter(x => x.productId.toString() == product1._id.toString())[0].toObject();
            expect(productReport).to.have.property('opened', quantity + quantity2);
            expect(productReport).to.have.property('sold', 0);
            expect(productReport).to.have.property('stockStartShift', 0);
            expect(productReport).to.have.property('stockEndShift', 0);
        });

        it("report opened by manager", async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportOpened(manager.sessionId, shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 401);
        });

        it("report opened salesman is not this shift's salesman", async function(){
            let salesman2 = new userModel();
            salesman2.username = 'salesman';
            salesman2.sessionId = '1212343412';
            salesman2.jobDetails.userType = 'salesman';
            let res = await dal.addUser(salesman);

            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportOpened(salesman2.sessionId, shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 401);
        });

        it('report opened invalid sessionid', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportOpened('invalid sessionid', shift._id.toString(), product1._id.toString(), quantity);
            expect(result).to.have.property('code', 401);
        });

        it("report opened invalid shift id", async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportOpened(salesman.sessionId, "invalid8shif", product1._id.toString(), quantity);
            expect(result).to.have.property('code', 409);
        });

        it("report opened invalid product id", async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let quantity = 2;
            let result = await shiftService.reportOpened(user1.sessionId, shift._id.toString(), "invalid8shif", quantity);
            expect(result).to.have.property('code', 409);
        });
    });

    describe('test get active shift encouragements', function(){
        it('get active shift encouragements valid', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.salesReport = await createNewSalesReport();
            shift.salesReport[0].sold = 9;
            shift.salesReport[1].sold = 9;
            shift.salesReport[2].sold = 15;

            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id;
            shift = (await dal.addShift(shift)).toObject();

            let result = await shiftService.getActiveShiftEncouragements(user1.sessionId, shift._id);
            expect(result).to.have.property('code', 200);
            expect(result).to.have.property('encouragements');

        });
    });


});