let assert            = require('chai').assert;
let dal               = require('../../src/DAL/dal');
let storeService      = require('../../src/Services/store/index');
let userModel         = require('../../src/Models/user');
let constantString    = require('../../src/Utils/Constans/ConstantStrings.js');



describe('store unit test', function () {
    let manager;
    let notManager;
    let newStoreDetails;
    let editStoreDetails;
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

        newStoreDetails = {'name': 'bana', 'managerName': 'shahaf', 'phone': '0542458658', 'city': 'beersheva', 'address': 'rager12', 'area': 'south', 'channel': 'hot'};
        editStoreDetails = {'name': 'bana-update', 'managerName': 'blabla', 'phone': '0542450958', 'city': 'rishon', 'address': 'rager142', 'area': 'center', 'channel': 'cold'};
    });

    afterEach(async function () {
        let res = await dal.cleanDb();
    });

    describe('test add store', function (){
        it('add store not by manager',async function () {
            let result = await storeService.addStore(notManager.sessionId, newStoreDetails);
            assert.equal(result.err, constantString.permssionDenied);
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null,'store return null');

            //get all the store to ensure that the store not added
            result = await dal.getAllStores();
            assert.equal(result.length, 0, 'the db not contains any store');
        });

        it('add store by manager', async function () {
            let result = await storeService.addStore(manager.sessionId, newStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');
            assert.equal(result.store.name, newStoreDetails.name, 'store return same');

            //get all the store to ensure that the store  added
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the new store');
            assert(result[0].name, newStoreDetails.name);
        });

        it('add store with existing name same area', async function () {
            let result = await storeService.addStore(manager.sessionId, newStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');
            assert.equal(result.store.name, newStoreDetails.name, 'store return same');
            //add the same store
            result = await storeService.addStore(manager.sessionId, newStoreDetails);
            assert.equal(result.err, constantString.storeAlreadyExist);
            assert.equal(result.code, 409, 'code 409 err');
            //get all the store to ensure that the store not added
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db not contains any store');
            assert(result[0].name, newStoreDetails.name);
        });
    });

    describe('test edit store', function () {
        it('edit store not by manager', async function () {
            //add new store
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            //edit the store not be manager

            result = await storeService.editStore(notManager.sessionId, editStoreDetails);
            assert.equal(result.err, constantString.permssionDenied);
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'store return null');

            //get all the store to ensure that the store not changed
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db not contains any store');
            assert.equal(result[0].name, newStoreDetails.name, 'same name like the new store');
        });

        it('edit store by manager', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await dal.getAllStores();
            editStoreDetails._id = result[0]._id;
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the store to ensure that the store  edited
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the edit store');
            assert(result[0].name, editStoreDetails.name);
        });

        it('edit store with existing name and area', async function () {
            let result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await storeService.addStore(manager.sessionId, editStoreDetails);
            editStoreDetails.name = newStoreDetails.name;
            editStoreDetails.area = newStoreDetails.area;
            editStoreDetails._id = result.store._id.toString();
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.equal(result.code, 409);
            assert.equal(result.err, constantString.duplicateStore);
        });

        it('edit unexist store', async function () {
            editStoreDetails._id = "notexisting1";
            let result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.equal(result.code, 400);
            assert.equal(result.err, constantString.somthingBadHappend);
        });

        it('edit store name', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await dal.getAllStores();
            editStoreDetails._id = result[0]._id;
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the store to ensure that the store  edited
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the edit store');
            assert(result[0].name, editStoreDetails.name);
        });

        it('edit store managerName', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await dal.getAllStores();
            editStoreDetails._id = result[0]._id;
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the store to ensure that the store  edited
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the edit store');
            assert(result[0].managerName, editStoreDetails.managerName);
        });

        it('edit store phone', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await dal.getAllStores();
            editStoreDetails._id = result[0]._id;
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the store to ensure that the store  edited
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the edit store');
            assert(result[0].phone, editStoreDetails.phone);
        });

        it('edit store city', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await dal.getAllStores();
            editStoreDetails._id = result[0]._id;
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the store to ensure that the store  edited
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the edit store');
            assert(result[0].city, editStoreDetails.city);
        });

        it('edit store area', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await dal.getAllStores();
            editStoreDetails._id = result[0]._id;
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the store to ensure that the store  edited
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the edit store');
            assert(result[0].area, editStoreDetails.area);
        });

        it('edit store channel', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await dal.getAllStores();
            editStoreDetails._id = result[0]._id;
            result = await storeService.editStore(manager.sessionId, editStoreDetails);
            assert.isNull(result.err);
            assert.equal(result.code, 200, 'code 200 ok');

            //get all the store to ensure that the store  edited
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db contains the edit store');
            assert(result[0].channel, editStoreDetails.channel);
        });
    });

    describe('test delete store', function () {
        it('delete store not by manager', async function() {
            var result = await storeService.deleteStroe(notManager.sessionId, newStoreDetails);
            assert.equal(result.err, constantString.permssionDenied);
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'store return null');

            //get all the store to ensure that the store not added
            result = await dal.getAllStores();
            assert.equal(result.length, 0, 'the db not contains any store');
        });

        it('delete store by manager', async function() {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await storeService.deleteStroe(manager.sessionId, result.store._id);
            assert.equal(result.err, null);
            assert.equal(result.code, 200, 'code 200');

            //get all the store to ensure that the store deleted
            result = await dal.getAllStores();
            assert.equal(result.length, 0, 'the db not contains any store');
        });

        it('delete store not existing store', async function() {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await storeService.deleteStroe(manager.sessionId, newStoreDetails._id);
            assert.equal(result.err, null);
            assert.equal(result.code, 200, 'code 200');

            //get all the store to ensure that the store deleted
            result = await dal.getAllStores();
            assert.equal(result.length, 1, 'the db not contains any store');
        });
    });

    describe('test getAllStores store', function () {
        it('getAll Stores store not by permission user', async function () {
            var result = await storeService.getAllStores('notuser');
            assert.equal(result.err, constantString.permssionDenied);
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'store return null');
        });

        it('getAll Stores store by manager', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await storeService.getAllStores(manager.sessionId);
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            //get all the store to ensure that the store not added
            assert.equal(result.stores.length, 1, 'the db not contains any store');
            result = await storeService.addStore(manager.sessionId, editStoreDetails)
            result = await storeService.getAllStores(manager.sessionId);
            assert.equal(result.stores.length, 2, 'the db not contains any store');
        });

        it('getAll Stores store by salesman', async function () {
            var result = await storeService.addStore(manager.sessionId, newStoreDetails);
            var result = await storeService.getAllStores(notManager.sessionId);
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            //get all the store to ensure that the store not added
            assert.equal(result.stores.length, 1, 'the db not contains any store');
            result = await storeService.addStore(manager.sessionId, editStoreDetails)
            result = await storeService.getAllStores(manager.sessionId);
            assert.equal(result.stores.length, 2, 'the db not contains any store');
        });
    });

    describe('test get store', function () {
        it('get store not by permission user', async function () {
            let result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result =  await storeService.getStore('notuser',newStoreDetails._id);
            assert.equal(result.err, constantString.permssionDenied);
            assert.equal(result.code, 401, 'code 401');
            assert.equal(result.store, null, 'store return null');
        });

        it('get store by manager', async function () {
            let result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await storeService.getStore(manager.sessionId, result.store._id.toString());
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.store.name, newStoreDetails.name);
        });

        it('get store by salesman', async function () {
            let result = await storeService.addStore(manager.sessionId, newStoreDetails);
            result = await storeService.getStore(notManager.sessionId, result.store._id.toString());
            assert.equal(result.err,null);
            assert.equal(result.code, 200, 'code 200');

            assert.equal(result.store.name, newStoreDetails.name);
        });

        it('get store not exist', async function () {
            let result = await storeService.getStore(notManager.sessionId, "notexisting1");
            assert.equal(result.err,constantString.storeDoesNotExist);
            assert.equal(result.code, 409, 'code 409');
        });
    });
});