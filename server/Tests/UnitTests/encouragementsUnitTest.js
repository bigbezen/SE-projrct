var assert                     = require('chai').assert;
var assert                     = require('chai').assert;
var dal                        = require('../../src/DAL/dal');
var encouragementServices      = require('../../src/Services/encouragements/index');
var productServices            = require('../../src/Services/product/index');
var userModel                  = require('../../src/Models/user');
var mongoose                   = require('mongoose');

describe('encouragements unit test', function () {

    var manager;
    var notManager;
    var newEncouragement;
    var editEncouragement;
    var product1 = { 'name': 'absulut', 'retailPrice': '122', 'salePrice': '133', 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': '111', 'notifyManager': 'false'};
    var product2 = { 'name': 'jhony walker', 'retailPrice': '2222', 'salePrice': '555', 'category': 'wiskey', 'subCategory': 'wiskey', 'minRequiredAmount': '12', 'notifyManager': 'true'};
    beforeEach(async function () {
        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        var res = await dal.addUser(manager);

        notManager = new userModel();
        notManager.username = 'matan';
        notManager.sessionId = '12123434';
        notManager.jobDetails.userType = 'salesman';
        var res = await dal.addUser(notManager);

        var res = await productServices.addProduct(manager.sessionId,product1);
        product1 = res.product;

        var res = await productServices.addProduct(manager.sessionId,product2);
        product2 = res.product;

        newEncouragement = {'active': true, 'numOfProducts': '2', 'rate': '100', 'products': []};
        editEncouragement = {'active': false, 'numOfProducts': '5', 'rate': '120', 'products': []};
        newEncouragement.products.push(product1._id);
        newEncouragement.products.push(product2._id);
        editEncouragement.products.push(product1._id);
    });

    afterEach(async function () {
        var res= await dal.cleanDb();
    });

    describe('test add encouragement', function (){
        it('add encouragement not by manager',async function () {
            var result = await encouragementServices.addEncouragement(notManager.sessionId, newEncouragement);
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.isNull(result.encouragement);

            //get all the encouragement to ensure that the encouragement not added
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 0, 'the db not contains any encouragement');
        });

        it('add encouragement by manager', async function () {
            var result = await dal.getAllEncouragements();
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
            var result = await dal.getAllEncouragements();
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
            var product = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);

            var result = await encouragementServices.editEncouragement(notManager.sessionId, editEncouragement);
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
            var encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            var result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.strictEqual(result[0].active, editEncouragement.active, 'same active like the newEncouragement');
            assert.equal(result[0].numOfProducts, editEncouragement.numOfProducts, 'same numOfProducts like the newEncouragement');
            assert.equal(result[0].rate, editEncouragement.rate, 'same rate like the newEncouragement');
        });

        it('edit encouragement active', async function () {
            //add new encouragement
            var encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            var result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.strictEqual(result[0].active, editEncouragement.active, 'same active like the newEncouragement');
        });

        it('edit encouragement numOfProducts', async function () {
            //add new encouragement
            var encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            var result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.equal(result[0].numOfProducts, editEncouragement.numOfProducts, 'same active like the newEncouragement');
        });

        it('edit encouragement rate', async function () {
            //add new encouragement
            var encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            var result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.equal(result[0].rate, editEncouragement.rate, 'same active like the newEncouragement');
        });

        it('edit encouragement by existing product', async function () {
            //add new encouragement
            var encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            var result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
            assert.equal(result.code, 200, 'code 200');
            assert.isNull(result.err, 'permission denied');

            //get all the encouragement to ensure that the store not changed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1);
            assert.ok(result[0].products[0].equals(editEncouragement.products[0]));
        });

        it('edit encouragement by not existing product', async function () {
            //add new encouragement
            var encouragement = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            editEncouragement._id = encouragement.encouragement._id
            editEncouragement.products.push( mongoose.Types.ObjectId("notexisting1"));
            var result = await encouragementServices.editEncouragement(manager.sessionId, editEncouragement);
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
            var result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.deleteEncouragement(notManager.sessionId, 'storeId');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'encouragement return null');

            //get all the encouragements to ensure that the encouragement is not removed
            result = await dal.getAllEncouragements();
            assert.equal(result.length, 1, 'the db not contains any encouragement');
        });

        it('delete encouragement by manager', async function() {
            var result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.deleteEncouragement(manager.sessionId, result.encouragement._id);
            assert.equal(result.err, null);
            assert.equal(result.code, 200, 'code 200');

            //get all the encouragements to ensure that the encouragement is removed
            result = await dal.getAllEncouragements();
            assert.equal(result.length,0, 'the db not contains any encouragement');
        });

        it('delete encouragement not existing encouragement', async function() {
            var result = await encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
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
            var result = await encouragementServices.getAllEncouragements('notuser');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.encouragements, null, 'encouragements return null');
        });

        it('getAllEncouragements by manager', async function () {
            var result = await  encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.getAllEncouragements(manager.sessionId);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.encouragements.length, 1);
            var result = await  encouragementServices.addEncouragement(manager.sessionId, editEncouragement);
            result = await encouragementServices.getAllEncouragements(manager.sessionId);
            assert.equal(result.encouragements.length, 2);
        });

        it('getAllEncouragements store by by selesman', async function () {
            var result = await  encouragementServices.addEncouragement(manager.sessionId, newEncouragement);
            result = await encouragementServices.getAllEncouragements(notManager.sessionId);//salesman
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.encouragements.length, 1);
            var result = await  encouragementServices.addEncouragement(manager.sessionId, editEncouragement);
            result = await encouragementServices.getAllEncouragements(notManager.sessionId);//salesman
            assert.equal(result.encouragements.length, 2);
        });
    });

});