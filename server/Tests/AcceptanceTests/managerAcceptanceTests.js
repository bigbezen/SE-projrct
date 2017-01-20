let assert              = require('chai').assert;
let expect              = require('chai').expect;
let mongoose            = require('mongoose');

process.env['DB'] = 'AcceptenceTestDb';

let main                = require('../../main');
let axios               = require('axios');

let dal                 = require('../../src/DAL/dal');
let userModel           = require('../../src/Models/user');
let productModel        = require('../../src/Models/product');
let storeModel        = require('../../src/Models/store');
let serverUrl = 'http://localhost:3000/';


describe('manager acceptance test', function(){

    let manager;
    let salesman;
    let notManager;
    let newStore;
    let store1;
    let product1;
    let product2 = {'name': 'absulut', 'retailPrice': 122, 'salePrice': 133, 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': 111, 'notifyManager': false};
    let newProduct;
    let newEncouragement;

    beforeEach(async function() {
        let res = await dal.cleanDb();

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.password = '12s1234';
        manager.jobDetails.userType = 'manager';
        res = await dal.addUser(manager);

        notManager = new userModel();
        notManager.username = 'aviram';
        notManager.sessionId = '12123434';
        notManager.password = '111111';
        notManager.jobDetails.userType = 'notmanager';
        res = await dal.addUser(notManager);

        salesman = {};
        salesman.sessionId = '121234';
        salesman.password = '121234';
        salesman.username = 'matan';
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

        product1 = new productModel();
        product1.name = product2.name;
        product1.retailPrice = product2.retailPrice;
        product1.salePrice = product2.salePrice;
        product1.category = product2.category;
        product1.subCategory = product2.subCategory;
        product1.minRequiredAmount = product2.minRequiredAmount;
        product1.notifyManager = product2.notifyManager;

        product1 = await dal.addProduct(product1);

        newEncouragement = {'active': true, 'numOfProducts': 2, 'rate': 100, 'products': []};
        newEncouragement.products.push(product1._id);

        newStore = {
            'name': 'bana',
            'managerName': 'shahaf',
            'phone': '0542458658',
            'city': 'beersheva',
            'address': 'rager12',
            'area': 'south',
            'channel': 'hot'
        };
        newProduct = {
            'name': 'jhony walker',
            'retailPrice': 2222,
            'salePrice': 555,
            'category': 'wiskey',
            'subCategory': 'wiskey',
            'minRequiredAmount': 12,
            'notifyManager': true
        };

        store1 = new storeModel();
        store1.name = 'blabla';
        store1.managerName = 'lihi';
        store1.phone = '092093232';
        store1.city = 'rishonLezion';
        store1.address = 'ha-kabarnir';
        store1.area = 'center';
        store1.channel = 'cold';
    });

    afterEach(async function(){
        let res = await dal.cleanDb();
    });

    describe('test add user', function() {
        it('add user valid', async function () {
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            });
            assert.equal(res.status, 200);
            assert.equal(res.data.username, salesman.username);
        });

        it('add not existing user', async function () {
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            });

            assert.equal(res.status, 200);
            assert.equal(res.data.username, salesman.username);

            res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
            assert.equal(res.response.data, 'Username or Id already exists');
        });

        it('add user not by manager', async function () {
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: salesman.sessionId,
                userDetails: salesman
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'user not authorized');
        });

        it('add user not by invalid parameter', async function () {
            salesman.username = 12345;
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: salesman.sessionId,
                userDetails: salesman
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('add user not by invalid email', async function () {
            salesman.contact.email = 1223444;
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: salesman.sessionId,
                userDetails: salesman
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('add user not by invalid parameter', async function () {
            salesman.username = 12345;
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: salesman.sessionId,
                userDetails: salesman
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });
    });

    describe('test delete user', function() {
        it('delete valid user', async function () {
            let res = await axios.post(serverUrl + 'management/deleteUser', {
                username: manager.username,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('delete not existing user', async function () {
            let res = await axios.post(serverUrl + 'management/deleteUser', {
                username: salesman.username,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

        assert.equal(res.response.status, 409);
        assert.equal(res.response.data, 'problem occurred with one of the parameters')
        });

        it('delete user not by manager', async function () {
            let res = await axios.post(serverUrl + 'management/deleteUser', {
                username: notManager.username,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'user not authorized')
        });

        it('delete user invalid parameters', async function () {
            let res = await axios.post(serverUrl + 'management/deleteUser', {
                username: 111111,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });
    });

    describe('test add store', function() {
        it('add valid store', async function () {
            let res = await axios.post(serverUrl + 'management/addStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('add store not by manager', async function () {
            let res = await axios.post(serverUrl + 'management/addStore', {
                storeDetails: newStore,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied');
        });

        it('add store invalid parameters', async function () {
            let res = await axios.post(serverUrl + 'management/addStore', {
                storeDetails: 'not store',
                sessionId: manager.sessionId,
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('add existing name and area', async function () {
            let res = await axios.post(serverUrl + 'management/addStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId,
            });
            assert.equal(res.status, 200);

            res = await axios.post(serverUrl + 'management/addStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId,
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
            assert.equal(res.response.data, 'store already exist');
        });

        it('add existing name and different area', async function () {
            let res = await axios.post(serverUrl + 'management/addStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId,
            });
            assert.equal(res.status, 200);

            newStore.area = 'different'
            res = await axios.post(serverUrl + 'management/addStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId,
            });

            assert.equal(res.status, 200);
        });
    });

    describe('test add product', function() {
        it('add valid product', async function () {
            let res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('add product not by manager', async function () {
            let res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: newProduct,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied');
        });

        it('add product invalid subCetagory', async function () {
            newProduct.subCategory = 234;
            let res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId,
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('add product invalid category', async function () {
            newProduct.category = 234;
            let res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: newEncouragement,
                sessionId: manager.sessionId,
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('add product invalid price', async function () {
            newProduct.retailPrice = 'not number';
            let res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: newEncouragement,
                sessionId: manager.sessionId,
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('add existing name', async function () {
            let res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId,
            });
            assert.equal(res.status, 200);

            res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId,
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
            assert.equal(res.response.data, 'product already exist');
        });
    });

    describe('test add Encouragement ', function() {
        it('add valid Encouragement ', async function () {
            let res = await axios.post(serverUrl + 'management/addEncouragement', {
                encouragementDetails : newEncouragement,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('add Encouragement not by manager', async function () {
            let res = await axios.post(serverUrl + 'management/addEncouragement', {
                encouragementDetails : newEncouragement,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied');
        });

        it('add Encouragement invalid product id', async function () {
            newEncouragement.products.push(mongoose.Types.ObjectId("notexisting1"));
            let res = await axios.post(serverUrl + 'management/addEncouragement', {
                encouragementDetails : newEncouragement,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'product not found');
        });

        it('add existing Encouragement', async function () {
            let res = await axios.post(serverUrl + 'management/addEncouragement', {
                encouragementDetails : newEncouragement,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);

            res = await axios.post(serverUrl + 'management/addEncouragement', {
                encouragementDetails : newEncouragement,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.status, 200);
        });
    });

    describe('test delete store', function() {
        it('delete valid user', async function () {
            store1 = await dal.addStore(store1);
            let res = await axios.post(serverUrl + 'management/deleteStore', {
                storeId: store1._id,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('delete store invalid parameters', async function () {
            store1 = await dal.addStore(store1);
            let res = await axios.post(serverUrl + 'management/deleteStore', {
                storeId: store1._id,
                sessionId: 11111
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });

        it('delete store not by manager', async function () {
            store1 = await dal.addStore(store1);
            let res = await axios.post(serverUrl + 'management/deleteStore', {
                storeId: store1._id,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied')
        });
    });
});

