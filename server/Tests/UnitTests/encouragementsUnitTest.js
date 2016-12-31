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

        newEncouragement = {'active': 'true', 'numOfProducts': '2', 'rate': '100', 'products': []};
        newEncouragement.products.push(product1._id);
        newEncouragement.products.push(product2._id);
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
        it('edit product not by manager', async function () {
            //add new product
            var product = await productServices.addProduct(manager.sessionId, newProduct);
            //product the store not be manager

            var result = await productServices.editProduct(notManager.sessionId, editProduct);
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.product, null, 'product return null');

            //get all the store to ensure that the store not changed
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db not contains any product');
            assert.equal(result[0].name, newProduct.name, 'same name like the new product');
        });

        it('edit product by manager', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the product to ensure that the store  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].name, editProduct.name);
        });

        it('edit product name', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].retailPrice, editProduct.retailPrice);
        });

        it('edit product retailPrice', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].retailPrice, editProduct.retailPrice);
        });

        it('edit product salePrice', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].retailPrice, editProduct.retailPrice);
        });

        it('edit store city', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].salePrice, editProduct.salePrice);
        });

        it('edit product category', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].category, editProduct.category);
        });

        it('edit store subCategory', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].subCategory, editProduct.subCategory);
        });

        it('edit store minRequiredAmount', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].minRequiredAmount, editProduct.minRequiredAmount);
        });

        it('edit store notifyManager', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await dal.getAllProducts();
            editProduct._id = result[0]._id;
            result = await productServices.editProduct(manager.sessionId, editProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the products to ensure that the product  edited
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the edit product');
            assert(result[0].notifyManager, editProduct.notifyManager);
        });
    });

    describe('test delete product', function () {
        it('delete product not by manager', async function() {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await productServices.deleteProduct(notManager.sessionId, 'storeId');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'store return null');

            //get all the products to ensure that the product is not removed
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db not contains any store');
        });

        it('delete product by manager', async function() {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await productServices.deleteProduct(manager.sessionId, result.product._id);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            //get all the products to ensure that the product is removed
            result = await dal.getAllProducts();
            assert.equal(result.length, 0, 'the db not contains any products');
        });

        it('delete product not existing product', async function() {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await productServices.deleteProduct(manager.sessionId, editProduct._id);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            //get all the products to ensure that the product not removed
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db not contains any store');
        });
    });

    describe('test getAllProducts store', function () {
        it('getAllproducts not by permission user', async function () {
            var result = await productServices.getAllProducts('notuser');
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'product return null');
        });

        it('getAllProducts by manager', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await productServices.getAllProducts(manager.sessionId);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            //get all the products to ensure that the product added
            assert.equal(result.products.length, 1, 'the db not contains any product');
            result = await productServices.addProduct(manager.sessionId, editProduct)
            result = await productServices.getAllProducts(manager.sessionId);
            assert.equal(result.products.length, 2);
        });

        it('getAllproducts store by by selesman', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            result = await productServices.getAllProducts(notManager.sessionId);//salesman
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200');

            //get all the products to ensure that the product added
            assert.equal(result.products.length, 1, 'the db not contains any product');
            result = await productServices.addProduct(manager.sessionId, editProduct)
            result = await productServices.getAllProducts(manager.sessionId);
            assert.equal(result.products.length, 2);
        });
    });

});