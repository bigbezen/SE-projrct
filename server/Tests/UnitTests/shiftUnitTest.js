var assert              = require('chai').assert;
var expect              = require('chai').expect;
var mongoose            = require('mongoose');
var userModel           = require('../../src/Models/user');
var dal                 = require('../../src/DAL/dal');
var shiftService        = require('../../src/Services/shift/index');
var productService      = require('../../src/Services/product/index');
var storeService      = require('../../src/Services/store/index');


describe('shift unit test', function () {

    var manager;
    var salesman;
    var shift1;
    var shift2;
    var shifts = [];
    var store = {'name': 'bana', 'managerName': 'shahaf', 'phone': '0542458658', 'city': 'beersheva', 'address': 'rager12', 'area': 'south', 'channel': 'hot'};
    var product1 = { 'name': 'absulut', 'retailPrice': '122', 'salePrice': '133', 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': '111', 'notifyManager': 'false'};
    var product2 = { 'name': 'jhony walker', 'retailPrice': '2222', 'salePrice': '555', 'category': 'wiskey', 'subCategory': 'wiskey', 'minRequiredAmount': '12', 'notifyManager': 'true'};

    beforeEach(async function () {
        shifts = [];

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        var res = await dal.addUser(manager);

        salesman = new userModel();
        salesman.username = 'matan';
        salesman.sessionId = '12123434';
        salesman.jobDetails.userType = 'salesman';
        res = await dal.addUser(salesman);

        res = await productService.addProduct(manager.sessionId,product1);
        product1 = res.product;

        res = await productService.addProduct(manager.sessionId,product2);
        product2 = res.product;

        res = await storeService.addStore(manager.sessionId, store);

        var end = new Date();
        end.setDate(end.getDate() + 2);

        var start = new Date();
        start.setDate(start.getDate() + 1);

        shift1  = {'storeId': res.store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'status': "CREATED", 'type': 'salesman'};
        shift2  = {'storeId': res.store._id.toString(), 'startTime':start.toString(), 'endTime': end.toString(), 'status': "CREATED", 'type': 'salesman'};
        shifts.push(shift1);
        shifts.push(shift2);
    });

    afterEach(async function () {
        var res = await dal.cleanDb();
    });


    describe('test add shifts', function () {
        it('add shift not by manager', async function () {
            var res = await shiftService.addShifts(salesman.sessionId, shifts);
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err', 'user not authorized');
        });

        it('add shift with not exist store', async function () {
            shifts[0].storeId = mongoose.Types.ObjectId("notexisting1");
            var res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err', 'One or more of the stores does not exist');
        });

        it('add shift with expire start date', async function () {
            shifts[0].startTime =  new Date(99,11,24);
            var res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err', 'shifts dates are before current time');
        });

        it('add shift with expire finish date', async function () {
            shifts[0].endTime =  new Date(99,11,24).toString();
            var res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err', 'shifts dates are before current time');
        });

        it('add shift by manager', async function () {
            var res = await shiftService.addShifts(manager.sessionId, shifts);
            expect(res).to.have.property('code', 200);
            assert.equal(res.shiftArr.length, 2);
        });
    })
});