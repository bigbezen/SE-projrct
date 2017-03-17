
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
let encouragementModel        = require('../../src/Models/encouragement');
let cypher              = require('../../src/Utils/Cypher/index');
let serverUrl = 'http://localhost:3000/';


describe('salesman acceptance test', function(){

    let manager;
    let salesman;

    beforeEach(async function () {
        let user = new userModel();
        user.username = 'shahaf';
        user.password = cypher.encrypt("123456");
        user.startDate = "09-16-2016";
        user.endDate = null;
        user.personal = {
            "id": "0987654321",
            "firstName": "israel",
            "lastName": "israeli",
            "sex": "male",
            "birthday": "01-01-1999"
        };
        user.contact = {
            "address": {
                "street": "st",
                "number": "100",
                "city": "some city",
                "zip": "11111"
            },
            "phone": "054-9999999",
            "email": "w@gmail.com"
        };
        user.jobDetails = {
            "userType": "manager",
            "area": "south",
            "channel": "spirit",
            "encouragements": []
        };

        let res = await dal.addUser(user);

        let managerUser = new userModel();
        managerUser.username = 'manager';
        managerUser.password = cypher.encrypt("123456");
        managerUser.sessionId = "sessionId";
        managerUser.jobDetails.userType = "manager";
        managerUser.personal.id = "12345";
        managerUser.contact = "";
        managerUser.startDate = "";

        managerUser.endDate = "";
        let pass = user.password;
        console.log(pass);
        res = await dal.addUser(managerUser);

    });

    afterEach(async function () {
        let res = await dal.cleanDb();
    });

    describe('TestLogin', function () {
        it('LoginValid', async function () {

            let result = await axios.post(serverUrl + 'user/login', {
                username: 'shahaf',
                password: '123456'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            result = await dal.getUserByUsername('shahaf');
            expect(result).to.have.property('sessionId').and.not.equal("");

        });

        it('TestLoginInvalidUserName', async function(){
            let result = await axios.post(serverUrl + 'user/login', {
                username: 'non existing username',
                password: '123456'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response.status).to.equal(409);
            expect(result.response.data).to.equal('user does not exist');
        });

        it('TestLoginInvalidParameter', async function(){
            let result = await axios.post(serverUrl + 'user/login', {
                username: 123456,
                password: '123456'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response.status).to.equal(404);
        });

        it('TestLoginInvalidPassword', async function(){
            let result = await axios.post(serverUrl + 'user/login', {
                username: 'shahaf',
                password: 'non valid password'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response.status).to.equal(409);
            expect(result.response.data).to.equal('password is incorrect');
        });
    });

    describe('TestLogout', function () {
        it('LogoutValid', async function () {
            let result = await axios.post(serverUrl + 'user/logout', {
                sessionId: 'sessionId',
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(result.status, 200);
            expect(result.sessionId).to.be.undefined;
        });

        it('LogoutUserNotLoggedIn', async function(){
            let result = await axios.post(serverUrl + 'user/logout', {
                sessionId: 'notLoginUser',
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response.status).to.equal(401);
        });

        it('LogoutUserNotInValidParameter', async function(){
            let result = await axios.post(serverUrl + 'user/logout', {
                sessionId: 2334234,
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response.status).to.equal(404);
        });
    });

    describe('TestChangePassword', function(){
        it('ChangePasswordValid', async function(){
            let result = await axios.post(serverUrl + 'user/changePassword', {
                sessionId: 'sessionId',
                oldPass: '123456',
                newPass: 'new pass'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.status).to.be.equal(200);

            //trying connect with the new password
            result = await axios.post(serverUrl + 'user/login', {
                username: 'manager',
                password: 'new pass'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });

        it('InvalidSessionId', async function(){
            let result = await axios.post(serverUrl + 'user/changePassword', {
                sessionId: 'non existing session id',
                oldPass: '123456',
                newPass: 'new pass'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 401);

            //ensure that the password not change
            result = await axios.post(serverUrl + 'user/login', {
                username: 'manager',
                password: '123456'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });

        it('WrongCurrentPassword', async function(){
            let result = await axios.post(serverUrl + 'user/changePassword', {
                sessionId: 'sessionId',
                oldPass: 'wrong password',
                newPass: 'new pass'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 409);

            //ensure that the password not change
            result = await axios.post(serverUrl + 'user/login', {
                username: 'manager',
                password: '123456'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });

        it('invalidSessionId', async function(){
            let result = await axios.post(serverUrl + 'user/changePassword', {
                sessionId: 98239,
                oldPass: 'wrong password',
                newPass: 'new pass'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result.response).to.have.property('status', 404);

            //ensure that the password not change
            result = await axios.post(serverUrl + 'user/login', {
                username: 'shahaf',
                password: '123456'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });
    });

    describe('TestRetrievePassword', function(){
        it('RetrievePasswordValid', async function(){
            let result = await axios.post(serverUrl + 'user/retrievePassword', {
                sessionId: 'sessionId'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(result.status, 200);

            //check that it did not change the old password
            result = await axios.post(serverUrl + 'user/login', {
                username: 'manager',
                password: '123456'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            expect(result).to.have.property('status', 200);
        });

        it('InvalidSessionId', async function(){
            let result = await axios.post(serverUrl + 'user/retrievePassword', {
                sessionId: 'non existing session id'
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(result.response.status,401);
        });

        it('IllegalParameter', async function(){
            let result = await axios.post(serverUrl + 'user/retrievePassword', {
                sessionId: 837492874
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(result.response.status, 404);
        });
    });

    describe('TestGetProfile', function(){
        // it('GetProfileValid', async function(){
        //     let result = await axios.get(serverUrl + 'user/getProfile', {
        //         headers:{
        //             sessionId:"sessionId"
        //         }
        //     });
        //
        //     assert.equal(result.status, 200);
        //     expect(result.user).to.contain.all.keys('username', 'startDate', 'personal', 'contact', 'jobDetails');
        //     expect(result.user).to.not.have.all.keys('sessionId', 'password');
        // }) ;
        //
        // it('InvalidSessionId', async function(){
        //     let result = await axios.get(serverUrl + 'user/getProfile', {
        //         headers:{
        //             sessionId:'sessionId'
        //         }
        //     }).then(async function(info){
        //         return info;
        //     }).catch(async function(err){
        //         return err;
        //     });
        //
        //     assert.equal(result.response.status, 401);
        // });

        it('IllegalParameter', async function(){
            let result = await axios.get(serverUrl + 'user/getProfile', {
                headers:{
                    sessionId:987349823
                }
            }).then(async function(info){
                return info;
            }).catch(async function(err){
                return err;
            });

            assert.equal(result.response.status, 404);
        });
    });
});

