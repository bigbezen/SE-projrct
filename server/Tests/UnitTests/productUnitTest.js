var assert            = require('chai').assert;
var dal               = require('../../src/DAL/dal');
var productServices      = require('../../src/Services/product/index');
var userModel         = require('../../src/Models/user');

describe('product unit test', function () {

    var manager;
    var notManager;
    var newProduct = { 'name': 'absulut', 'retailPrice': '122', 'salePrice': '133', 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': '111', 'notifyManager': 'false'};
    var editProduct = { 'name': 'jhony walker', 'retailPrice': '2222', 'salePrice': '555', 'category': 'wiskey', 'subCategory': 'wiskey', 'minRequiredAmount': '12', 'notifyManager': 'true'};
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
    });

    afterEach(async function () {
        var res= await dal.cleanDb();
    });

    describe('test add product', function (){
        it('add product not by manager',async function () {
            var result = await productServices.addProduct(notManager.sessionId, newProduct);
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.isNull(result.product);

            //get all the products to ensure that the store not added
            result = await dal.getAllProducts();
            assert.equal(result.length, 0, 'the db not contains any product');
        });

        it('add product by manager', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');
            assert.equal(result.product.name, newProduct.name, 'store return same');

            //get all the products to ensure that the store  added
            result = await dal.getAllProducts();
            assert.equal(result.length, 1, 'the db contains the new product');
            assert(result[0].name, newProduct.name);
        });

        it('add product with the same name', async function () {
            var result = await productServices.addProduct(manager.sessionId, newProduct);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');
            assert.equal(result.product.name, newProduct.name, 'product return same');
            //add the same product
            result = await productServices.addProduct(manager.sessionId, newProduct);
            assert.equal(result.err, 'product already exist', 'product already exist');
            assert.equal(result.code, 409, 'code 409 err');
            //get all the product to ensure that the store not added
            result = await dal.getAllProducts();
            assert.equal(result.length, 1);
            assert(result[0].name, newProduct.name);
        });
    });

    describe('test edit product', function () {
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


    describe('test get product', function () {
        it('get product not by permission user', async function () {
            let result = await productServices.addProduct(manager.sessionId, newProduct);
            result =  await productServices.getProduct('notuser', newProduct._id);
            assert.equal(result.err, 'permission denied');
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.product, null, 'product return null');
        });

        it('get product by manager', async function () {
            let result = await productServices.addProduct(manager.sessionId, newProduct);
            result =  await productServices.getProduct(manager.sessionId, result.product._id);
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.product.name, newProduct.name);
        });

        it('get product by salesman', async function () {
            let result = await productServices.addProduct(manager.sessionId, newProduct);
            result =  await productServices.getProduct(notManager.sessionId, result.product._id);
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.product.name, newProduct.name);
        });

        it('get product not exist', async function () {
            let result = await productServices.getProduct(notManager.sessionId, "notexisting1");
            assert.equal(result.err,'no such product');
            assert.equal(result.code, 409, 'code 409');
        });
    });
});