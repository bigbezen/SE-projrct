var assert              = require('chai').assert;
var expect              = require('chai').expect;
var axios               = require('axios');
let dal                 = require('../../src/DAL/dal');

let userModel           = require('../../src/Models/user');

process.env['DB'] = 'AcceptenceTestDb';

var main                = require('../../main');

var serverUrl = 'http://localhost:3000/';


describe('salesman acceptance test', function(){

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

    describe('test add user', function(){
        it('add user valid', async function(){
            let result = await axios.post(serverUrl + 'management/addUser', {
                sessionId: manager.sessionId,
                userDetails: salesman
            });
            console.log(result);
        });
    });
});

