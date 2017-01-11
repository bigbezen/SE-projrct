"use strict";

let assert              = require('chai').assert;
let expect              = require('chai').expect;
let mongoose            = require('mongoose');

let userModel           = require('../../src/Models/user');
let productModel        = require('../../src/Models/product');
let storeModel          = require('../../src/Models/store');
let shiftModel          = require('../../src/Models/shift');

let dal                 = require('../../src/DAL/dal');

let shiftService        = require('../../src/Services/shift/index');
let productService      = require('../../src/Services/product/index');
let storeService        = require('../../src/Services/store/index');


describe('shift unit test', function () {

    let manager;
    let salesman;
    let shift1;
    let shift2;
    let shifts = [];
    let store;
    let product1;
    let product2;

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

        let product1 = new productModel();
        product1.name = 'absulut';
        product1.retailPrice = 122;
        product1.salePrice = 133;
        product1.category = 'vodka';
        product1.subCategory = 'vodka';
        product1.minRequiredAmount = 111;
        product1.notifyManager = false;

        let product2 = new productModel();
        product2.name = 'jhony walker';
        product2.retailPrice = 2222;
        product2.salePrice = 555;
        product2.category = 'wiskey';
        product2.subCategory = 'wiskey';
        product2.minRequiredAmount = 12;
        product2.notifyManager = true;

        res = await dal.addProduct(product1);
        res = await dal.addProduct(product2);

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
            expect(res).to.have.property('err', null);
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
        });
    });


});