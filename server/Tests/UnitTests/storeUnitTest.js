var assert            = require('chai').assert;
var dal               = require('../../src/DAL/dal');
var storeService      = require('../../src/Services/store/index');
var userModel           = require('../../src/Models/user');



describe('store unit test', function () {

    beforeEach(function () {
        var user = new userModel();
        user.username = 'shahaf';
        dal.addUser(user);


    });

    afterEach(async function () {
        dal.cleanDb();
    });

    describe('test 01', function () {
        it('pass test', function () {
            //implementation of the test came here
            assert.equal(1, 2, 'not pass');
            userModel.remove({});
        });
    });

    describe('test 02', function () {
        it('pass test', function () {
            //implementation of the test came here
            assert.equal(1, 2, 'not pass');
        });
    });

});