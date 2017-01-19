var assert              = require('chai').assert;
var expect              = require('chai').expect;
var main                = require('../../main');
var axios               = require('axios');

let dal                 = require('../../src/DAL/dal');
let userModel           = require('../../src/Models/user');

var serverUrl = 'http://localhost:3000/';

/*
return axios.post(serverUrl + 'user/login', {
    username:username,
    password:password
}).then(function (info) {
    sessionId = info.data.sessionId;
    name = username;
    userType = info.data.userType;
    console.log('the user ' + username + ' Was logged in. user type: ' + info.data.userType);
    return returnVal(true ,info.data.userType);
}).catch(function (err) {
    errorMessage('Error in login', err);
    return returnVal(false, err);
})*/

describe('manager acceptance test', function(){

    let manager;
    let salesman;

    beforeEach(async function(){
        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        manager = await dal.addUser(manager);

        salesman = {};
        salesman.username = 'matan';
        salesman.personal = {};
        salesman.personal.id = '1234';
        salesman.startDate = new Date();
        salesman.jobDetails = {
            userType: 'salesman'
        };

    });

    afterEach(async function(){
        await dal.cleanDb();
    });

    describe('test add user', function(){
        it('add user valid', async function(){
            axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            }).then(function(info){
                expect(2).to.be.equal(2);
            }).catch(function (err){
                expect(2).to.be.equal(1);
            });
        });
    });
});

