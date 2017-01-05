var assert              = require('chai').assert;
var expect              = require('chai').expect;
var dal                 = require('../../src/DAL/dal');
var shiftServices        = require('../../src/Services/shift/index');
var shiftModel           = require('../../src/Models/shift');
var userServices        = require('../../src/Services/user/index');
describe('shift unit test', function () {

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