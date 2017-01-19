var assert              = require('chai').assert;
var expect              = require('chai').expect;
var main                = require('../../main');
var axios               = require('axios');

let dal                 = require('../../src/DAL/dal');
let userModel           = require('../../src/Models/user');

var serverUrl = 'http://localhost:3000/';


describe('manager acceptance test', function(){

    let manager;
    let salesman;

    beforeEach(async function(){
        let res = await dal.cleanDb();

        manager = new userModel();
        manager.username = 'shahaf';
        manager.sessionId = '123456';
        manager.jobDetails.userType = 'manager';
        manager = await dal.addUser(manager);

        salesman = {};
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
            expect(info).to.have.property('status', 200);
            expect(info).to.have.property('user'.username, salesman.username);
        });

        it('add user valid', async function () {
            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            });

            let res = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            });

            expect(info).to.have.property('status', 409);
            expect(info).to.have.property('err', '');
        });
    });
});

