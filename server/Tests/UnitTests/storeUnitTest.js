var assert            = require('chai').assert;
var dal               = require('../../src/DAL/dal');
var storeService      = require('../../src/Services/store/index')



describe('store unit test', function () {

    describe('before', function() {
        beforeEach(function () {

        });
    });

    describe('after', function() {
        afterEach(function () {
            dal.dropDb(function (err) {
                if (err != null) {
                    fail('before test failed');
                }
            });
        });
    });

    describe('test 01', function () {
        it('pass test', function () {
            //implementation of the test came here
            assert.equal(1, 2, 'not pass');
        });
    });

    describe('test 02', function () {
        it('pass test', function () {
            //implementation of the test came here
            assert.equal(1, 2, 'not pass');
        });
    });

});