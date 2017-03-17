var assert              = require('chai').assert;
var expect              = require('chai').expect;
var axios               = require('axios');
let dal                 = require('../../src/DAL/dal');

let userModel           = require('../../src/Models/user');
let shiftModel          = require('../../src/Models/shift');
let storeModel          = require('../../src/Models/store');
let productModel        = require('../../src/Models/product');

process.env['DB'] = 'AcceptenceTestDb';

var main                = require('../../main');

var serverUrl = 'http://localhost:3000/';


describe('salesman acceptance test', function(){

    let manager;
    let salesman;
    let salesman2;
    let shift;
    let store;
    let product1;
    let product2;
    let product3;


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

    beforeEach(async function(){
        let res = await dal.cleanDb();

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        manager = await dal.addUser(manager);

        salesman2 = new userModel();
        salesman2.username = 'matan';
        salesman2.sessionId = 'salesmanSession';
        salesman2.personal = {
            id: '12345',
            firstName: 'israel',
            lastName: 'israeli',
            sex: 'male',
            birthday: new Date()
        };

        salesman = new userModel();
        salesman.username = 'matan';
        salesman.sessionId = 'salesmanSession';
        salesman.personal = {
            id: '121234',
            firstName: 'israel',
            lastName: 'israeli',
            sex: 'male',
            birthday: new Date()
        };
        salesman.startDate = new Date();
        salesman.contact = {
            address: {
                street: 'blabla street',
                number: '2',
                city: 'rishon',
                zip: '2134'
            },
            phone: '12345',
            email: 's@post.bgu.ac.il'
        };
        salesman.jobDetails = {
            userType: 'salesman'
        };
        salesman = await dal.addUser(salesman);
        product1 = new productModel();
        product2 = new productModel();
        product3 = new productModel();

        product1.name = 'vodka1';
        product2.name = 'vodka2';
        product3.name = 'vodka3';

        product1 = await dal.addProduct(product1);
        product2 = await dal.addProduct(product2);
        product3 = await dal.addProduct(product3);

        store = new storeModel();
        store.name = 'bana';
        store = await dal.addStore(store);

        shift = new shiftModel();
        shift.status = 'PUBLISHED';
        shift.startTime = new Date();
        shift.endTime = new Date();
        shift.storeId = store._id;
        shift.salesmanId = salesman._id;
        shift.salesReport = await createNewSalesReport();
        shift.sales = [];

    });

    afterEach(async function(){
        let res = await dal.cleanDb();
    });

    describe('test getCurrentShift', function(){
        it('get current shift valid', async function(){
            shift = await dal.addShift(shift);


            let result = await axios.get(serverUrl + 'salesman/getCurrentShift', {
                headers: {
                    sessionId: salesman.sessionId
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result).to.have.property('status', 200);

            expect(result.data).to.include.all.keys('salesmanId', 'store', 'startTime', 'salesReport', 'status');
        });

        it('getCurrentShift_strtedShift_returnsShift', async function(){
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.get(serverUrl + 'salesman/getCurrentShift', {
                headers: {
                    sessionId: salesman.sessionId
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result).to.have.property('status', 200);

            expect(result.data).to.include.all.keys('salesmanId', 'store', 'startTime', 'salesReport', 'status');
        });

        it('get current shift 0 shifts in system', async function(){
            let result = await axios.get(serverUrl + 'salesman/getCurrentShift', {
                headers: {
                    sessionId: salesman.sessionId
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result.response).to.have.property('status', 409);
        });
    });

    describe('test startShift', function(){
        it('test start shift valid', async function(){
            shift = await dal.addShift(shift);
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }

            let result = await axios.post(serverUrl + 'salesman/startShift', {
                    sessionId: salesman.sessionId,
                    shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });

        it('test start shift without sales report', async function(){
            shift = await dal.addShift(shift);
            shift = shift.toObject();
            shift.salesReport = {};

            let result = await axios.post(serverUrl + 'salesman/startShift', {
                sessionId: salesman.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 409);
        });

        it('test start shift unexiting Shift', async function(){
            shift = shift.toObject();

            let result = await axios.post(serverUrl + 'salesman/startShift', {
                sessionId: salesman.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 404);
        });

        it('test start shift with not user Shift', async function(){
            shift = await dal.addShift(shift);
            shift = shift.toObject();

            let result = await axios.post(serverUrl + 'salesman/startShift', {
                sessionId: manager.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 401);
        });

        it('test start not publish shift', async function(){
            shift.status = "ACTIVE";
            shift = await dal.addShift(shift);
            shift = shift.toObject();

            let result = await axios.post(serverUrl + 'salesman/startShift', {
                sessionId: salesman2.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 403);
        });
    });

    describe('test reportSale', function(){
        it('test report sale valid', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product1._id,
                quantity: 2
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);

            result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product2._id,
                quantity: 1
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);

            let dbShift = await dal.getShiftsByIds([shift._id]);
            dbShift = dbShift[0];
            expect(dbShift.sales).to.have.lengthOf(2);
        });

        it('test report sale non-positive quantity', async function() {
            for (let i = 0; i < shift.salesReport.length; i++) {
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product1._id,
                quantity: 0
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 409);

            result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product2._id,
                quantity: -1
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 409);
            let dbShift = await dal.getShiftsByIds([shift._id]);
            dbShift = dbShift[0];
            expect(dbShift.sales).to.have.lengthOf(0);
        });

        it('test report sale with non-existing productId', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: "objectId",
                quantity: 2
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 409);

            let dbShift = await dal.getShiftsByIds([shift._id]);
            dbShift = dbShift[0];
            expect(dbShift.sales).to.have.lengthOf(0);
        });

        it('test report sale not by user shift', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: manager.sessionId,
                shiftId: shift._id,
                productId: product1._id,
                quantity: 2
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 401);
        });

    });

    describe('test reportOpened', function(){
        it('test report opened valid', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product1._id,
                quantity: 2
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);

            result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product2._id,
                quantity: 1
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });

        it('test report opened non-positive quantity', async function() {
            for (let i = 0; i < shift.salesReport.length; i++) {
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product1._id,
                quantity: 0
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 409);

            result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: product2._id,
                quantity: -1
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 409);

        });

        it('test report opened with non-existing productId', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                productId: "objectId",
                quantity: 2
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 409);

        });

        it('test report opened not by user shift', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: manager.sessionId,
                shiftId: shift._id,
                productId: product1._id,
                quantity: 2
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 401);
        });
    });

    describe('test finishShift', function(){
        it('test finish shift valid', async function(){
            shift.status = "STARTED";
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift = await dal.addShift(shift);

            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].sold = i;
            }

            let result = await axios.post(serverUrl + 'salesman/finishShift', {
                sessionId: salesman.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });

        it('test finish shift without sales report', async function(){
            shift.status = "STARTED";
            shift = await dal.addShift(shift);
            shift = shift.toObject();
            shift.salesReport = {};

            let result = await axios.post(serverUrl + 'salesman/finishShift', {
                sessionId: salesman.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 409);
        });

        it('test finish shift unexiting Shift', async function(){
            shift.status = "STARTED";
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }

            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].sold = i;
            }

            let result = await axios.post(serverUrl + 'salesman/finishShift', {
                sessionId: salesman.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 404);
        });

        it('test finish shift with not user Shift', async function(){
            shift.status = "STARTED";
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift = await dal.addShift(shift);

            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].sold = i;
            }

            let result = await axios.post(serverUrl + 'salesman/finishShift', {
                sessionId: manager.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 401);
        });

        it('test finish not STARTED shift', async function(){
            shift.status = "FINISHES";
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift = await dal.addShift(shift);

            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].sold = i;
            }

            let result = await axios.post(serverUrl + 'salesman/finishShift', {
                sessionId: salesman.sessionId,
                shift: shift
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 403);
        });
    });
});

