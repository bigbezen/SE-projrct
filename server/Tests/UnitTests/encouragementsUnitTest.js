let assert                     = require('chai').assert;
let dal                        = require('../../src/DAL/dal');
let encouragementServices      = require('../../src/Services/encouragements/index');
let productServices            = require('../../src/Services/product/index');
let userModel                  = require('../../src/Models/user');
let mongoose                   = require('mongoose');

describe('encouragements unit test', function () {

    let manager;
    let notManager;
    let newEncouragement;
    let editEncouragement;
    let product1;
    let product2;
    beforeEach(async function () {
        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        let res = await dal.addUser(manager);

        notManager = new userModel();
        notManager.username = 'matan';
        notManager.sessionId = '12123434';
        notManager.jobDetails.userType = 'salesman';
        res = await dal.addUser(notManager);

        product1 = { 'name': 'absulut', 'retailPrice': '122', 'salePrice': '133', 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': '111', 'notifyManager': 'false'};
        product2 = { 'name': 'jhony walker', 'retailPrice': '2222', 'salePrice': '555', 'category': 'wiskey', 'subCategory': 'wiskey', 'minRequiredAmount': '12', 'notifyManager': 'true'};

        res = await productServices.addProduct(manager.sessionId,product1);
        product1 = res.product;

        res = await productServices.addProduct(manager.sessionId,product2);
        product2 = res.product;

        newEncouragement = {'name':'vodka', 'active': true, 'numOfProducts': '2', 'rate': '100', 'products': []};
        editEncouragement = {'name':'wein', 'active': false, 'numOfProducts': '5', 'rate': '120', 'products': []};
        newEncouragement.products.push(product1._id);
        newEncouragement.products.push(product2._id);
        editEncouragement.products.push(product1._id);
    });

    afterEach(async function () {
        let res= await dal.cleanDb();
    });

    describe('test add encouragement', function (){
        it('add encouragement not by manager',async function () {
            let result = await encouragementServices.addEncouragement(notManager.sessionId, newEncouragement);
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.isNull(result.encouragement);

            //get all the encouragement to ensure that the encouragement not added
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 0, 'the db not contains any encouragement');
        });

        it('add encouragement by manager', async function () {
            let result = await dal.getAllEncouragements();
            assert.equal(result.length, 0, 'the db clean');

            result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');
            assert.equal(result.encouragement.numOfProducts,newEncouragement.numOfProducts);
            assert.equal(result.encouragement.rate,newEncouragement.rate);
            assert.equal(result.encouragement.products.length,2);
            //get all the encouragement to ensure that the encouragement  added
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1, 'the db contains the new encouragement');
        });

        it('add encouragement not existing products', async function () {
            let result = await dal.getAllEncouragements();
            assert.equal(result.length, 0, 'the db clean');
            newEncouragement.products.push( mongoose.Types.ObjectId("notexisting1"));

            result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            assert.equal(result.err,'product not found');
            assert.equal(result.code, 404, 'code 404 not found');

            //get all the encouragement to ensure that the encouragement not added
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 0, 'the db contains the new encouragement');
        });
    });

    describe('test edit encouragement', function () {
        it('edit encouragement not by manager', async function () {
            //add new encouragement
            let product = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);

            let result = await encouragementServices.editEncouragement(notManager.sessionId, editEncouragement);
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.encouragement, null, 'encouragement return null');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.strictEqual(result[0].active, newEncouragement.active, 'same active like the newEncouragement');
            assert.equal(result[0].numOfProducts, newEncouragement.numOfProducts, 'same numOfProducts like the newEncouragement');
            assert.equal(result[0].rate, newEncouragement.rate, 'same rate like the newEncouragement');
        });

        it('edit encouragement by manager', async function () {
            //add new encouragement
            let encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            let result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.strictEqual(result[0].active, editEncouragement.active, 'same active like the newEncouragement');
            assert.equal(result[0].numOfProducts, editEncouragement.numOfProducts, 'same numOfProducts like the newEncouragement');
            assert.equal(result[0].rate, editEncouragement.rate, 'same rate like the newEncouragement');
        });

        it('edit unexist encouragement', async function () {
            editEncouragement._id = "notexisting1";
            let result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 400);
            assert.equal(result.err, 'cannot edit this encouragement');
        });

        it('edit encouragement active', async function () {
            //add new encouragement
            let encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            let result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.strictEqual(result[0].active, editEncouragement.active, 'same active like the newEncouragement');
        });

        it('edit encouragement numOfProducts', async function () {
            //add new encouragement
            let encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            let result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.equal(result[0].numOfProducts, editEncouragement.numOfProducts, 'same active like the newEncouragement');
        });

        it('edit encouragement rate', async function () {
            //add new encouragement
            let encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            let result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.equal(result[0].rate, editEncouragement.rate, 'same active like the newEncouragement');
        });

        it('edit encouragement by existing product', async function () {
            //add new encouragement
            let encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            let result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.ok(result[0].products[0].equals(editEncouragement.products[0]));
        });

        it('edit encouragement by not existing product', async function () {
            //add new encouragement
            let encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            editEncouragement.products.push( mongoose.Types.ObjectId("notexisting1"));
            let result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 404, 'code 404');
            assert.equal(result.err, 'product not found');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.ok(result[0].products[0].equals(newEncouragement.products[0]));
        });
    });

    describe('test delete encouragement', function () {
        it('delete encouragement not by manager', async function() {
            let result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.deleteEncouragement(notManager.sessionId, 'storeId');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'encouragement return null');

            //get all the encouragements to ensure that the encouragement is not removed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1, 'the db not contains any encouragement');
        });

        it('delete encouragement by manager', async function() {
            let result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.deleteEncouragement(manager.sessionId, result.encouragement._id);
            assert.equal(result.err, null);
            assert.equal(result.code, 200, 'code 200');

            //get all the encouragements to ensure that the encouragement is removed
            result = await dal.getAllEncouragements();
            assert.equal(result.length,0, 'the db not contains any encouragement');
        });

        it('delete encouragement not existing encouragement', async function() {
            let result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await dal.getAllEncouragements();
            assert.equal(result.length,1, 'the db not contains encouragement');
            result = await encouragementServices.deleteEncouragement(manager.sessionId, editEncouragement._id);

            //get all the encouragements to ensure that the encouragement is not removed
            result = await dal.getAllEncouragements();
            assert.equal(result.length,1, 'the db not contains any encouragement');
        });
    });

    describe('test getAllEncouragements', function () {
        it('getAllEncouragements not by permission user', async function () {
            let result = await encouragementServices.getAllEncouragements('notuser');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.encouragements, null, 'encouragements return null');
        });

        it('getAllEncouragements by manager', async function () {
            let result = await  encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.getAllEncouragements(manager.sessionId);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.encouragements.length, 1);
            result = await  encouragementServices.addEncouragement(manager.sessionId, editEncouragement);
            result = await encouragementServices.getAllEncouragements(manager.sessionId);
            assert.equal(result.encouragements.length, 2);
        });

        it('getAllEncouragements store by by selesman', async function () {
            let result = await  encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.getAllEncouragements(notManager.sessionId);//salesman
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.encouragements.length, 1);
            result = await  encouragementServices.addEncouragement(manager.sessionId, editEncouragement);
            result = await encouragementServices.getAllEncouragements(notManager.sessionId);//salesman
            assert.equal(result.encouragements.length, 2);
        });
    });

    describe('test get encouragement', function () {
        it('get product not by permission user', async function () {
            let result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result =  await encouragementServices.getEncouragement('notuser', newEncouragement._id);
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.encouragement, null, 'encouragement return null');
        });

        it('get encouragement by manager', async function () {
            let result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result =  await encouragementServices.getEncouragement(manager.sessionId, result.encouragement._id);
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.encouragement.name, newEncouragement.name);
        });

        it('get encouragement by salesman', async function () {
            let result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result =  await encouragementServices.getEncouragement(notManager.sessionId, result.encouragement._id);
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.encouragement.name, newEncouragement.name);
        });

        it('get encouragement not exist', async function () {
            let result = await encouragementServices.getEncouragement(notManager.sessionId, "notexisting1");
            assert.equal(result.code, 409, 'code 409');
            assert.equal(result.err,'no such encouragement');
        });
    });
});