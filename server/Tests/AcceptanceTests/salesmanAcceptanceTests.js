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
    let shift;
    let store;


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

        salesman = new userModel();
        salesman.username = 'matan';
        salesman.sessionId = 'salesmanSession';
        salesman.personal = {
            id: '12345',
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
            email: 'steins@post.bgu.ac.il'
        };
        salesman.jobDetails = {
            userType: 'salesman'
        };
        salesman = await dal.addUser(salesman);

        let product1 = new productModel();
        let product2 = new productModel();
        let product3 = new productModel();

        product1.name = 'vodka1';
        product2.name = 'vodka2';
        product3.name = 'vodka3';

        product1 = await dal.addProduct(product1);
        product2 = await dal.addProduct(product2);
        product3 = await dal.addProduct(product3);

        store = new storeModel();
        store.name = 'bana';
        store = dal.addStore(store);

        shift = new shiftModel();
        shift.status = 'PUBLISHED';
        shift.startTime = new Date();
        shift.storeId = store._id;
        shift.salesmanId = salesman._id;
        shift.salesReport = await createNewSalesReport();
        shift.sales = {};
        shift = await dal.addShift(shift);

    });

    afterEach(async function(){
        let res = await dal.cleanDb();
    });

    describe('test getCurrentShift', function(){
        it('get current shift valid', async function(){
            let result = await axios.post(serverUrl + '/salesman/getCurrentShift', {
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            expect(result).to.have.property('status', 200);
        });
    });
});

