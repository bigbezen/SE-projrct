var assert              = require('chai').assert;
var expect              = require('chai').expect;
var dal                 = require('../../src/DAL/dal');
var userServices        = require('../../src/Services/user/index');
var userModel           = require('../../src/Models/user');
var cypher              = require('../../src/Utils/Cypher/index');

var getUserDetails = function(){
    var userDetails = new Object();
    userDetails =
        {
            "username": "new user",
            "password": "123456",
            "startDate": "08-16-2016",
            "endDate": null,
            "personal": {
                "id": "22345",
                "firstName": "israel",
                "lastName": "israeli",
                "sex": "male",
                "birthday": "08-29-1990"
            },
            "contact": {
                "address": {
                    "street": "rager",
                    "number": "150",
                    "city": "someCity",
                    "zip": "11111"
                },
                "phone": "054-9999999",
                "email": "shahafstein@gmail.com"
            },
            "jobDetails": {
                "userType": "salesman",
                "area": "south",
                "channel": "spirit",
                "encouragements": []
            }
        };
    return userDetails;
};

describe('user unit test', function () {


    beforeEach(async function () {
        var user = new userModel();
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
            "email": "shahafstein@gmail.com"
        };
        user.jobDetails = {
            "userType": "manager",
            "area": "south",
            "channel": "spirit",
            "encouragements": []
        };

        var managerUser = new userModel();
        managerUser.username = 'manager';
        managerUser.password = cypher.encrypt("123456");
        managerUser.sessionId = "sessionId";
        managerUser.jobDetails.userType = "manager";
        managerUser.personal.id = "12345";
        managerUser.contact = "";
        managerUser.startDate = "";
        managerUser.endDate = "";

        dal.addUser(user);
        dal.addUser(managerUser);

    });

    afterEach(async function () {
        var res = await dal.cleanDb();
    });

    describe('TestLogin', function () {
        it('LoginValid', async function () {
            var result = await userServices.login('shahaf', '123456');
            expect(result).to.have.all.keys('sessionId', 'userType');
            expect(result.sessionId).to.be.a('string');
            expect(result.userType).to.be.a('string');

            result = await dal.getUserByUsername('shahaf');
            expect(result).to.have.property('sessionId').and.not.equal("");

        });

        it('TestLoginInvalidUserName', async function(){
            var result = await userServices.login('non existing username', '123456');
            expect(result).to.have.all.keys('code', 'err');
            expect(result.code).to.equal(409);
        });

        it('TestLoginInvalidPassword', async function(){
            var result = await userServices.login('shahaf', 'non valid password');
            expect(result).to.have.all.keys('code', 'err');
            expect(result.code).to.equal(409);
        });
    });

    describe('TestLogout', function () {
        it('LogoutValid', async function () {
            var sessionId = "sessionId";
            var user = await dal.getUserByUsername('shahaf');
            user.sessionId = sessionId;
            var res = await dal.editUser(user);

            res = await userServices.logout(sessionId);
            expect(res).to.have.property('code', 200);

            user = await dal.getUserByUsername('shahaf');
            expect(user.sessionId).to.be.undefined;
        });

        it('LogoutUserNotLoggedIn', async function(){
            var res = await userServices.logout('non existing sessionId');
            expect(res).to.have.property('code', 401);

            res = await userServices.logout("");
            expect(res).to.have.property('code', 401);
        });
    });

    describe('TestAddUser', function(){
        it('AddUserValid', async function(){
            var result = await userServices.addUser('sessionId', getUserDetails());
            var addedUserFromDb = await dal.getUserByUsername('new user');
            addedUserFromDb = addedUserFromDb.toObject();

            expect(result).to.have.all.keys('code', 'user');
            var resultUser = result.user;
            expect(resultUser).to.contain.all.keys('username', 'startDate', 'personal', 'contact', 'jobDetails');
            expect(resultUser).to.not.all.keys('password', 'sessionId');

            expect(addedUserFromDb).to.contain.all.keys('username', 'password', 'startDate', 'personal', 'contact', 'jobDetails');
            expect(addedUserFromDb).to.not.have.property('sessionId');
        });

        it('AddUserExistingUsername', async function(){
            var userDetails = getUserDetails();
            userDetails.username = "shahaf";

            var res = await userServices.addUser("sessionId", userDetails);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err');
        });

        it('AddUserExistingId', async function(){
            var userDetails = getUserDetails();
            userDetails.personal.id = "0987654321";

            var res = await userServices.addUser("sessionId", userDetails);
            expect(res).to.have.property('code', 409);
            expect(res).to.have.property('err');
        });

        it('NoPermissionToAddUser', async function(){
            var userDetails = getUserDetails();
            //change userType to salesman
            var managerUser = await dal.getUserByUsername('manager');
            managerUser.jobDetails.userType = "salesman";
            await managerUser.save();

            var res = await userServices.addUser("sessionId", userDetails);
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err');

            //change usertype to something fictional
            managerUser.jobDetails.userType = "other user types";
            await managerUser.save();

            var res = await userServices.addUser("sessionId", userDetails);
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err');
        });

        it('InvalidSessionId', async function(){
            var userDetails = getUserDetails();
            var result = await userServices.addUser('invalid session id', userDetails);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err');
        });


    });

    describe('TestEditUser', function(){
        it('EditUserValid', async function(){
            var userDetails = getUserDetails();
            userDetails.username = "new user";
            var res = await userServices.editUser('sessionId', 'shahaf', userDetails);
            expect(res).to.have.property('code', 200);

            res = await dal.getUserByUsername('shahaf');
            expect(res).to.be.null;

            res = await dal.getUserByUsername('new user');
            expect(res).to.not.be.null;

        });

        it('InvalidSessionId', async function(){
            var userDetails = getUserDetails();
            var result = await userServices.editUser('invalid session id', 'shahaf', userDetails);
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err');
        });

        it('EditUserExistingUsername', async function(){
            var userDetails = getUserDetails();
            userDetails.username = 'manager';
            var res = await userServices.editUser('sessionId', 'shahaf', userDetails);

            expect(res).to.have.property('code', 409)
        });

        it('EditUserExistingId', async function(){
            var userDetails = getUserDetails();
            userDetails.personal.id = '12345';
            var res = await userServices.editUser('sessionId', 'shahaf', userDetails);

            expect(res).to.have.property('code', 409)
        });

        it('EditUserNonExistingId', async function(){
            var userDetails = getUserDetails();
            var res = await userServices.editUser('sessionId', 'non existing user', userDetails);

            expect(res).to.have.property('code', 409)
        });

        it('NoPermissionToEditUser', async function(){
            var userDetails = getUserDetails();
            //change userType to salesman
            var managerUser = await dal.getUserByUsername('manager');
            managerUser.jobDetails.userType = "salesman";
            await managerUser.save();

            var res = await userServices.editUser("sessionId", "shahaf", userDetails);
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err');

            //change usertype to something fictional
            managerUser.jobDetails.userType = "other user types";
            await managerUser.save();

            var res = await userServices.editUser("sessionId", "shahaf", userDetails);
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err');
        });
    });

    describe('TestChangePassword', function(){
        it('ChangePasswordValid', async function(){
            var result = await userServices.changePassword('sessionId', '123456', 'new pass');

            expect(result).to.have.property('code', 200);

            var user = await dal.getUserByUsername('manager');
            user = user.toObject();
            assert.equal(cypher.decrypt(user.password), 'new pass');
        });

        it('InvalidSessionId', async function(){
           var result = await userServices.changePassword('non existing session id', '123456', 'new pass');

           expect(result).to.have.property('code', 401);
           expect(result).to.have.property('err');

            var user = await dal.getUserByUsername('manager');
            user = user.toObject();
            assert.equal(cypher.decrypt(user.password), '123456');
        });

        it('WrongCurrentPassword', async function(){
            var result = await userServices.changePassword('sessionId', 'wrong password', 'new pass');

            expect(result).to.have.property('code', 409);
            expect(result).to.have.property('err');

            var user = await dal.getUserByUsername('manager');
            user = user.toObject();
            assert.equal(cypher.decrypt(user.password), '123456');
        });
    });

    describe('TestRetrievePassword', function(){
        it('RetrievePasswordValid', async function(){
            var result = await userServices.retrievePassword('sessionId');

            expect(result).to.have.property('code', 200);

            //check that it did not change the old password
            var user = await dal.getUserBySessionId('sessionId');
            expect(user.password).to.equal(cypher.encrypt('123456'));
        });

        it('InvalidSessionId', async function(){
            var result = await userServices.retrievePassword('non existing session id');

            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err');
        });
    });

    describe('TestGetProfile', function(){
        it('GetProfileValid', async function(){
            var newUser = await dal.getUserByUsername('shahaf');
            newUser.sessionId = 'session';
            await dal.editUser(newUser);

            var result = await userServices.getProfile('session');

            expect(result).to.have.all.keys('code', 'user');
            expect(result.user).to.contain.all.keys('username', 'startDate', 'personal', 'contact', 'jobDetails');
            expect(result.user).to.not.have.all.keys('sessionId', 'password');
        }) ;

        it('InvalidSessionId', async function(){
            var result = await userServices.getProfile('invalid session id');
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err');
        });
    });

    describe('TestGetAllUsers', function(){
        it('GetAllUsersValid', async function(){
            var result = await userServices.getAllUsers('sessionId');
            expect(result).to.contain.all.keys('code', 'users');
            expect(result).to.have.property('code', 200);
            expect(result.users.length).to.be.equal(2);
            for(var user of result.users){
                expect(user).to.contain.all.keys('username', 'startDate', 'personal', 'contact', 'jobDetails');
                expect(user).to.not.have.all.keys('sessionId', 'password');
            }
        }) ;

        it('InvalidSessionId', async function(){
            var result = await userServices.getAllUsers('invalid session id');
            expect(result).to.have.property('code', 401);
            expect(result).to.have.property('err');
        });

        it('NoPermissionToGetAllUsers', async function(){
            //change userType to salesman
            var managerUser = await dal.getUserByUsername('manager');
            managerUser.jobDetails.userType = "salesman";
            await managerUser.save();

            var res = await userServices.getAllUsers("sessionId");
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err');

            //change usertype to something fictional
            managerUser.jobDetails.userType = "other user types";
            await managerUser.save();

            res = await userServices.getAllUsers("sessionId");
            expect(res).to.have.property('code', 401);
            expect(res).to.have.property('err');
        });
    });


});