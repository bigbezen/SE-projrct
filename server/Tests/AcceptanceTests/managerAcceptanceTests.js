var assert              = require('chai').assert;
var expect              = require('chai').expect;

process.env['DB'] = 'AcceptenceTestDb';

var main                = require('../../main');
var axios               = require('axios');

let dal                 = require('../../src/DAL/dal');
let userModel           = require('../../src/Models/user');

var serverUrl = 'http://localhost:3000/';


describe('manager acceptance test', function(){

    let manager;
    let salesman;
    let notManager;
    let newStore;
    let newProduct;

    beforeEach(async function(){
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

        newStore = {'name': 'bana', 'managerName': 'shahaf', 'phone': '0542458658', 'city': 'beersheva', 'address': 'rager12', 'area': 'south', 'channel': 'hot'};
        newProduct = { 'name': 'absulut', 'retailPrice': 122, 'salePrice': 133, 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': 111, 'notifyManager': false};
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

        it('add product invalid parameters', async function () {
            let res = await axios.post(serverUrl + 'management/addProduct', {
                productDetails: 'not product',
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
});

