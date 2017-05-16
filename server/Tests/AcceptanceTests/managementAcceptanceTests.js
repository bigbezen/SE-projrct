let assert              = require('chai').assert;
let expect              = require('chai').expect;
let mongoose            = require('mongoose');

process.env['DB'] = 'AcceptenceTestDb';

let main                = require('../../main');
let axios               = require('axios');

let dal                 = require('../../src/DAL/dal');
let userModel           = require('../../src/Models/user');
let productModel        = require('../../src/Models/product');
let storeModel          = require('../../src/Models/store');
let constantString      = require('../../src/Utils/Constans/ConstantStrings.js');
let encouragementModel        = require('../../src/Models/encouragement');
let serverUrl = 'http://localhost:3000/';

let _createNewSalesReport = async function(){
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

describe('management acceptance test', function(){

    let manager;
    let salesman;
    let notManager;
    let encouragement;
    let newStore;
    let store1;
    let product1;
    let product2;
    let newProduct;
    let newEncouragement;
    let shift1;
    let shifts = [];

    beforeEach(async function() {
        let res = await dal.cleanDb();

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.password = '12s1234';
        manager.jobDetails.userType = 'manager';
        manager = await dal.addUser(manager);

        notManager = new userModel();
        notManager.username = 'aviram';
        notManager.personal = {
            "id": "0984454321",
            "firstName": "israeld",
            "lastName": "israelid",
            "sex": "male",
            "birthday": "01-01-1999"
        };
        notManager.sessionId = '12123434';
        notManager.password = '111111';
        notManager.jobDetails.userType = 'salesman';
        notManager = await dal.addUser(notManager);

        salesman ={};
        salesman.sessionId = '121234';
        salesman.password = '12345';
        salesman.username = 'matan';
        salesman.personal = {
            id: '123456',
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
            email: 'ls@post.bgu.ac.il'
        };
        salesman.jobDetails = {
            userType: 'salesman'
        };

        product2 = {'name': 'absulut', 'retailPrice': 122, 'salePrice': 133, 'category': 'vodka', 'subCategory': 'vodka', 'minRequiredAmount': 111, 'notifyManager': false};

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

        encouragement = new encouragementModel();
        encouragement.active = false;
        encouragement.numOfProducts = newEncouragement.numOfProducts;
        encouragement.rate = newEncouragement.rate;

        //create id object from the string id
        let products = await dal.getProductsById(newEncouragement);
        encouragement.products = products;


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

        let end = new Date();
        end.setDate(end.getDate() + 1);

        let start = new Date();
        start.setDate(start.getDate() + 1);

        shift1  = {'storeId': '','startTime':start.toString(), 'endTime': end.toString(), 'type': 'salesman', 'status': 'CREATED', 'salesmanId': ''};
        shifts.push(shift1);
    });

    afterEach(async function(){
        let res = await dal.cleanDb();
        shifts.pop();
    });

    describe('test add user', function() {
        it('add user salesman valid', async function () {
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            });
            assert.equal(res.status, 200);
            assert.equal(res.data.username, salesman.username);
        });

        it('add user manager valid', async function () {
            salesman.jobDetails.userType = "manager";
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails:salesman
            });
            assert.equal(res.status, 200);
            assert.equal(res.data.username, salesman.username);
        });

        it('add user event valid', async function () {
            salesman.jobDetails.userType = "event";
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
            assert.equal(res.response.data, constantString.UsernameOrIdAlreadyExists);
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
            assert.equal(res.response.data, constantString.permssionDenied);
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

        it('add user not by invalid sessionId', async function () {
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
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            });
            assert.equal(res.status, 200);

            res = await axios.post(serverUrl + 'management/deleteUser', {
                username: salesman.username,
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
        assert.equal(res.response.data, constantString.userDoesNotExist)
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
            assert.equal(res.response.data, constantString.permssionDenied)
        });

        it('delete manager by manager', async function () {
            let res = await axios.post(serverUrl + 'management/deleteUser', {
                username: manager.username,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, constantString.permssionDenied)
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

    describe('test add shift', function() {
        it('add shift not by manager', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let res = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'user not authorized');
        });

        it('add shift valid', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let res = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(res.status, 200);
        });

        it('add shift invalid parameters', async function () {
            shifts[0].storeId = 54645654;
            shifts[0].salesmanId = 456456;
            shifts[0].endTime = 456456;
            let res = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('add event shift valid', async function () {
            shifts[0].type = 'אירוע';
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let res = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(res.status, 200);
            assert.equal(res.data[0].status, 'FINISHED');
        });

        it('add shift by illegal date', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            shifts[0].endTime = (new Date()).toString();
            let res = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
            assert.equal(res.response.data, 'shifts dates are before current time');
        });

        it('add shift store by not exist', async function () {
            shifts[0].storeId = "notexisting1";
            shifts[0].salesmanId = notManager._id.toString();
            let res = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
            assert.equal(res.response.data,  'One or more of the stores does not exist');
        });
    });

    describe('test publish shift', function() {
        it('publish shift not by manager', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(result.status, 200);
            shifts[0]._id = result.data[0]._id;

            let res = await axios.post(serverUrl + 'management/publishShifts', {
                shiftArr: shifts,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'user not authorized');
        });

        it('publish shift valid', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(result.status, 200);
            shifts[0]._id = result.data[0]._id;

            let res = await axios.post(serverUrl +   'management/publishShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(res.status, 200);
        });

        it('publish shift invalid parameters', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let res = await axios.post(serverUrl +   'management/publishShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('publish shift without status CREATED', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(result.status, 200);
            shifts[0]._id = result.data[0]._id;
            shifts[0].status = "STARTED";
            result = await dal.editShift(shifts[0]);
            let res = await axios.post(serverUrl + 'management/publishShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
            assert.equal(res.response.data, 'trying to publish a shift that is already published');
        });
    });

    describe('test add encouragement ', function() {
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

    describe('test delete product', function() {
        it('delete valid user', async function () {
            product1 = await dal.addProduct(product1);
            let res = await axios.post(serverUrl + 'management/deleteProduct', {
                productId: product1._id,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('delete product invalid parameters', async function () {
            product1 = await dal.addProduct(product1);
            let res = await axios.post(serverUrl + 'management/deleteProduct', {
                productId: product1._id,
                sessionId: 11111
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });

        it('delete product not by manager', async function () {
            product1 = await dal.addProduct(store1);
            let res = await axios.post(serverUrl + 'management/deleteProduct', {
                productId: product1._id,
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

    describe('test delete shift', function() {
        it('delete valid user', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(result.status, 200);

            let res = await axios.post(serverUrl + 'management/deleteShift', {
                shiftId: result.data[0]._id,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('delete shift invalid parameters', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });
            assert.equal(result.status, 200);

            let res = await axios.post(serverUrl + 'management/deleteShift', {
                shiftId: result.data[0]._id,
                sessionId: 11111
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });

        it('delete shift not by manager', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });
            assert.equal(result.status, 200);

            let res = await axios.post(serverUrl + 'management/deleteShift', {
                shiftId: result.data[0]._id,
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

    describe('test edit shift', function() {
        it('edit shift valid', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });

            assert.equal(result.status, 200);
            shifts[0]._id = result.data[0]._id;
            shifts[0].status = "FINISHED";

            let res = await axios.post(serverUrl + 'management/editShifts', {
                shiftDetails: result.data[0],
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('edit shift invalid parameters', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });
            assert.equal(result.status, 200);
            shifts[0]._id = result.data[0]._id;

            let res = await axios.post(serverUrl + 'management/editShifts', {
                shiftDetails: "invalid parameter",
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });

        it('edit shift not by manager', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });
            assert.equal(result.status, 200);

            shifts[0]._id = result.data[0]._id;

            let res = await axios.post(serverUrl + 'management/editShifts', {
                shiftDetails: result.data[0],
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'user not authorized')
        });

        it('edit shift not shift already started', async function () {
            let store = await dal.addStore(store1);
            shifts[0].storeId = store._id.toString();
            shifts[0].salesmanId = notManager._id.toString();
            let result = await axios.post(serverUrl + 'management/addShifts', {
                shiftArr: shifts,
                sessionId: manager.sessionId
            });
            assert.equal(result.status, 200);
            shifts[0]._id = result.data[0]._id;
            shifts[0].status = "STARTED";
            result = await dal.editShift(shifts[0]);

            let res = await axios.post(serverUrl + 'management/editShifts', {
                shiftDetails: shifts[0],
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });
            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied shift already started');
        });
    });

    describe('test delete encouragement', function() {
        it('delete encouragement valid user', async function () {
            let encouragementRes= await dal.addEncouragement(encouragement);
            let res = await axios.post(serverUrl + 'management/deleteEncouragement', {
                encouragementId: encouragementRes._id,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('delete encouragement invalid parameters', async function () {
            let encouragementRes = await dal.addEncouragement(encouragement);
            let res = await axios.post(serverUrl + 'management/deleteEncouragement', {
                encouragementId: encouragement._id,
                sessionId: 11111
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });

        it('delete encouragement not by manager', async function () {
            let encouragementRes = await dal.addEncouragement(encouragement);
            let res = await axios.post(serverUrl + 'management/deleteEncouragement', {
                encouragementId: encouragement._id,
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

    describe('test edit product', function() {
        it('edit product valid user', async function () {
            newProduct._id = product1._id;
            let res = await axios.post(serverUrl + 'management/editProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('edit unexist product', async function () {
            newProduct._id = "notexisting1";
            let res = await axios.post(serverUrl + 'management/editProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 400);
            assert.equal(res.response.data, 'cannot edit this product');
        });

        it('edit product not by manager ', async function () {
            newProduct._id = product1._id;
            let res = await axios.post(serverUrl + 'management/editProduct', {
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

        it('edit product invalid name', async function () {
            newProduct._id = product1._id;
            newProduct.name = 12;
            let res = await axios.post(serverUrl + 'management/editProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('edit product invalid price', async function () {
            newProduct._id = product1._id;
            newProduct.retailPrice = "notprice";
            let res = await axios.post(serverUrl + 'management/editProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('edit product invalid category', async function () {
            newProduct._id = product1._id;
            newProduct.category = 12345;
            let res = await axios.post(serverUrl + 'management/editProduct', {
                productDetails: newProduct,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });
    });

    describe('test edit user', function() {
        it('edit user valid', async function () {
            let res = await axios.post(serverUrl + 'management/editUser', {
                userDetails: salesman,
                username:notManager.username,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('edit unexist user', async function () {
            let res = await axios.post(serverUrl + 'management/editUser', {
                userDetails: salesman,
                username:salesman.username,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
            assert.equal(res.response.data, constantString.userDoesNotExist);
        });

        it('edit user not by manager ', async function () {
            let res = await axios.post(serverUrl + 'management/editUser', {
                userDetails: salesman,
                username:notManager.username,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, constantString.permssionDenied);
        });

        it('edit user invalid', async function () {
            salesman.username = 12;
            let res = await axios.post(serverUrl + 'management/editUser', {
                userDetails: salesman,
                username:notManager.username,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('edit user existing editUser', async function () {
            salesman.username = manager.username;
            let res = await axios.post(serverUrl + 'management/editUser', {
                userDetails: salesman,
                username:notManager.username,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 409);
        });
    });

    describe('test edit store', function() {
        it('edit store valid user', async function () {
            store1 = await dal.addStore(store1);
            newStore._id = store1._id;
            let res = await axios.post(serverUrl + 'management/editStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('edit unexist store', async function () {
            store1 = await dal.addStore(store1);
            newStore._id = "notexisting1";
            let res = await axios.post(serverUrl + 'management/editStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 400);
            assert.equal(res.response.data, 'cannot edit this store');
        });

        it('edit store not by manager ', async function () {
            store1 = await dal.addStore(store1);
            newStore._id = store1._id;
            let res = await axios.post(serverUrl + 'management/editStore', {
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

        it('edit store invalid name', async function () {
            store1 = await dal.addStore(store1);
            newStore._id = store1._id;
            newStore.name = 12;
            let res = await axios.post(serverUrl + 'management/editStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('edit store invalid area', async function () {
            store1 = await dal.addStore(store1);
            newStore._id = store1._id;
            newStore.area = 2423;
            let res = await axios.post(serverUrl + 'management/editStore', {
                storeDetails: newStore,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });
    });

    describe('test edit encouragement', function() {
        it('edit encouragement valid user', async function () {
            encouragement = await dal.addEncouragement(encouragement);
            newEncouragement._id = encouragement._id;
            let res = await axios.post(serverUrl + 'management/editEncouragement', {
                encouragementDetails: newEncouragement,
                sessionId: manager.sessionId
            });
            assert.equal(res.status, 200);
        });

        it('edit unexist encouragement', async function () {
            encouragement = await dal.addEncouragement(encouragement);
            newEncouragement._id = "notexisting1";
            let res = await axios.post(serverUrl + 'management/editEncouragement', {
                encouragementDetails: newEncouragement,
                sessionId: manager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 400);
        });

        it('edit encouragement not by manager ', async function () {
            encouragement = await dal.addEncouragement(encouragement);
            newEncouragement._id = encouragement._id;
            let res = await axios.post(serverUrl + 'management/editEncouragement', {
                encouragementDetails: newEncouragement,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied');
        });

        it('edit encouragement invalid numOfProducts', async function () {
            encouragement = await dal.addEncouragement(encouragement);
            newEncouragement._id = encouragement._id;
            newEncouragement.numOfProducts = "notNumber";
            let res = await axios.post(serverUrl + 'management/editEncouragement', {
                encouragementDetails: newEncouragement,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });

        it('edit encouragement invalid area', async function () {
            encouragement = await dal.addEncouragement(encouragement);
            newEncouragement._id = encouragement._id;
            newEncouragement.rate = "notNumber";
            let res = await axios.post(serverUrl + 'management/editEncouragement', {
                encouragementDetails: newEncouragement,
                sessionId: notManager.sessionId
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters');
        });
    });

    describe('test get all products', function() {
        it('get all products valid by salesman', async function () {
            let res = await axios.get(serverUrl + 'management/getAllProducts', {
                headers:{
                    sessionId:notManager.sessionId
                }
            });
            assert.equal(res.status, 200);
        });

        it('get all products valid by manager', async function () {
            let res = await axios.get(serverUrl + 'management/getAllProducts', {
                headers:{
                    sessionId:manager.sessionId
                }
            });
            assert.equal(res.status, 200);
        });

        it('get all products without permission', async function () {
            let res = await axios.get(serverUrl + 'management/getAllProducts', {
                headers:{
                    sessionId:"not exist"
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied');
        });

        it('get all products invalid parameters', async function () {
            let res = await axios.get(serverUrl + 'management/getAllProducts', {
                headers:{}
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });
    });

    describe('test get all stores', function() {
        it('get all stores valid by salesman', async function () {
            let res = await axios.get(serverUrl + 'management/getAllStores', {
                headers:{
                    sessionId:notManager.sessionId
                }
            });
            assert.equal(res.status, 200);
        });

        it('get all stores valid by manager', async function () {
            let res = await axios.get(serverUrl + 'management/getAllStores', {
                headers:{
                    sessionId:manager.sessionId
                }
            });
            assert.equal(res.status, 200);
        });

        it('get all stores without permission', async function () {
            let res = await axios.get(serverUrl + 'management/getAllStores', {
                headers:{
                    sessionId:"not exist"
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied');
        });

        it('get all stores invalid parameters', async function () {
            let res = await axios.get(serverUrl + 'management/getAllStores', {
                headers:{}
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });
    });

    describe('test get all users', function() {
        it('get all users valid by manager', async function () {
            let res = await axios.get(serverUrl + 'management/getAllUsers', {
                headers:{
                    sessionId:manager.sessionId
                }
            });
            assert.equal(res.status, 200);
        });

        it('get all users without permission', async function () {
            let res = await axios.get(serverUrl + 'management/getAllUsers', {
                headers:{
                    sessionId:"not exist"
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, constantString.permssionDenied);
        });

        it('get all users invalid parameters', async function () {
            let res = await axios.get(serverUrl + 'management/getAllUsers', {
                headers:{}
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });
    });

    describe('test get all encouragement', function() {
        it('get all encouragement valid by salesman', async function () {
            let res = await axios.get(serverUrl + 'management/getAllEncouragements', {
                headers:{
                    sessionId:notManager.sessionId
                }
            });
            assert.equal(res.status, 200);
        });

        it('get all encouragement valid by manager', async function () {
            let res = await axios.get(serverUrl + 'management/getAllEncouragements', {
                headers:{
                    sessionId:manager.sessionId
                }
            });
            assert.equal(res.status, 200);
        });

        it('get all encouragement without permission', async function () {
            let res = await axios.get(serverUrl + 'management/getAllEncouragements', {
                headers:{
                    sessionId:"not exist"
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 401);
            assert.equal(res.response.data, 'permission denied');
        });

        it('get all encouragement invalid parameters', async function () {
            let res = await axios.get(serverUrl + 'management/getAllEncouragements', {
                headers:{}
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(res.response.status, 404);
            assert.equal(res.response.data, 'invalid parameters')
        });
    });
});

