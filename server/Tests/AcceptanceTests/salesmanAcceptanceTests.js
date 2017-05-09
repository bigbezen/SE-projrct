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
    let km = 20;
    let parking = 100;


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

    describe('test edit sale', function(){
        it('test edit sale valid', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);
            let timeOfSale = new Date();
            let result = axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales:[{productId: product1._id,
                    quantity: 2,
                    timeOfSale: timeOfSale}]
            }).then(function(info){
                expect(result).to.have.property('status', 200);
                let res = axios.post(serverUrl + 'salesman/editSale', {
                    sessionId: salesman.sessionId,
                    shiftId: shift._id,
                    productId: product1._id,
                    saleTime: timeOfSale,
                    quantity: 10
                }).then(async function(info){
                    return info;
                }).catch(async function(err){
                    return err;
                });
                expect(res).to.have.property('status', 200);
            }).catch(async function(err){
                return err;
            });
        });

        it('test edit sale unexisting sale', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);
            let timeOfSale = new Date();

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales:[{productId: product1._id,
                    quantity: 2,
                    timeOfSale: timeOfSale}]
            }).then(async function(){
                result = await axios.post(serverUrl + 'salesman/editSale', {
                    sessionId: salesman.sessionId,
                    shiftId: shift._id,
                    productId: product1._id,
                    saleTime: new Date(2,2,1990),
                    quantity: 10
                }).then(async function(info){
                    return info;
                }).catch(async function(err){
                    return err;
                });
                expect(result.response).to.have.property('status', 404);
            });
        });

        it('test edit sale unexiting Shift', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);
            let timeOfSale = new Date();

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales:[{productId: product1._id,
                    quantity: 2,
                    timeOfSale: timeOfSale}]
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result).to.have.property('status', 200);

            result = await axios.post(serverUrl + 'salesman/editSale', {
                sessionId: salesman.sessionId,
                shiftId: "notexisting1",
                productId: product1._id,
                saleTime: timeOfSale,
                quantity: 10
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result.response).to.have.property('status', 404);
        });

        it('test edit sale not by shift salesman', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);
            let timeOfSale = new Date();

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales:[{productId: product1._id,
                    quantity: 2,
                    timeOfSale: timeOfSale}]
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result).to.have.property('status', 200);

            result = await axios.post(serverUrl + 'salesman/editSale', {
                sessionId: "notExist",
                shiftId: shift._id,
                productId: product1._id,
                saleTime: timeOfSale,
                quantity: 10
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result.response).to.have.property('status', 401);
        });

        it('test edit sale unexisting product', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);
            let timeOfSale = new Date();

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales:[{productId: product1._id,
                    quantity: 2,
                    timeOfSale: timeOfSale}]
            }).then(async function(info){
                result = await axios.post(serverUrl + 'salesman/editSale', {
                    sessionId: salesman.sessionId,
                    shiftId: shift._id,
                    productId: "notexisting1",
                    saleTime: timeOfSale,
                    quantity: 10
                }).then(async function(info){
                    return info;
                }).catch(async function(err){
                    expect(err.response).to.have.property('status', 404);
                });
            }).catch(async function(err){
                return err;
            });
        });

        it('test edit sale with negative quantity', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);
            let timeOfSale = new Date();

            let result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales:[{productId: product1._id,
                    quantity: 2,
                    timeOfSale: timeOfSale}]
            }).then(function(info){
                result = axios.post(serverUrl + 'salesman/editSale', {
                    sessionId: salesman.sessionId,
                    shiftId: shift,
                    productId: product1._id,
                    saleTime: timeOfSale,
                    quantity: -1
                }).then(async function(info){
                    expect(info.response).to.have.property('status', 400);
                }).catch(async function(err){
                    return err;
                });
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result).to.have.property('status', 200);

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
                sales:[{productId: product1._id,
                quantity: 2}]
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);

            result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales:[{productId: product2._id,
                    quantity: 1}]
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
                sales: [{productId: product1._id,
                quantity: 0}]
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 409);

            result = await axios.post(serverUrl + 'salesman/reportSale', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                sales: [{productId: product2._id,
                quantity: -1}]
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
                sales: [{productId: "objectId",
                quantity: 2}]
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
                sales:[{productId: product1._id,
                quantity: 2}]
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 401);
        });

    });

    describe('test expenses', function(){
        it('test report expenses valid', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportExpenses', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                km: km,
                parking: parking
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);

            let dbShift = await dal.getShiftsByIds([shift._id]);
            dbShift = dbShift[0];
            expect(dbShift).to.have.property('numOfKM',km);
            expect(dbShift).to.have.property('parkingCost',parking);
        });

        it('test report expenses non-positive km', async function() {
            for (let i = 0; i < shift.salesReport.length; i++) {
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportExpenses', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                km: -1,
                parking: parking
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 404);
        });

        it('test report expenses non-positive parking', async function() {
            for (let i = 0; i < shift.salesReport.length; i++) {
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportExpenses', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                km: km,
                parking: -1
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 404);
        });

        it('test report expenses not by user shift', async function(){
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift.status = "STARTED";
            shift = await dal.addShift(shift);

            let result = await axios.post(serverUrl + 'salesman/reportExpenses', {
                sessionId: manager.sessionId,
                shiftId: shift._id,
                km: km,
                parking: parking
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
                opens:[{productId: product1._id,
                quantity: 2}]
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);

            result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                opens:[{productId: product2._id,
                quantity: 1}]
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
                opens:[{productId: product1._id,
                quantity: 0}]
            }).then(async function (info) {
                return info;
            }).catch(async function (err) {
                return err;
            });

            expect(result.response).to.have.property('status', 409);

            result = await axios.post(serverUrl + 'salesman/reportOpened', {
                sessionId: salesman.sessionId,
                shiftId: shift._id,
                opens:[{productId: product2._id,
                quantity: -1}]
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
                opens:[{productId: "objectId",
                quantity: 2}]
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
                opens:[{productId: product1._id,
                quantity: 2}]
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

    describe('test getShiftFromDate', function(){
        it('test get shift from date valid', async function(){
            shift.status = "STARTED";
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift = await dal.addShift(shift);

            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].sold = i;
            }

            let result = await axios.get(serverUrl + 'management/getShiftsFromDate?fromDate=' + new Date(), {
                headers: {
                    sessionid: salesman.sessionId
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result).to.have.property('status', 200);
        });

        it('test get shift from date invalid parameters', async function(){
            shift.status = "STARTED";
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift = await dal.addShift(shift);

            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].sold = i;
            }

            let result = await axios.get(serverUrl + 'management/getShiftsFromDate?fromDate=' + new Date(), {
                headers: {
                    notSessionId: salesman.sessionId
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result.response).to.have.property('status', 404);
        });

        it('test get shift from date invalid date', async function(){
            shift.status = "STARTED";
            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].stockStartShift = i;
            }
            shift = await dal.addShift(shift);

            for(let i=0; i<shift.salesReport.length; i++){
                shift.salesReport[i].sold = i;
            }

            let result = await axios.get(serverUrl + 'management/getShiftsFromDate?fromDate=' + 12, {
                headers: {
                    sessionid: salesman.sessionId
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
        });
    });
});

