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
    let salesman2;
    let shift1;
    let shift2;
    let shifts = [];
    let store;
    let store2;
    let product1;
    let product2;
    let product3;
    let enc1;
    let enc2;
    let enc3;
    let enc4;
    let km = 100;
    let parking = 20;

    let shift_object_to_model = function(shiftObj){
        let shift = new shiftModel();
        shift.storeId = shiftObj.storeId;
        shift.startTime = shiftObj.startTime;
        shift.endTime = shiftObj.endTime;
        shift.status = shiftObj.status;
        shift.type = shiftObj.type;
        if('salesmanId' in shiftObj)
            shift.salesmanId = shiftObj.salesmanId;
        if('constraints' in shiftObj)
            shift.constraints = shiftObj.constraint;
        if('salesReport' in shiftObj)
            shift.salesReport = shiftObj.salesReport;
        if('sales' in shiftObj)
            shift.sales = shiftObj.sales;
        if('shiftComments' in shiftObj)
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
        manager = await dal.addUser(manager);

        salesman = new userModel();
        salesman.username = 'matan';
        salesman.sessionId = '12123434';
        salesman.jobDetails.userType = 'salesman';
        salesman = await dal.addUser(salesman);

        salesman2 = new userModel();
        salesman2.username = 'bigbezen';
        salesman2.sessionId = '1212343456';
        salesman2.jobDetails.userType = 'salesman';
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

        store2 = new storeModel();
        store2.name = 'bana2';
        store2.managerName = 'shahaf';
        store2.phone = '0542458658';
        store2.city = 'beersheva2';
        store2.address = 'rager12';
        store2.area = 'south2';
        store2.channel = 'hot2';
        res = await dal.addStore(store2);

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

        enc1 = new encouragementModel();
        enc1.active = true;
        enc1.numOfProducts = 3;
        enc1.products = [product1._id];
        enc1.rate = 100;

        enc2 = new encouragementModel();
        enc2.active = true;
        enc2.numOfProducts = 2;
        enc2.products = [product1._id, product2._id];
        enc2.rate = 200;

        enc3 = new encouragementModel();
        enc3.active = true;
        enc3.numOfProducts = 3;
        enc3.products = [product1._id, product2._id, product3._id];
        enc3.rate = 350;

        enc4 = new encouragementModel();
        enc4.active = true;
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

        let start = new Date();
        start.setDate(start.getDate() + 1);

        shift1  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman', 'status': 'CREATED', 'salesmanId': salesman._id, 'sales':[]};
        shift2  = {'storeId': store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman', 'status': 'CREATED', 'sales':[]};
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

    describe('test add shift comment', function () {
        it('add shift comment not by salesman', async function () {
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            res = await shiftService.addShiftComment(manager.sessionId, shifts[0]._id, "not user");
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err', 'user not authorized');
        });

        it('add shift comment not exist shift id', async function () {
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            res = await shiftService.addShiftComment(salesman.sessionId, mongoose.Types.ObjectId("notexisting1"), "new comment");
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err', 'user not authorized');
        });

        it('add shift comment salesman not an owner', async function () {
            let salesmanNotOwner = new userModel();
            salesmanNotOwner.username = 'aviram';
            salesmanNotOwner.sessionId = '1234567';
            salesmanNotOwner.jobDetails.userType = 'salesman';
            let res = await dal.addUser(salesmanNotOwner);

            res = await shiftService.addShifts(manager.sessionId, shifts);
            res = await shiftService.addShiftComment(salesmanNotOwner.sessionId, shifts[0]._id, "new comment");
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err', 'user not authorized');
        });

        it('add shift comment by salesman', async function () {
            shifts[0].salesmanId = salesman._id;
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();
            shifts[0]._id = shifts[0]._id.toString();
            shifts[1]._id = shifts[1]._id.toString();

            let res = await shiftService.addShiftComment(salesman.sessionId, shifts[0]._id, "new comment");
            expect(res).to.have.property('code', 200);
            res = await dal.getShiftsByIds([shifts[0]._id]);
            res = res[0];
            assert.equal(res.shiftComments[0], 'new comment');
        });
    });

    describe('test start shift', function(){
        it('start shift not by salesman', async function(){
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

            let result = await shiftService.startShift(manager.sessionId, shifts[0]);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('start shift not by salesman owner', async function(){
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

            let result = await shiftService.startShift(salesman2.sessionId, shifts[0]);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('start shift not exist shift', async function(){
            shifts[0].status = "PUBLISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[0].salesmanId = salesman._id.toString();
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            shifts[1].status = "PUBLISHED";
            shifts[1].startTime = new Date();
            shifts[1].endTime = new Date();
            shifts[1] = shift_object_to_model(shifts[1]);
            shifts[1].salesmanId = salesman._id.toString();

            let result = await shiftService.startShift(salesman.sessionId, shifts[1]);
            expect(result).to.have.property('code', 404);
            expect(result).to.have.property('err', 'shift not found');
        });

        it('start shift not published', async function(){
            shifts[0].status = "NOT-PUBLISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[0].salesmanId = salesman._id.toString();
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await shiftService.startShift(salesman.sessionId, shifts[0]);
            expect(result).to.have.property('code', 403);
            expect(result).to.have.property('err', 'shift not published');
        });

        it('start shift valid', async function(){
            shifts[0].status = "PUBLISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[0].salesmanId = salesman._id.toString();
            shifts[0].salesReport = [];
            shifts[0].salesReport.push({'productId': product1._id , 'stockStartShift': 0, 'stockEndShift': 0, 'sold': 0, 'opened': 0});
            shifts[0].salesReport.push({'productId': product2._id , 'stockStartShift': 0, 'stockEndShift': 0, 'sold': 0, 'opened': 0});
            shifts[0].salesReport.push({'productId': product3._id , 'stockStartShift': 0, 'stockEndShift': 0, 'sold': 0, 'opened': 0});
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            for(let i = 0 ;  i < shifts[0].salesReport.length; i++){
                shifts[0].salesReport[i].productId = shifts[0].salesReport[i].productId.toString();
                shifts[0].salesReport[i].stockStartShift =  2;
                shifts[0].salesReport[i].opened =  1;
                shifts[0].salesReport[i].stockEndShift =  1;
            }

            let result = await shiftService.startShift(salesman.sessionId, shifts[0]);
            expect(result).to.have.property('code', 200);

            result = await dal.getShiftsByIds([shifts[0]._id]);
            expect(result[0]).to.have.property('status', 'STARTED');

            for(let i = 0 ;  i < shifts[0].salesReport.length; i++){
                assert.equal(shifts[0].salesReport[i].stockStartShift, 2);
                assert.equal(shifts[0].salesReport[i].opened, 1);
                assert.equal(shifts[0].salesReport[i].stockEndShift, 1);
            }
        });
    });

    describe('test edit shift', function(){
        it('edit shift not by salesman', async function(){
            shifts[0].status = "CREATED";
            shifts[1].status = "STARTED";

            shifts[1].startTime = new Date();
            shifts[1].endTime = new Date();

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1]._id = shifts[0]._id;
            let result = await shiftService.editShift(salesman2.sessionId, shifts[0]);

            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('edit shift already started', async function(){
            shifts[0].status = "STARTED";
            shifts[1].status = "CREATED";

            shifts[1].startTime = new Date();
            shifts[1].endTime = new Date();

            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[1] = shift_object_to_model(shifts[1]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1]._id = shifts[0]._id;
            let result = await shiftService.editShift(manager.sessionId, shifts[0]);

            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'permission denied shift already started');
        });

        it('edit shift valid', async function(){
            shifts[0].status = "PUBLISHED";
            shifts[1].status = "CREATED";

            shifts[1].startTime = new Date();
            shifts[1].endTime = new Date();

            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();
            shifts[1].salesmanId = user1._id.toString();

            shifts[0] = (await dal.addShift(shifts[0]));

            shifts[1]._id = shifts[0]._id.toString();
            let result = await shiftService.editShift(manager.sessionId, shifts[1]);
            expect(result).to.have.property('code', 200);

            result = await dal.getShiftsByIds([shifts[0]._id]);
            result = result[0];

            expect(result).to.have.property('status', 'CREATED');
            assert.isTrue(new Date(result.startTime).toString()== new Date(shifts[1].startTime).toString());
            assert.equal(new Date(result.endTime).toString(),  new Date(shifts[1].endTime).toString());
        });
    });

    describe('test get salesman shifts', function(){
        it('get salesman shifts by salesman', async function(){
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

            let result = await shiftService.getSalesmanShifts(salesman.sessionId);
            expect(result).to.have.property('code', 200);
            assert.equal(result.shifts.length, 2);
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

            shifts[0].salesReport = await createNewSalesReport();
            shifts[1].salesReport = await createNewSalesReport();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();
            shifts[1] = (await dal.addShift(shifts[1])).toObject();

            let result = await shiftService.getSalesmanCurrentShift(salesman.sessionId);
            expect(result).to.have.property('code', 200);
            expect(result).to.have.property('shift');
            expect(result.shift.status).to.be.equal('PUBLISHED');
            expect(result.shift).to.include.all.keys('store', 'salesReport');
            let productNames = result.shift.salesReport.map(x => x.name);
            expect(productNames).to.include(product1.name, product2.name, product3.name);

            //make sure the database shifts remains untouched
            let shift0 = (await dal.getShiftsByIds([shifts[0]._id]))[0];
            let shift1 = (await dal.getShiftsByIds([shifts[1]._id]))[0];
            expect(shift0.toObject()).to.have.property('status', 'PUBLISHED');
            expect(shift1.toObject()).to.have.property('status', 'CREATED');

        });

        it('getCurrentShiftOnSTARTEDShift_retrievesCurrentShift', async function(){
             shifts[0].status = "STARTED";

             shifts[0].startTime = new Date();
             shifts[0].endTime = new Date();

            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();

            shifts[0].salesReport = await createNewSalesReport();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();


            let result = await shiftService.getSalesmanCurrentShift(salesman.sessionId);
            expect(result).to.have.property('code', 200);
            expect(result).to.have.property('shift');
            expect(result.shift.status).to.be.equal('STARTED');
            expect(result.shift).to.include.all.keys('store', 'salesReport');
            let productNames = result.shift.salesReport.map(x => x.name);
            expect(productNames).to.include(product1.name, product2.name, product3.name);
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
            let sales= [{'productId': product1._id.toString(), 'quantity': quantity}];
            let result = await shiftService.reportSale(salesman.sessionId, shift._id.toString(), sales);
            expect(result).to.have.property('code', 200);

            shift = (await dal.getShiftsByIds([shift._id]))[0];
            let productReport = shift.salesReport.filter(x => x.productId.toString() == product1._id.toString())[0].toObject();
            expect(productReport).to.have.property('sold', quantity);
            expect(productReport).to.have.property('opened', 0);
            expect(productReport).to.have.property('stockStartShift', 0);
            expect(productReport).to.have.property('stockEndShift', 0);

            let quantity2 = parseInt(Math.random() * 10) + 1;
            sales = [{'productId': product1._id.toString() ,'quantity': quantity2}];
            result = await shiftService.reportSale(salesman.sessionId, shift._id.toString(), sales);
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
            let sales = [{'productId': product1._id.toString() ,'quantity': quantity}];
            let result = await shiftService.reportSale(manager.sessionId, shift._id.toString(), sales);
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
            let sales = [{'productId': product1._id.toString() ,'quantity': quantity}];
            let result = await shiftService.reportSale(salesman2.sessionId, shift._id.toString(), sales);
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
            let sales = [{'productId': product1._id.toString() ,'quantity': quantity}];
            let result = await shiftService.reportSale('invalid sessionid', shift._id.toString(), sales);
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
            let sales = [{'productId':  product1._id.toString() ,'quantity': quantity}];
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
            let sales = [{'productId': 'invalid8shif' ,'quantity': quantity}];
            let result = await shiftService.reportSale(salesman.sessionId, shift._id.toString(),sales);
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportOpened(salesman.sessionId, shift._id.toString(), opens);
            expect(result).to.have.property('code', 200);

            shift = (await dal.getShiftsByIds([shift._id]))[0];
            let productReport = shift.salesReport.filter(x => x.productId.toString() == product1._id.toString())[0].toObject();
            expect(productReport).to.have.property('opened', quantity);
            expect(productReport).to.have.property('sold', 0);
            expect(productReport).to.have.property('stockStartShift', 0);
            expect(productReport).to.have.property('stockEndShift', 0);

            let quantity2 = parseInt(Math.random() * 10) + 1;
            opens = [{'productId':product1._id.toString(),'quantity':quantity2}];
            result = await shiftService.reportOpened(salesman.sessionId, shift._id.toString(), opens);
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportOpened(manager.sessionId, shift._id.toString(), opens);
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportOpened(salesman2.sessionId, shift._id.toString(), opens);
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportOpened('invalid sessionid', shift._id.toString(), opens);
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportOpened(salesman.sessionId, "invalid8shif", opens);
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
            let opens = [{'productId':"invalid8shif",'quantity':quantity}];
            let result = await shiftService.reportOpened(user1.sessionId, shift._id.toString(), opens);
            expect(result).to.have.property('code', 409);
        });
    });

    describe('test report expenses', function(){
        it('report expenses valid', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.startTime = new Date();
            shift.endTime = new Date();
            shift.salesReport = await createNewSalesReport();
            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id.toString();

            shift = (await dal.addShift(shift)).toObject();

            let result = await shiftService.reportExpenses(salesman.sessionId, shift._id.toString(), km, parking);
            expect(result).to.have.property('code', 200);

            shift = (await dal.getShiftsByIds([shift._id]))[0];
            expect(shift).to.have.property('numOfKM', km);
            expect(shift).to.have.property('parkingCost', parking);
        });

        it("report expenses by manager", async function(){
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportExpenses(manager.sessionId, shift._id.toString(), km, parking);
            expect(result).to.have.property('code', 401);
        });

        it("report expenses salesman is not this shift's salesman", async function(){
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportExpenses(salesman2.sessionId, shift._id.toString(), km, parking);
            expect(result).to.have.property('code', 401);
        });

        it('report expenses invalid sessionid', async function(){
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportExpenses('invalid sessionid', shift._id.toString(), km, parking);
            expect(result).to.have.property('code', 401);
        });

        it("report expenses invalid shift id", async function(){
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
            let opens = [{'productId':product1._id.toString(),'quantity':quantity}];
            let result = await shiftService.reportExpenses(salesman.sessionId, "invalid8shif", km, parking);
            expect(result).to.have.property('code', 409);
        });

        it("report expenses invalid km or parking", async function(){
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
            let opens = [{'productId':"invalid8shif",'quantity':quantity}];
            let result = await shiftService.reportExpenses(user1.sessionId, shift._id.toString(), km, -1);
            expect(result).to.have.property('code', 404);
            expect(result).to.have.property('err', 'illegal km or parking cost');
        });
    });

    describe('test get active shift encouragements', function(){
        it('get active shift encouragements valid', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.salesReport = await createNewSalesReport();
            for(let product of shift.salesReport)
            {
                if(product.productId.toString() == product1._id.toString())
                    product.sold = 9;
                if(product.productId.toString() == product2._id.toString())
                    product.sold = 9;
                if(product.productId.toString() == product3._id.toString())
                    product.sold = 15;
            }

            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id;
            shift = (await dal.addShift(shift)).toObject();

            let result = await shiftService.getActiveShiftEncouragements(user1.sessionId, shift._id);
            expect(result).to.have.property('code', 200);
            expect(result).to.have.property('encouragements');

            for(let earnedEnc of result.encouragements){
                if(earnedEnc.encouragement.toString() == enc1._id.toString())
                    expect(earnedEnc.count).to.be.equal(3);
                if(earnedEnc.encouragement.toString() == enc2._id.toString())
                    expect(earnedEnc.count).to.be.equal(1);
                if(earnedEnc.encouragement.toString() == enc3._id.toString())
                    expect(earnedEnc.count).to.be.equal(1);
                if(earnedEnc.encouragement.toString() == enc4._id.toString())
                    expect(earnedEnc.count).to.be.equal(3);
            }
        });

        it('get active shift encouragements invalid sessionId', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.salesReport = await createNewSalesReport();
            for(let product of shift.salesReport)
            {
                if(product.productId.toString() == product1._id.toString())
                    product.sold = 9;
                if(product.productId.toString() == product2._id.toString())
                    product.sold = 9;
                if(product.productId.toString() == product3._id.toString())
                    product.sold = 15;
            }

            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id;
            shift = (await dal.addShift(shift)).toObject();

            let result = await shiftService.getActiveShiftEncouragements('invalid sessionId', shift._id);
            expect(result).to.have.property('code', 401);

        });

        it('get active shift encouragements invalid shiftId', async function(){
            let shift = shifts[0];
            shift.status = "STARTED";

            shift.salesReport = await createNewSalesReport();
            for(let product of shift.salesReport)
            {
                if(product.productId.toString() == product1._id.toString())
                    product.sold = 9;
                if(product.productId.toString() == product2._id.toString())
                    product.sold = 9;
                if(product.productId.toString() == product3._id.toString())
                    product.sold = 15;
            }

            shift = shift_object_to_model(shift);

            let user1 = await dal.getUserByUsername('matan');
            shift.salesmanId = user1._id;
            shift = (await dal.addShift(shift)).toObject();

            let result = await shiftService.getActiveShiftEncouragements(user1.sessionId, 'invalid8shif');
            expect(result).to.have.property('code', 409);

        });
    });

    describe('test get shifts from date', function(){
        it('get shifts from date valid', async function(){
            for(let shift of shifts){
                shift = shift_object_to_model(shift);
                shift.salesmanId = salesman._id;
                let res = await dal.addShift(shift);
            }

            let result = await shiftService.getShiftsFromDate(manager.sessionId, new Date());
            expect(result).to.have.property('code', 200);
            expect(result).to.have.property('shiftArr');
            for(let shift of result.shiftArr){
                let i;
                if(shift._id == shifts[0]._id)
                    i = 0;
                else
                    i = 1;
                expect(shift).to.include.all.keys('store', 'startTime', 'endTime', 'status', 'salesman');
                expect((new Date(shifts[0].startTime)).getTime()).to.be.equal(shift.startTime.getTime());
                expect((new Date(shifts[0].endTime)).getTime()).to.be.equal(shift.endTime.getTime());
                expect(shift.store).to.be.a('object');
                expect(shift.salesman).to.be.a('object');

            }
        });

        it('test get shifts from date invalid user', async function(){
            for(let shift of shifts){
                shift = shift_object_to_model(shift);
                shift.salesmanId = salesman._id;
                let res = await dal.addShift(shift);
            }

            let result = await shiftService.getShiftsFromDate("not valid sessionid", new Date());
            expect(result).to.have.property('code', 401);
        });

        it('tst get shifts from date with 0 shifts in db', async function(){
            let result = await shiftService.getShiftsFromDate(manager.sessionId, new Date(0));
            expect(result).to.have.property('code', 200);
            expect(result.shiftArr).to.have.lengthOf(0);
        })
    });

    describe('test end shift', function(){
        it('end shift not by salesman', async function(){
            shifts[0].status = "PUBLISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await shiftService.endShift(manager.sessionId, shifts[0]);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('end shift not by salesman owner', async function(){
            shifts[0].status = "PUBLISHED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);

            let user1 = await dal.getUserByUsername('matan');
            shifts[0].salesmanId = user1._id.toString();

            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await shiftService.endShift(salesman2.sessionId, shifts[0]);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err', 'user not authorized');
        });

        it('end shift not exist shift', async function(){
            shifts[0].status = "STARTED";
            shifts[1].status = "STARTED";

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

            let result = await shiftService.endShift(salesman.sessionId, shifts[1]);
            expect(result).to.have.property('code', 404);
            expect(result).to.have.property('err', 'shift not found');
        });

        it('end shift not started', async function(){
            shifts[0].status = "NOT-started";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[0].salesmanId = salesman._id.toString();
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            let result = await shiftService.endShift(salesman.sessionId, shifts[0]);
            expect(result).to.have.property('code', 403);
            expect(result).to.have.property('err', 'shift not started');
        });

        it('end shift valid', async function(){
            shifts[0].status = "STARTED";
            shifts[0].startTime = new Date();
            shifts[0].endTime = new Date();
            shifts[0] = shift_object_to_model(shifts[0]);
            shifts[0].salesmanId = salesman._id.toString();
            shifts[0].salesReport = [];
            shifts[0].salesReport.push({'productId': product1._id, 'stockStartShift': 0, 'stockEndShift': 0, 'sold': 0, 'opened': 0});
            shifts[0].salesReport.push({'productId': product2._id, 'stockStartShift': 0, 'stockEndShift': 0, 'sold': 0, 'opened': 0});
            shifts[0].salesReport.push({'productId': product3._id, 'stockStartShift': 0, 'stockEndShift': 0, 'sold': 0, 'opened': 0});
            shifts[0] = (await dal.addShift(shifts[0])).toObject();

            for(let i = 0 ;  i < shifts[0].salesReport.length; i++){
                shifts[0].salesReport[i].productId = shifts[0].salesReport[i].productId.toString();
                shifts[0].salesReport[i].stockStartShift =  2;
                shifts[0].salesReport[i].opened =  1;
                shifts[0].salesReport[i].stockEndShift =  1;
            }

            let result = await shiftService.endShift(salesman.sessionId, shifts[0]);
            expect(result).to.have.property('code', 200);

            result = await dal.getShiftsByIds([shifts[0]._id]);
            expect(result[0]).to.have.property('status', 'FINISHED');

            for(let i = 0 ;  i < shifts[0].salesReport.length; i++){
                assert.equal(shifts[0].salesReport[i].stockStartShift, 2);
                assert.equal(shifts[0].salesReport[i].opened, 1);
                assert.equal(shifts[0].salesReport[i].stockEndShift, 1);
            }
        });
    });

    describe('test delete shift', function () {
        it('delete shift not by manager', async function() {
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            let result = await shiftService.deleteShift(salesman.sessionId, 'shiftId');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'shift return null');

            //get all the shifts to ensure that the product is not removed
            let dbShifts = await dal.getShiftsByIds([res.shiftArr[0]._id, res.shiftArr[1]._id]);
            expect(dbShifts).to.have.lengthOf(2);
        });

        it('delete shift by manager', async function() {
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            let result = await shiftService.deleteShift(manager.sessionId, res.shiftArr[0]._id);
            assert.equal(result.err, null);
            assert.equal(result.code, 200, 'code 200');

            //get all the shifts to ensure that the product is not removed
            let dbShifts = await dal.getShiftsByIds([res.shiftArr[0]._id]);
            expect(dbShifts).to.have.lengthOf(0);
        });

        it('delete started shift', async function() {
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            res.shiftArr[0].status = "STARTED";
            let result = await dal.updateShift(  res.shiftArr[0]);
            result = await shiftService.deleteShift(manager.sessionId, res.shiftArr[0]._id);
            assert.equal(result.err, 'permission denied shift already started');
            assert.equal(result.code, 401, 'code 401');

            //get all the shifts to ensure that the product is not removed
            let dbShifts = await dal.getShiftsByIds([res.shiftArr[0]._id, res.shiftArr[1]._id]);
            expect(dbShifts).to.have.lengthOf(2);
        });
    });

    describe('test test get month shifts', function () {
        it('get shift month', async function() {
            shifts[0].startTime = new Date(2018,1,1);
            shifts[0].endTime = new Date(2018,1,1);
            let res = await shiftService.addShifts(manager.sessionId, shifts);
            shifts[0].status = "FINISHED";
            shifts[0]._id = res.shiftArr[0]._id;
            shifts[1].status = "FINISHED";
            shifts[1]._id = res.shiftArr[1]._id;
            for(let shift of shifts) {
                res = await dal.updateShift(shift);
            }

            //get all the shifts to ensure that the product is not removed
            let date =  new Date();
            let dbShifts = await dal.getMonthShifts(date.getFullYear(), date.getMonth());
            expect(dbShifts).to.have.lengthOf(1);
        });
    });

    describe('test edit sale', function(){
        it('edit sale not by salesman', async function() {
            let saleTime = new Date();
            shift1.salesReport = [{
                'productId': product1,
                'stockStartShift': 4,
                'stockEndShift': 4,
                'sold': 13,
                'opened': 0}];
            shift1.sales.push({'productId':product1,
                'timeOfSale': saleTime,
                'quantity': 2});

            shift1 = await dal.addShift(shift_object_to_model(shift1));
            let result = await shiftService.editSale(manager.sessionId, shift1._id.toString(),product1._id.toString(), saleTime, 2);
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');

            let res = await dal.getShiftsByIds([shift1._id]);
            assert.equal(res[0].sales[0].quantity, 2);
        });

        it('edit sale negative quantety', async function() {
                let saleTime = new Date();
                shift1.salesReport = [{
                    'productId': product1,
                    'stockStartShift': 4,
                    'stockEndShift': 4,
                    'sold': 13,
                    'opened': 0}];
                shift1.sales.push({'productId':product1,
                    'timeOfSale': saleTime,
                    'quantity': 2});

                shift1 = await dal.addShift(shift_object_to_model(shift1));
                let result = await shiftService.editSale(salesman.sessionId, shift1._id.toString(),product1._id.toString(), saleTime, -1);
                assert.equal(result.err, 'quantity cannot be negative');
                assert.equal(result.code, 400, 'code 400');

                let res = await dal.getShiftsByIds([shift1._id]);
                assert.equal(res[0].sales[0].quantity, 2);
        });

        it('edit sale shift not found', async function() {
            let saleTime = new Date();
            shift1.salesReport = [{
                'productId': product1,
                'stockStartShift': 4,
                'stockEndShift': 4,
                'sold': 13,
                'opened': 0}];
            shift1.sales.push({'productId':product1,
                'timeOfSale': saleTime,
                'quantity': 2});

            shift1 = await dal.addShift(shift_object_to_model(shift1));
            let result = await shiftService.editSale(salesman.sessionId, "notexisting1", product1._id.toString(), saleTime, 2);
            assert.equal(result.err, 'shift not found');
            assert.equal(result.code, 404, 'code 400');
        });

        it('edit sale product not found', async function() {
            let saleTime = new Date();
            shift1.salesReport = [{
                'productId': product1,
                'stockStartShift': 4,
                'stockEndShift': 4,
                'sold': 13,
                'opened': 0}];
            shift1.sales.push({'productId':product1,
                'timeOfSale': saleTime,
                'quantity': 2});

            shift1 = await dal.addShift(shift_object_to_model(shift1));
            let result = await shiftService.editSale(salesman.sessionId, shift1._id.toString(),"notexisting1", saleTime, 2);
            assert.equal(result.err, 'product not found');
            assert.equal(result.code, 404, 'code 404');

            let res = await dal.getShiftsByIds([shift1._id]);
            assert.equal(res[0].sales[0].quantity, 2);
        });

        it('edit sale valid', async function() {
            let saleTime = new Date();
            shift1.salesReport = [{
                'productId': product1,
                'stockStartShift': 4,
                'stockEndShift': 4,
                'sold': 13,
                'opened': 0}];
            shift1.sales.push({'productId':product1,
                'timeOfSale': saleTime,
                'quantity': 2});

            shift1 = await dal.addShift(shift_object_to_model(shift1));
            let result = await shiftService.editSale(salesman.sessionId, shift1._id.toString(), product1._id.toString(), saleTime, 0);
            assert.equal(result.code, 200, 'code 404');

            let res = await dal.getShiftsByIds([shift1._id]);
            assert.equal(res[0].sales[0].quantity, 0);
            assert.equal(res[0].salesReport[0].sold, 11);
        });
    });
});